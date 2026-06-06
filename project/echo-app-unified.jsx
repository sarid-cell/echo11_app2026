// ECHO.11 — unified app shell: Splash → Protocol → tabbed app.
// Signal tab = the Frequencies screen. Insights / Listen / About reuse the
// existing brand screens. One stylesheet, one style, dark/light + accent tweaks.

const ACCENTS = ['#82A9FF', '#1A1A1A', '#E5A85C', '#B79CFF'];
const DARK_INK_ACCENTS = new Set(['#82A9FF', '#E5A85C', '#B79CFF']);

const TABS = [
  { id: 'signal', label: 'Signal', icon: 'signal' },
  { id: 'insights', label: 'Insights', icon: 'insights' },
  { id: 'listen', label: 'Listen', icon: 'listen' },
  { id: 'about', label: 'About', icon: 'about' },
];

function useTimer(enabled) {
  const [, force] = React.useState(0);
  const startRef = React.useRef(Date.now());
  React.useEffect(() => {
    if (!enabled) return;
    startRef.current = Date.now();
    const id = setInterval(() => force(x => x + 1), 1000);
    return () => clearInterval(id);
  }, [enabled]);
  const t = enabled ? Math.floor((Date.now() - startRef.current) / 1000) : 0;
  const p = (n) => String(Math.floor(n)).padStart(2, '0');
  return `${p(t / 3600)}:${p((t % 3600) / 60)}:${p(t % 60)}`;
}

// ── Splash ── pure obsidian, centered echo.|| logo. No click; auto cross-fades.
function Splash({ leaving }) {
  return (
    <div className={'splash' + (leaving ? ' leaving' : '')} aria-hidden={leaving}>
      <EchoLogo size="splash" light />
    </div>
  );
}

