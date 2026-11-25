/* Optional account. The Supabase library loads only after a sign-in click,
   a return from the email or Google link, or when a session is already stored.
   If SUPABASE_URL or SUPABASE_ANON_KEY is missing, this file hides sign-in
   and the app stays in guest mode. */
(function (root) {
  var LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/+esm';

  function clientKey(row) {
    return String(row && row.ts != null ? row.ts : '') + '|' + String(row && row.name || '');
  }

  function parseJson(raw, fallback) {
    try { var v = JSON.parse(raw); return v == null ? fallback : v; } catch (e) { return fallback; }
  }

  function historyToRows(list, userId) {
    if (!Array.isArray(list)) return [];
    var seen = {};
    var rows = [];
    list.forEach(function (row) {
      if (!row || !row.name || row.ts == null) return;
      var key = clientKey(row);
      if (seen[key]) return;
      seen[key] = 1;
      var ts = new Date(row.ts);
      if (isNaN(ts.getTime())) return;
      rows.push({
        user_id: userId,
        client_key: key,
        name: String(row.name).slice(0, 80),
        hz: row.hz ? String(row.hz).slice(0, 40) : null,
        category: row.cat ? String(row.cat).slice(0, 40) : null,
        minutes: parseInt(row.min, 10) || 0,
        listened_at: ts.toISOString(),
        feel: row.feel ? String(row.feel).slice(0, 40) : null
      });
    });
    return rows;
  }

  function rowsToHistory(rows) {
    return (rows || []).map(function (row) {
      return {
        name: row.name,
        hz: row.hz || '',
        cat: row.category || 'binaural',
        min: row.minutes || 0,
        ts: new Date(row.listened_at).getTime(),
        feel: row.feel || null
      };
    }).filter(function (row) { return row.name && !isNaN(row.ts); })
      .sort(function (a, b) { return b.ts - a.ts; });
  }

  function unionNames(a, b) {
    var out = [];
    var seen = {};
    [a, b].forEach(function (list) {
      (list || []).forEach(function (name) {
        if (!name || seen[name]) return;
        seen[name] = 1;
        out.push(String(name));
      });
    });
    return out;
  }

  function mergeBreath(local, remote) {
    var loc = local && local.last ? local : null;
    var rem = remote && remote.last_day ? { n: remote.days || 0, last: remote.last_day } : null;
    if (!loc) return rem;
    if (!rem) return loc;
    if (loc.last > rem.last) return loc;
    if (rem.last > loc.last) return rem;
    return { n: Math.max(loc.n || 0, rem.n || 0), last: loc.last };
  }

  if (typeof module !== 'undefined' && module.exports && typeof document === 'undefined') {
    module.exports = { clientKey: clientKey, historyToRows: historyToRows, rowsToHistory: rowsToHistory, unionNames: unionNames, mergeBreath: mergeBreath };
    return;
  }

  var state = {
    started: false,
    enabled: false,
    client: null,
    session: null,
    applying: false,
    signingOut: false,
    mergedFor: null,
    timers: {}
  };
  var slot = document.getElementById('account-slot');

  function hasStoredSession() {
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf('sb-') === 0 && k.indexOf('auth-token') > 0) return true;
      }
    } catch (e) {}
    return false;
  }

  function authReturn() {
    var h = location.hash || '';
    var q = location.search || '';
    return h.indexOf('access_token') >= 0 || q.indexOf('code=') >= 0;
  }

  function localHost() {
    if (root.__echoForceAccount) return false;
    var h = location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '::1' || h === '';
  }

  function readLocal(key, fallback) {
    try { return parseJson(localStorage.getItem(key), fallback); } catch (e) { return fallback; }
  }

  function writeLocal(key, value) {
    if (state.signingOut) return;
    state.applying = true;
    try {
      if (value == null) localStorage.removeItem(key);
      else localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    } catch (e) {}
    state.applying = false;
  }

  function refreshUi() {
    try { if (typeof normalizeStats === 'function') normalizeStats(); } catch (e) {}
    try { if (typeof renderHome === 'function') renderHome(); } catch (e) {}
    try { if (typeof renderProfile === 'function') renderProfile(); } catch (e) {}
    try { if (typeof renderSaved === 'function') renderSaved(); } catch (e) {}
    renderSlot();
  }

  function uid() { return state.session && state.session.user && state.session.user.id; }

  function cleanReturnUrl() {
    try {
      var u = new URL(location.href);
      if (!u.searchParams.has('code') && !(u.hash || '').length) return;
      u.searchParams.delete('code');
      u.hash = '';
      history.replaceState(null, '', u.pathname + u.search);
    } catch (e) {}
  }

  function ensureClient() {
    if (state.clientPromise) return state.clientPromise;
    if (!state.enabled || !state.config) return Promise.reject(new Error('off'));
    state.clientPromise = import(LIB).then(function (mod) {
      if (state.client) return state.client;
      var create = mod.createClient || (mod.default && mod.default.createClient);
      state.client = create(state.config.url, state.config.anonKey, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' }
      });
      state.client.auth.onAuthStateChange(function (event, session) {
        if (state.signingOut) return;
        state.session = session;
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) mergeThenPull();
        if (event === 'SIGNED_OUT') { state.session = null; state.mergedFor = null; renderSlot(); }
      });
      return state.client.auth.getSession().then(function (res) {
        if (state.signingOut) return state.client;
        state.session = res.data && res.data.session;
        cleanReturnUrl();
        if (state.session) mergeThenPull();
        else renderSlot();
        return state.client;
      });
    }).catch(function (err) {
      state.clientPromise = null;
      throw err;
    });
    return state.clientPromise;
  }

  function loadConfig() {
    if (state.configPromise) return state.configPromise;
    if (localHost()) {
      state.enabled = false;
      state.configPromise = Promise.resolve(null);
      return state.configPromise;
    }
    state.configPromise = fetch('/api/supabase-config', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : { enabled: false }; })
      .catch(function () { return { enabled: false }; })
      .then(function (cfg) {
        if (!cfg || !cfg.enabled || !cfg.url || !cfg.anonKey) { state.enabled = false; return null; }
        state.enabled = true;
        state.config = { url: cfg.url, anonKey: cfg.anonKey };
        return state.config;
      });
    return state.configPromise;
  }

  function pushHistory() {
    var id = uid();
    if (!id || !state.client || state.signingOut) return Promise.resolve();
    var rows = historyToRows(readLocal('echo:history', []), id);
    if (!rows.length) return Promise.resolve();
    return state.client.from('listening_history').upsert(rows, { onConflict: 'user_id,client_key' });
  }

  function pullHistory() {
    if (state.signingOut) return Promise.resolve();
    return state.client.from('listening_history')
      .select('name,hz,category,minutes,listened_at,feel,client_key')
      .order('listened_at', { ascending: false })
      .limit(50)
      .then(function (res) {
        if (res.error || state.signingOut) return;
        writeLocal('echo:history', rowsToHistory(res.data));
      });
  }

  function syncSaved(merge) {
    var id = uid();
    if (!id || state.signingOut) return Promise.resolve();
    var names = readLocal('echo:saved', []);
    if (!Array.isArray(names)) names = [];
    return state.client.from('bookmarks').select('name').then(function (res) {
      if (res.error || state.signingOut) return;
      var remote = (res.data || []).map(function (r) { return r.name; });
      var all = merge ? unionNames(names, remote) : names.slice();
      if (merge) writeLocal('echo:saved', all);
      var keep = {};
      all.forEach(function (n) { keep[n] = 1; });
      var remove = remote.filter(function (n) { return !keep[n]; });
      var jobs = [];
      if (all.length) {
        jobs.push(state.client.from('bookmarks').upsert(all.map(function (name) {
          return { user_id: id, name: name };
        }), { onConflict: 'user_id,name' }));
      }
      if (remove.length) jobs.push(state.client.from('bookmarks').delete().eq('user_id', id).in('name', remove));
      return Promise.all(jobs);
    });
  }

  function syncResume(merge) {
    var id = uid();
    if (!id || state.signingOut) return Promise.resolve();
    var open = readLocal('echo:open', null);
    if (open && open.name) {
      return state.client.from('resume_state').upsert({
        user_id: id,
        name: open.name,
        hz: open.hz || null,
        category: open.cat || null,
        elapsed: Number(open.elapsed) || 0,
        session_seconds: Number(open.session) || 0,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    }
    if (!merge) return state.client.from('resume_state').delete().eq('user_id', id);
    return state.client.from('resume_state').select('name,hz,category,elapsed,session_seconds').maybeSingle().then(function (res) {
      if (state.signingOut || !res.data || !res.data.name) return;
      writeLocal('echo:open', {
        name: res.data.name,
        hz: res.data.hz,
        cat: res.data.category,
        elapsed: Number(res.data.elapsed) || 0,
        session: Number(res.data.session_seconds) || 0
      });
    });
  }

  function syncBreath(merge) {
    var id = uid();
    if (!id || state.signingOut) return Promise.resolve();
    var local = readLocal('echo:breathDays', null);
    if (!merge) {
      if (!local || !local.last) return state.client.from('breath_streak').delete().eq('user_id', id);
      return state.client.from('breath_streak').upsert({
        user_id: id, days: local.n || 0, last_day: local.last, updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    }
    return state.client.from('breath_streak').select('days,last_day').maybeSingle().then(function (res) {
      if (state.signingOut) return;
      var merged = mergeBreath(local, res.data);
      if (!merged) return;
      writeLocal('echo:breathDays', merged);
      return state.client.from('breath_streak').upsert({
        user_id: id, days: merged.n || 0, last_day: merged.last || null, updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    });
  }

  function mergeThenPull() {
    var id = uid();
    if (!id || state.signingOut) return Promise.resolve();
    if (state.mergedFor === id) { renderSlot(); return Promise.resolve(); }
    state.mergedFor = id;
    return Promise.all([pushHistory().then(pullHistory), syncSaved(true), syncResume(true), syncBreath(true)])
      .then(refreshUi)
      .catch(function () { renderSlot(); });
  }

  function schedule(key) {
    clearTimeout(state.timers[key]);
    state.timers[key] = setTimeout(function () {
      if (!state.session || !state.client || state.applying || state.signingOut) return;
      var job = key === 'echo:history' ? function () { return pushHistory().then(pullHistory); }
        : key === 'echo:saved' ? function () { return syncSaved(false); }
        : key === 'echo:open' ? function () { return syncResume(false); }
        : key === 'echo:breathDays' ? function () { return syncBreath(false); }
        : null;
      if (job) job().then(refreshUi).catch(function () {});
    }, 400);
  }

  root.__echoOnStore = function (key) {
    if (!state.session || state.applying || state.signingOut) return;
    if (key !== 'echo:history' && key !== 'echo:saved' && key !== 'echo:open' && key !== 'echo:breathDays') return;
    schedule(key);
  };

  function msg(text) {
    var el = slot && slot.querySelector('.acct-msg');
    if (el) el.textContent = text || '';
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }

  function renderSlot() {
    if (!slot) return;
    if (!state.enabled) { slot.hidden = true; slot.innerHTML = ''; return; }
    slot.hidden = false;
    if (state.session && state.session.user) {
      var email = state.session.user.email || 'your account';
      slot.innerHTML = '<p class="acct-k">Signed in</p>'
        + '<p>Signed in as ' + escapeHtml(email) + '. Your history is saved to this account.</p>'
        + '<p class="acct-msg" role="status"></p>'
        + '<button type="button" class="acct-quiet" id="acct-delete">Delete my account and history</button>';
      slot.querySelector('#acct-delete').addEventListener('click', function () { openSheet('acct-delsheet'); });
      return;
    }
    slot.innerHTML = '<p class="acct-k">Keep your history</p>'
      + '<p>Sign in if you want this listening history on your other devices. You can keep using echo without an account.</p>'
      + '<div class="acct-row">'
      + '<button type="button" class="acct-go" id="acct-google">Continue with Google</button>'
      + '<form id="acct-email-form">'
      + '<label class="acct-label" for="acct-email">Email</label>'
      + '<input id="acct-email" type="email" autocomplete="email" inputmode="email" placeholder="you@email.com" />'
      + '<button type="submit" id="acct-send">Email me a link</button>'
      + '</form>'
      + '<p class="acct-msg" role="status"></p></div>';
    slot.querySelector('#acct-google').addEventListener('click', google);
    slot.querySelector('#acct-email-form').addEventListener('submit', emailLink);
  }

  function redirectTo() { return location.origin + '/'; }

  function google() {
    msg('Opening Google.');
    ensureClient().then(function (client) {
      return client.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo() } });
    }).then(function (res) {
      if (res && res.error) msg('That did not work. Try again in a moment.');
    }).catch(function () { msg('Sign-in is not available right now.'); });
  }

  function emailLink(e) {
    e.preventDefault();
    var input = document.getElementById('acct-email');
    var email = input ? String(input.value || '').trim() : '';
    if (email.indexOf('@') < 1) { msg('Add an email address.'); return; }
    msg('Sending a link.');
    ensureClient().then(function (client) {
      return client.auth.signInWithOtp({ email: email, options: { emailRedirectTo: redirectTo() } });
    }).then(function (res) {
      if (res && res.error) msg('That did not work. Try again in a moment.');
      else msg('Check your email for a sign-in link. It only signs you in.');
    }).catch(function () { msg('Sign-in is not available right now.'); });
  }

  function openSheet(id) {
    var sheet = document.getElementById(id);
    if (!sheet) return;
    sheet.hidden = false;
    requestAnimationFrame(function () { sheet.classList.add('open'); });
    if (window.EchoDialog) EchoDialog.open(sheet, { focus: '#' + id + '-title', onEscape: function () { closeSheet(id); } });
  }

  function closeSheet(id) {
    var sheet = document.getElementById(id);
    if (!sheet) return;
    sheet.classList.remove('open');
    setTimeout(function () { sheet.hidden = true; }, 380);
    if (window.EchoDialog) EchoDialog.close(sheet);
  }

  function signedInNow() { return !!(state.session && state.session.user); }

  function deleteRows(id) {
    if (!id || !state.client) return Promise.resolve();
    return Promise.all([
      state.client.from('listening_history').delete().eq('user_id', id),
      state.client.from('bookmarks').delete().eq('user_id', id),
      state.client.from('resume_state').delete().eq('user_id', id),
      state.client.from('breath_streak').delete().eq('user_id', id)
    ]);
  }

  function wipeLocal() {
    try { if (typeof clearListeningData === 'function') clearListeningData(); } catch (e) {}
    try {
      var ks = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf('echo:') === 0 && k.indexOf('echo:audit') !== 0) ks.push(k);
      }
      ks.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
  }

  function accountSignOut() {
    state.signingOut = true;
    state.applying = true;
    state.mergedFor = null;
    state.session = null;
    try { if (typeof window.__echoStopPlayer === 'function') window.__echoStopPlayer(); } catch (e) {}
    try { if (typeof clearListeningData === 'function') clearListeningData(); } catch (e) {}
    var out = state.client
      ? state.client.auth.signOut()
      : ensureClient().then(function (client) { return client.auth.signOut(); }).catch(function () {});
    return Promise.resolve(out).catch(function () {}).then(function () {
      state.applying = false;
      state.signingOut = false;
      closeSheet('acct-outsheet');
      try { if (typeof showView === 'function') showView('home'); } catch (e) {}
      try { if (typeof showAuth === 'function') showAuth(); } catch (e) {}
      renderSlot();
    });
  }

  function accountDelete() {
    var id = uid();
    var token = state.session && state.session.access_token;
    state.signingOut = true;
    return deleteRows(id).catch(function () {}).then(function () {
      if (!token) return { ok: false };
      return fetch('/api/delete-account', { method: 'POST', headers: { Authorization: 'Bearer ' + token } })
        .then(function (r) { return r.json(); })
        .catch(function () { return { ok: false }; });
    }).then(function (result) {
      var note = document.getElementById('acct-del-note');
      if (result && result.reason === 'server_key_missing' && note) {
        note.hidden = false;
        note.textContent = 'The history saved to this account is removed. The sign-in itself stays until the server key is set. This device is cleared.';
      }
      return accountSignOut().then(function () { return result; });
    }).then(function () {
      wipeLocal();
      location.reload();
    });
  }

  function hookExistingButtons() {
    var sign = document.getElementById('signout');
    if (sign && !sign.__echoAcct) {
      sign.__echoAcct = true;
      sign.addEventListener('click', function (e) {
        if (!signedInNow() && !hasStoredSession()) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        openSheet('acct-outsheet');
      }, true);
    }
    var del = document.getElementById('del-confirm');
    if (del && !del.__echoAcct) {
      del.__echoAcct = true;
      del.addEventListener('click', function (e) {
        if (!signedInNow() && !hasStoredSession()) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        accountDelete();
      }, true);
    }
    var outYes = document.getElementById('acct-out-yes');
    var outNo = document.getElementById('acct-out-no');
    var delYes = document.getElementById('acct-del-yes');
    var delNo = document.getElementById('acct-del-no');
    if (outYes) outYes.addEventListener('click', accountSignOut);
    if (outNo) outNo.addEventListener('click', function () { closeSheet('acct-outsheet'); });
    if (delYes) delYes.addEventListener('click', accountDelete);
    if (delNo) delNo.addEventListener('click', function () { closeSheet('acct-delsheet'); });
    var outScrim = document.getElementById('acct-out-scrim');
    var delScrim = document.getElementById('acct-del-scrim');
    if (outScrim) outScrim.addEventListener('click', function () { closeSheet('acct-outsheet'); });
    if (delScrim) delScrim.addEventListener('click', function () { closeSheet('acct-delsheet'); });
  }

  function begin(wantLib) {
    loadConfig().then(function (cfg) {
      state.started = true;
      if (!cfg) { if (slot) slot.hidden = true; return; }
      renderSlot();
      if (wantLib || hasStoredSession() || authReturn()) return ensureClient();
    }).catch(function () { if (slot) slot.hidden = true; });
  }

  hookExistingButtons();
  var profileBtn = document.getElementById('profile-open');
  if (profileBtn) profileBtn.addEventListener('click', function () { begin(false); });
  if (hasStoredSession() || authReturn()) begin(true);

  root.__echoAccount = { isSignedIn: signedInNow };
})(typeof window !== 'undefined' ? window : this);
