// ─────────────────────────────────────────────────────────────
// echo.11 · Supabase backend  (Auth + Database only)
//
// ARCHITECTURE (v2)
// Audio is generated 100% on-device with the Web Audio API — see the
// synthesis engine `freqStart` / `freqStop` in echo-frequencies.jsx. There is
// NO audio storage, NO bucket, NO file fetching. Real-time synthesis keeps the
// frequencies mathematically pure (a single sine spectral line per channel),
// which a compressed audio file could never preserve.
//
// Supabase is used ONLY for:
//   • auth    → Apple / Google / email (magic link) / anonymous
//   • database → user preferences: favorites + listening history/streak
//
// The MOMENT you paste your project URL + anon key into echo-config.js this
// connects. Until then, the whole app still runs — synthesis needs no backend,
// and the favorites/stats helpers degrade to no-ops (or localStorage).
// ─────────────────────────────────────────────────────────────

const ECHO_CFG = (window.ECHO_CONFIG || {});

// Base project URL only — strip a trailing /rest/v1 (or any path) if pasted.
const _cleanUrl = (ECHO_CFG.url || '').trim().replace(/\/(rest|auth|storage)\/v\d+\/?$/i, '').replace(/\/+$/, '');

const _hasClient = !!(window.supabase && _cleanUrl && ECHO_CFG.anonKey &&
                      !/YOUR_/.test(_cleanUrl) && !/YOUR_/.test(ECHO_CFG.anonKey));

let _sb = null;
function sb() {
  if (!_hasClient) return null;
  if (!_sb) _sb = window.supabase.createClient(_cleanUrl, ECHO_CFG.anonKey);
  return _sb;
}