// ── Auth / Sign in ───────────────────────────────────────────
function AppleGlyph() {
  return (<svg className="pic" viewBox="0 0 24 24" fill="currentColor"><path d="M16.36 12.78c.02 2.46 2.16 3.28 2.18 3.29-.02.06-.34 1.17-1.13 2.32-.68.99-1.39 1.97-2.5 1.99-1.1.02-1.45-.65-2.7-.65-1.26 0-1.65.63-2.69.67-1.08.04-1.9-1.07-2.58-2.06-1.4-2.02-2.47-5.72-1.03-8.21.71-1.24 1.99-2.02 3.37-2.04 1.06-.02 2.07.72 2.72.72.65 0 1.87-.89 3.15-.76.54.02 2.05.22 3.01 1.64-.08.05-1.8 1.05-1.78 3.16M14.3 5.36c.57-.69.96-1.65.85-2.61-.83.03-1.83.55-2.42 1.24-.53.61-1 1.59-.87 2.53.92.07 1.87-.47 2.44-1.16"/></svg>);
}
function GoogleGlyph() {
  return (<svg className="pic" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.5 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.89a5.04 5.04 0 0 1-2.18 3.31v2.75h3.53c2.07-1.9 3.26-4.71 3.26-7.96"/><path fill="#34A853" d="M12 23c2.95 0 5.43-.98 7.24-2.65l-3.53-2.75c-.98.66-2.23 1.05-3.71 1.05-2.85 0-5.27-1.93-6.13-4.52H2.22v2.84A11 11 0 0 0 12 23"/><path fill="#FBBC05" d="M5.87 14.13a6.6 6.6 0 0 1 0-4.26V7.03H2.22a11 11 0 0 0 0 9.94z"/><path fill="#EA4335" d="M12 5.35c1.61 0 3.05.55 4.18 1.64l3.13-3.13C17.43 2.1 14.95 1 12 1 7.7 1 3.99 3.47 2.22 7.03l3.65 2.84C6.73 7.28 9.15 5.35 12 5.35"/></svg>);
}

function Auth({ onDone }) {
  const [email, setEmail] = React.useState('');
  const [err, setErr] = React.useState(false);
  const [busy, setBusy] = React.useState(null);     // 'apple' | 'google' | 'email' | 'guest'
  const [authErr, setAuthErr] = React.useState(null); // { method, message, run }

  // Run an auth method with a pending state and perceptible feedback. Sign-in
  // is best-effort: a non-OK backend response (e.g. anonymous provider disabled
  // on the project, or offline) still lets the user continue as a local session
  // — the app works without a backend. Only a thrown exception surfaces Retry.
  const run = async (method, fn) => {
    if (busy) return;
    setBusy(method); setAuthErr(null);
    try {
      await Promise.all([Promise.resolve().then(fn), echoWait(760)]);
      onDone(method);
    } catch (e) {
      setBusy(null);
      setAuthErr({
        method,
        message: 'We couldn’t sign you in.',
        hint: 'Check your connection and try again.',
        run: () => run(method, fn),
      });
    }
  };

  const submitEmail = () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setErr(true); return; }
    run('email', () => EchoBackend.signInWithEmail(email));
  };

  return (
    <div className="auth">
      <img className="auth-bg" crossOrigin="anonymous" src="img/desert.webp" alt="A robed figure walking across pale, wind-rippled desert dunes" />
      <div className="auth-scrim" aria-hidden="true" />
      <div className="auth-inner">
      <div className="auth-head">
        <div className="auth-kick"><span className="auth-kick-ln" aria-hidden="true" /><EchoLogo size="sm" /></div>
        <h1 className="auth-title">Decoding the Algorithm of Human Resilience</h1>
        <p className="auth-sub">22 frequencies to tune your nervous system. Sign in to save your signal across devices.</p>
      </div>

      {authErr && (
        <div style={{ marginBottom: 14 }}>
          <InlineError message={authErr.message} hint={authErr.hint} onRetry={authErr.run} retrying={busy === authErr.method} />
        </div>
      )}

      <div className="auth-providers">
        <button className={'auth-provider apple' + (busy === 'apple' ? ' is-busy' : '')} disabled={!!busy} onClick={() => run('apple', () => EchoBackend.signInWithProvider('apple'))} aria-label="Continue with Apple">
          {busy === 'apple' ? <><Spinner size={17} tone="light" /> Signing in…</> : <><AppleGlyph /> Continue with Apple</>}
        </button>
        <button className={'auth-provider' + (busy === 'google' ? ' is-busy' : '')} disabled={!!busy} onClick={() => run('google', () => EchoBackend.signInWithProvider('google'))} aria-label="Continue with Google">
          {busy === 'google' ? <><Spinner size={17} tone="ink" /> Signing in…</> : <><GoogleGlyph /> Continue with Google</>}
        </button>
      </div>

      <div className="auth-divider"><span className="ln" /><span>or</span><span className="ln" /></div>

      <div className="auth-field">
        <label className="auth-label" htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          className={'auth-input' + (err ? ' invalid' : '')}
          type="email" inputMode="email" autoCapitalize="none" placeholder="you@email.com"
          aria-label="Email address" aria-invalid={err} disabled={!!busy}
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErr(false); }}
          onKeyDown={(e) => e.key === 'Enter' && submitEmail()}
        />
        {err && <span className="auth-field-err" role="alert">Enter a valid email address.</span>}
        <button className={'btn solid' + (busy === 'email' ? ' is-busy' : '')} style={{ marginTop: 4 }} disabled={!!busy} onClick={submitEmail} aria-label="Continue with email">
          {busy === 'email' ? <><Spinner size={16} tone="light" /> Sending link…</> : 'Continue with email'}
        </button>
      </div>

      <div className="auth-legal">
        By continuing you agree to our <a href="https://echo-11-site.vercel.app/terms" target="_blank" rel="noreferrer">Terms</a> &amp; <a href="https://echo-11-site.vercel.app/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>.
      </div>
      <button className="auth-guest" disabled={!!busy} onClick={() => run('guest', () => EchoBackend.signInAnonymously())} aria-label="Continue as guest">
        {busy === 'guest' ? 'One moment…' : 'Continue as guest →'}
      </button>
      </div>
    </div>
  );
}
function Protocol({ onBegin, onSkip }) {
  const [agreed, setAgreed] = React.useState(false);
  const steps = [
    { n: '01', h: 'Stereo Separation', p: 'Each ear receives a slightly different tone. With headphones the two channels never mix in the air — so the difference is resolved by your brain, not your speakers.' },
    { n: '02', h: 'Neuro-Entrainment', p: 'Your brain generates a third, phantom beat at the gap between the two tones — then gradually falls into step with its rhythm. This is the frequency-following response.' },
    { n: '03', h: 'Nervous System Shift', p: 'As your dominant brainwave settles toward that rhythm, the body follows: breath slows and a calmer baseline becomes easier to return to.' },
  ];
  return (
    <div className="echo-page">
      <div className="protocol-head">
        <div className="kicker">The Protocol</div>
        <h1>The Architecture of Sound</h1>
        <p className="sub">How a pair of frequencies can gently guide your state — for relaxation and focus.</p>
      </div>
      <div className="protocol-steps">
        {steps.map(s => (
          <div className="protocol-step" key={s.n}>
            <div className="pnum" aria-hidden="true">{s.n}</div>
            <div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Safety & consent (required, non-bypassable) ───────────── */}
      <div className="consent" role="group" aria-labelledby="consent-h">
        <div className="consent-kick" id="consent-h">Before you begin</div>
        <ul className="consent-list">
          <li>echo.|| is a <b>wellness &amp; relaxation tool — not a medical device.</b> It does not diagnose, treat, cure, or prevent any condition.</li>
          <li><b>Do not use while driving</b> or operating machinery.</li>
          <li>If you have epilepsy or a seizure disorder, a pacemaker, or are pregnant, <b>consult a physician first.</b></li>
          <li>Stop if you feel any discomfort, dizziness, or unease.</li>
        </ul>
        <label className="consent-check">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} aria-label="I have read and agree to the safety guidance" />
          <span>I’ve read the safety guidance and understand this is a wellness tool, not medical advice.</span>
        </label>
      </div>

      <div className="protocol-cta">
        <button className="btn solid" onClick={onBegin} disabled={!agreed} aria-disabled={!agreed} aria-label="Agree and continue">I Understand — Continue</button>
        <a className="protocol-legal" href="https://echo-11-site.vercel.app/terms" target="_blank" rel="noreferrer">Terms of Service</a>
        <span className="protocol-legal-dot" aria-hidden="true">·</span>
        <a className="protocol-legal" href="https://echo-11-site.vercel.app/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
      </div>
    </div>
  );
}

function App() {
  const [t, setTweak] = useSettings();                   // appearance state (replaces Tweaks)
  const [stage, setStage] = React.useState('splash');   // splash | auth | protocol | app
  const [tab, setTab] = React.useState('signal');
  const [signalView, setSignalView] = React.useState('home'); // home | library
  const [libMode, setLibMode] = React.useState('all');
  const [reader, setReader] = React.useState(null);
  const [podcast, setPodcast] = React.useState(false);
  const [player, setPlayer] = React.useState(null);      // frequency object shown in Player modal
  const [plClosing, setPlClosing] = React.useState(false);
  const [currentId, setCurrentId] = React.useState(null); // playing frequency id
  const [paywall, setPaywall] = React.useState(false);
  const [pwClosing, setPwClosing] = React.useState(false);
  const [unlocked, setUnlocked] = React.useState(false);
  const [favs, setFavs] = React.useState([]);            // saved frequency ids
  const [savedToast, setSavedToast] = React.useState(''); // brief "Saved"/"Removed" confirm
  const savedToastTimer = React.useRef(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [authMethod, setAuthMethod] = React.useState(null); // how the user signed in
  const [splashLeaving, setSplashLeaving] = React.useState(false);
  const [splashMounted, setSplashMounted] = React.useState(true);
  const [hpToast, setHpToast] = React.useState(false);   // first-play headphone reminder
  const hpTimer = React.useRef(null);
  const scrollRef = React.useRef(null);
  // Session timer — counts up only while audio is actively playing.
  // (No persistent wall-clock; the iOS status bar already shows the time.)
  const timer = useTimer(!!currentId);

  React.useEffect(() => () => EchoAudio.stop(), []);

  // Load saved frequencies once (backend when signed-in, else localStorage).
  React.useEffect(() => {
    let alive = true;
    EchoBackend.getFavorites().then((ids) => { if (alive) setFavs(Array.isArray(ids) ? ids : []); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  // Toggle a favorite — optimistic local update + persist (backend/localStorage).
  const toggleFav = (f) => {
    if (!f) return;
    const has = favs.includes(f.id);
    setFavs(has ? favs.filter((id) => id !== f.id) : [...favs, f.id]);
    (has ? EchoBackend.removeFavorite(f.id) : EchoBackend.addFavorite(f.id));
    setSavedToast(has ? 'Removed from Saved' : 'Saved');
    clearTimeout(savedToastTimer.current);
    savedToastTimer.current = setTimeout(() => setSavedToast(''), 1700);
  };

  // Cinematic auto-transition: hold 2500ms → mount Auth underneath + start a slow
  // 1300ms opacity cross-fade → unmount the splash once the fade completes.
  React.useEffect(() => {
    const HOLD = 2500, FADE = 3000;
    const t1 = setTimeout(() => { setStage('auth'); setSplashLeaving(true); }, HOLD);
    const t2 = setTimeout(() => setSplashMounted(false), HOLD + FADE);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const openPaywall = () => { setPwClosing(false); setPaywall(true); };
  const closePaywall = () => { setPwClosing(true); setTimeout(() => { setPaywall(false); setPwClosing(false); }, 320); };
  const startTrial = () => { setUnlocked(true); closePaywall(); };

  // Log out → end the Supabase session and return to the strict Auth screen.
  const handleLogout = async () => {
    try { await EchoBackend.signOut(); } catch (e) {}
    EchoAudio.stop();
    setCurrentId(null); setUnlocked(false); setReader(null); setPodcast(false);
    setTab('signal'); setSignalView('home'); setSettingsOpen(false); setAuthMethod(null); setStage('auth');
  };

  const openLibrary = (mode) => { setLibMode(mode || 'all'); setSignalView('library'); if (scrollRef.current) scrollRef.current.scrollTop = 0; };
  const goHome = () => { setSignalView('home'); if (scrollRef.current) scrollRef.current.scrollTop = 0; };

  const go = (view, payload) => {
    if (view === 'reader') { setReader(payload); }
    else if (view === 'podcast') { setReader(null); setPodcast(true); }
    else { setReader(null); setPodcast(false); setTab(view); }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const toggleFreq = (f) => {
    if (f.premium && !unlocked) { openPaywall(); return; }
    if (currentId === f.id) { setCurrentId(null); EchoAudio.stop(); }
    else {
      EchoAudio.play(f); setCurrentId(f.id);
      // First-play headphone reminder — binaural only, shown once per device.
      if (f.type === 'binaural') {
        let seen = false;
        try { seen = localStorage.getItem('echo:hpToast') === '1'; } catch (e) {}
        if (!seen) {
          setHpToast(true);
          try { localStorage.setItem('echo:hpToast', '1'); } catch (e) {}
          clearTimeout(hpTimer.current);
          hpTimer.current = setTimeout(() => setHpToast(false), 4200);
        }
      }
    }
  };

  // Open the full-screen Player modal for a frequency (premium-gated).
  const openPlayer = (f) => {
    if (!f) return;
    if (f.premium && !unlocked) { openPaywall(); return; }
    setPlClosing(false); setPlayer(f);
  };
  const closePlayer = () => { setPlClosing(true); setTimeout(() => { setPlayer(null); setPlClosing(false); }, 320); };
  // SOS → push straight into the Player on a calming 6 Hz theta reset.
  const openSOS = () => openPlayer(freqById('theta'));
  // Quick-state card → push into the Player on that category's lead frequency.
  const CATEGORY_LEAD = { focus: 'gamma', sleep: 'delta', abundance: 'hz528' };
  const openCategory = (mode) => openPlayer(freqById(CATEGORY_LEAD[mode] || 'hz528'));

  const accentInk = DARK_INK_ACCENTS.has(t.accent) ? '#0A0A0B' : '#FFFFFF';
  const rootStyle = { '--accent': t.accent, '--accent-ink': accentInk, fontSize: `${t.fontScale}%` };
  const view = reader ? 'reader' : (podcast ? 'podcast' : tab);
  const now = currentId ? freqById(currentId) : null;

  return (
    <div className="echo-root" data-theme={t.theme} data-density={t.density} data-type={t.typeface} style={rootStyle}>
      {splashMounted && <Splash leaving={splashLeaving} />}

      {/* top brand bar */}
      <div className="echo-topbar">
        {(reader || podcast) ? (
          <button onClick={() => go(tab)} style={{ background: 'none', border: 'none', color: 'var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', padding: 0 }}>
            <Icon name="back" size={16} /> Back
          </button>
        ) : (
          <EchoLogo size="sm" />
        )}
        {currentId && <div className="echo-timer" role="timer" aria-label="Session time elapsed"><span className="dot" aria-hidden="true" />{timer}</div>}
      </div>
      {/* content */}
      <div className="echo-scroll" ref={scrollRef} key={stage + view + signalView + (reader ? reader.id : '')}>
        {stage === 'auth' && <Auth onDone={(m) => { setAuthMethod(m); setStage('protocol'); }} />}
        {stage === 'protocol' && <Protocol onBegin={() => setStage('app')} onSkip={() => setStage('app')} />}
        {stage === 'app' && view === 'signal' && (
          <HomeDashboard currentId={currentId} onToggle={toggleFreq} unlocked={unlocked} onOpenPlayer={openPlayer} onSOS={openSOS} favs={favs} onToggleFav={toggleFav} />
        )}
        {stage === 'app' && view === 'insights' && <InsightsScreen go={go} />}
        {/* Listen tab is the Podcast Hub — strictly CTRL+HUMAN, no frequencies. */}
        {stage === 'app' && (view === 'listen' || view === 'podcast') && <PodcastScreen />}
        {stage === 'app' && view === 'about' && <AboutScreen unlocked={unlocked} onUnlock={openPaywall} onLogout={handleLogout} savedCount={favs.length} onOpenSaved={() => { go('signal'); setSignalView('home'); }} onOpenSettings={() => setSettingsOpen(true)} />}
        {stage === 'app' && view === 'reader' && <ReaderScreen article={reader} back={() => go(tab)} scrollRef={scrollRef} />}
      </div>

      {/* first-play headphone reminder toast */}
      {hpToast && (
        <div className="hp-toast" role="status" aria-live="polite" onClick={() => setHpToast(false)}>
          <span className="hp-toast-ico" aria-hidden="true">🎧</span>
          <span>For binaural frequencies, headphones are recommended.</span>
        </div>
      )}

      {/* favorite add/remove confirmation */}
      {savedToast && (
        <div className="saved-toast" role="status" aria-live="polite">{savedToast}</div>
      )}

      {/* now playing (persists across tabs) */}
      {now && (
        <div className="now-bar">
          <div className="eq"><i /><i /><i /></div>
          <div className="nmid">
            <div className="nname">{now.name}</div>
            <div className="nmeta">Playing · {now.hz} Hz</div>
          </div>
          <button className="nstop" onClick={() => { setCurrentId(null); EchoAudio.stop(); }}>Stop</button>
        </div>
      )}

      {/* player full-screen modal */}
      {player && (
        <div className={'player-modal' + (plClosing ? ' closing' : '')}>
          <PlayerScreen freq={player} playing={currentId === player.id} onToggle={toggleFreq} onClose={closePlayer} saved={favs.includes(player.id)} onToggleFav={() => toggleFav(player)} />
        </div>
      )}

      {/* settings sub-screen (pushed from About → replaces the Tweaks panel) */}
      {stage === 'app' && settingsOpen && (
        <SettingsScreen t={t} setTweak={setTweak} accents={ACCENTS} method={authMethod} unlocked={unlocked} onUnlock={openPaywall} onLogout={handleLogout} onBack={() => setSettingsOpen(false)} />
      )}

      {/* paywall bottom-sheet modal */}
      {paywall && (
        <div className={'paywall-modal' + (pwClosing ? ' closing' : '')}>
          <div className="paywall-scrim" onClick={closePaywall} />
          <div className="paywall-sheet">
            <Paywall sheet onClose={closePaywall} onStart={startTrial} />
          </div>
        </div>
      )}

      {/* tab bar */}
      {stage === 'app' && !reader && !settingsOpen && (
        <div className="tabbar">
          {TABS.map(tb => (
            <button key={tb.id} className={tab === tb.id ? 'active' : ''} aria-label={tb.label + ' tab'} aria-current={tab === tb.id ? 'page' : undefined} onClick={() => { go(tb.id); if (tb.id === 'signal') setSignalView('home'); }}>
              <Icon name={tb.icon} size={21} />
              {tb.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Root() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#08070a', padding: '24px 0' }}>
      <IOSDevice width={390} height={844}>
        <App />
      </IOSDevice>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
