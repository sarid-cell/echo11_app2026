// ECHO.11 — root app: nav, tab bar, theming, tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#8FB6FF",
  "theme": "dark",
  "fontScale": 100,
  "density": "regular",
  "liveTimer": true
}/*EDITMODE-END*/;

const ACCENTS = [
  '#8FB6FF', // signal blue
  '#E9E4D8', // mono / ivory
  '#E5A85C', // solar
  '#B79CFF', // plasma
];
// accents that need light ink on top
const DARK_INK_ACCENTS = new Set(['#8FB6FF', '#E9E4D8', '#E5A85C']);

const TABS = [
  { id: 'signal', label: 'Signal', icon: 'signal' },
  { id: 'insights', label: 'Insights', icon: 'insights' },
  { id: 'listen', label: 'Listen', icon: 'listen' },
  { id: 'about', label: 'About', icon: 'about' },
];

function useTimer(enabled) {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => setT(x => x + 1), 1000);
    return () => clearInterval(id);
  }, [enabled]);
  const h = String(Math.floor(t / 3600)).padStart(2, '0');
  const m = String(Math.floor((t % 3600) / 60)).padStart(2, '0');
  const s = String(t % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [tab, setTab] = React.useState('signal');
  const [reader, setReader] = React.useState(null);   // article or null
  const scrollRef = React.useRef(null);
  const timer = useTimer(t.liveTimer);

  const go = (view, payload) => {
    if (view === 'reader') { setReader(payload); }
    else { setReader(null); setTab(view); }
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const accentInk = DARK_INK_ACCENTS.has(t.accent) ? '#0A0A0B' : '#FFFFFF';
  const rootStyle = {
    '--accent': t.accent,
    '--accent-ink': accentInk,
    fontSize: `${t.fontScale}%`,
  };

  const view = reader ? 'reader' : tab;

  return (
    <div className="echo-root" data-theme={t.theme} data-density={t.density} style={rootStyle}>
      {/* top brand bar */}
      <div className="echo-topbar">
        {reader ? (
          <button onClick={() => go(tab)} style={{ background: 'none', border: 'none', color: 'var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', padding: 0 }}>
            <Icon name="back" size={16} /> Back
          </button>
        ) : (
          <div className="echo-wordmark"><b>ECHO</b><span>.11</span></div>
        )}
        {t.liveTimer && <div className="echo-timer"><span className="dot" />{timer}</div>}
      </div>

      {/* scrollable content */}
      <div className="echo-scroll" ref={scrollRef} key={view + (reader ? reader.id : '')}>
        {view === 'signal' && <HomeScreen go={go} />}
        {view === 'insights' && <InsightsScreen go={go} />}
        {view === 'listen' && <PodcastScreen />}
        {view === 'about' && <AboutScreen />}
        {view === 'reader' && <ReaderScreen article={reader} back={() => go(tab)} scrollRef={scrollRef} />}
      </div>

      {/* tab bar (hidden in reader) */}
      {!reader && (
        <div className="tabbar">
          {TABS.map(tb => (
            <button key={tb.id} className={tab === tb.id ? 'active' : ''} onClick={() => go(tb.id)}>
              <Icon name={tb.icon} size={21} />
              {tb.label}
            </button>
          ))}
        </div>
      )}

      {/* Tweaks */}
      <TweaksPanel>
        <TweakSection label="Brand" />
        <TweakColor label="Accent" value={t.accent} options={ACCENTS}
                    onChange={(v) => setTweak('accent', v)} />
        <TweakToggle label="Live signal clock" value={t.liveTimer}
                     onChange={(v) => setTweak('liveTimer', v)} />
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={t.theme} options={['dark', 'light']}
                    onChange={(v) => setTweak('theme', v)} />
        <TweakSection label="Layout" />
        <TweakSlider label="Text size" value={t.fontScale} min={88} max={118} step={2} unit="%"
                     onChange={(v) => setTweak('fontScale', v)} />
        <TweakRadio label="Density" value={t.density} options={['compact', 'regular', 'comfy']}
                    onChange={(v) => setTweak('density', v)} />
      </TweaksPanel>
    </div>
  );
}

function Root() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#08070a', padding: '24px 0' }}>
      <IOSDevice dark width={390} height={844}>
        <App />
      </IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