// ── Backend façade ───────────────────────────────────────────
const EchoBackend = {
  configured: _hasClient,

  // --- auth ---
  async signInWithProvider(provider) {            // 'apple' | 'google'
    const c = sb(); if (!c) return { ok: true, mock: true };
    const { error } = await c.auth.signInWithOAuth({
      provider, options: { redirectTo: ECHO_CFG.redirectTo || window.location.origin },
    });
    return { ok: !error, error };
  },
  async signInWithEmail(email) {                  // magic link
    const c = sb(); if (!c) return { ok: true, mock: true };
    const { error } = await c.auth.signInWithOtp({ email });
    return { ok: !error, error };
  },
  async signInAnonymously() {
    const c = sb(); if (!c) return { ok: true, mock: true };
    const { error } = await c.auth.signInAnonymously();
    return { ok: !error, error };
  },
  async signOut() {
    const c = sb(); if (!c) return { ok: true, mock: true };
    const { error } = await c.auth.signOut();
    return { ok: !error, error };
  },
  async getUser() {
    const c = sb(); if (!c) return null;
    const { data } = await c.auth.getUser();
    return data?.user ?? null;
  },

  // --- frequencies catalog (optional DB-driven; falls back to local FREQS) ---
  async getFrequencies() {
    const c = sb();
    if (!c) return (window.FREQS || []);
    const { data, error } = await c.from('frequencies').select('*').order('sort');
    if (error || !data?.length) return (window.FREQS || []);
    return data;
  },

  // ── USER PREFERENCES ──────────────────────────────────────
  // Favorites: which frequencies a user starred. Backed by the `favorites`
  // table; if signed-out / unconfigured, mirrors to localStorage so the UI
  // still works offline.
  _localFavs() {
    try { return JSON.parse(localStorage.getItem('echo:favorites') || '[]'); }
    catch (e) { return []; }
  },
  _saveLocalFavs(ids) {
    try { localStorage.setItem('echo:favorites', JSON.stringify(ids)); } catch (e) {}
  },

  async getFavorites() {                          // → array of frequency ids
    const c = sb();
    const user = c ? await this.getUser() : null;
    if (!c || !user) return this._localFavs();
    const { data, error } = await c.from('favorites')
      .select('frequency_id').eq('user_id', user.id);
    if (error) return this._localFavs();
    return (data || []).map(r => r.frequency_id);
  },

  async addFavorite(freqId) {
    const local = new Set(this._localFavs()); local.add(freqId);
    this._saveLocalFavs([...local]);
    const c = sb(); const user = c ? await this.getUser() : null;
    if (!c || !user) return { ok: true, local: true };
    const { error } = await c.from('favorites')
      .upsert({ user_id: user.id, frequency_id: freqId }, { onConflict: 'user_id,frequency_id' });
    return { ok: !error, error };
  },

  async removeFavorite(freqId) {
    this._saveLocalFavs(this._localFavs().filter(id => id !== freqId));
    const c = sb(); const user = c ? await this.getUser() : null;
    if (!c || !user) return { ok: true, local: true };
    const { error } = await c.from('favorites')
      .delete().eq('user_id', user.id).eq('frequency_id', freqId);
    return { ok: !error, error };
  },

  async toggleFavorite(freqId) {
    const favs = await this.getFavorites();
    return favs.includes(freqId) ? (await this.removeFavorite(freqId), false)
                                 : (await this.addFavorite(freqId), true);
  },

  // ── LISTENING HISTORY / STREAK ────────────────────────────
  // Called by the audio engine on stop. Logs how long a frequency played.
  async logSession(freqId, seconds) {
    if (!seconds || seconds < 1) return;
    const c = sb(); if (!c) return;
    const user = await this.getUser();
    try {
      await c.from('sessions').insert({ user_id: user?.id ?? null, frequency_id: freqId, seconds });
    } catch (e) {}
  },

  // Aggregate listening stats for the signed-in user.
  async getListeningStats() {
    const c = sb(); const user = c ? await this.getUser() : null;
    if (!c || !user) return { totalSeconds: 0, sessions: 0, byFrequency: {} };
    const { data, error } = await c.from('sessions')
      .select('frequency_id, seconds').eq('user_id', user.id);
    if (error || !data) return { totalSeconds: 0, sessions: 0, byFrequency: {} };
    const byFrequency = {};
    let total = 0;
    for (const r of data) {
      total += r.seconds || 0;
      byFrequency[r.frequency_id] = (byFrequency[r.frequency_id] || 0) + (r.seconds || 0);
    }
    return { totalSeconds: total, sessions: data.length, byFrequency };
  },

  // ── CONNECTION TEST ───────────────────────────────────────
  // Run EchoBackend.test() in the console to verify Auth + Database are wired.
  async test() {
    const out = { configured: _hasClient, url: _cleanUrl };
    const c = sb();
    if (!c) { out.ok = false; out.reason = 'No client — check url + anonKey in echo-config.js'; console.log(out); return out; }
    try {
      // round-trip the DB: read the catalog table (public, RLS-readable).
      const { error: dbErr } = await c.from('frequencies').select('id').limit(1);
      out.database = dbErr ? `error: ${dbErr.message}` : 'reachable';
      // confirm the auth service answers.
      const { data: sess } = await c.auth.getSession();
      out.auth = 'reachable';
      out.signedIn = !!sess?.session;
      out.ok = !dbErr;
    } catch (e) { out.ok = false; out.reason = String(e); }
    console.log('%cecho.11 · Supabase (Auth + DB) connection test', 'font-weight:bold');
    console.log(out);
    return out;
  },
};

// ── Audio engine: 100% on-device synthesis ───────────────────
// One interface the whole app uses. No storage, no streaming — every tone is
// generated in real time by the Web Audio engine in echo-frequencies.jsx
// (freqStart / freqStop). Listening time is logged to Supabase on stop.
const EchoAudio = (function () {
  let playingId = null;
  let startedAt = 0;

  async function play(freq) {
    await stop();
    playingId = freq.id;
    startedAt = Date.now();
    if (typeof freqStart === 'function') freqStart(freq);   // pure-sine synthesis
    return { mode: 'synth' };
  }

  async function stop() {
    if (playingId && startedAt) {
      EchoBackend.logSession(playingId, Math.round((Date.now() - startedAt) / 1000));
    }
    if (typeof freqStop === 'function') freqStop();
    playingId = null; startedAt = 0;
  }

  return { play, stop, get mode() { return playingId ? 'synth' : null; }, get configured() { return EchoBackend.configured; } };
})();

Object.assign(window, { EchoBackend, EchoAudio });
