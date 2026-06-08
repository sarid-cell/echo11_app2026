// echo.|| — Player modal (the core experience).
// Obsidian immersion + soft signal-blue pulse. Headphone indicator, L/R technical
// readout, duration selector + countdown, clinical neuroplastic description.

function bandOf(beat) {
  if (beat == null) return null;
  if (beat < 4) return 'Delta';
  if (beat < 8) return 'Theta';
  if (beat < 12) return 'Alpha';
  if (beat < 30) return 'Beta';
  return 'Gamma';
}

const CLINICAL = {
  Delta: 'Delta is associated with deep rest and wind-down — many people use it to ease toward sleep.',
  Theta: 'Theta is associated with deep relaxation and meditation — a calming field for an overstimulated mind.',
  Alpha: 'Alpha is associated with calm, alert focus — a relaxed-readiness many link to creativity.',
  Beta:  'Beta is associated with active concentration — a steady backdrop for demanding cognitive work.',
  Gamma: 'Gamma is associated with heightened focus and attention — the brain at full engagement.',
};
const CLINICAL_PURE = {
  healing:   'A pure resonant tone used to settle the system and support a felt sense of repair. Experiential, not a medical treatment.',
  sleep:     'A pure low-resonance tone to ease the body toward rest and wind-down.',
  focus:     'A pure tone used to steady attention and create a clean acoustic field for focus.',
  abundance: 'A pure tone associated with openness and flow states in resonance practice.',
};

const DURATIONS = [
  { id: 15, label: '15m', secs: 15 * 60 },
  { id: 30, label: '30m', secs: 30 * 60 },
  { id: 'loop', label: 'Loop', secs: null },
];

const MOODS = [
  { id: 'calm',    label: 'Calm' },
  { id: 'focused', label: 'Focused' },
  { id: 'neutral', label: 'Neutral' },
  { id: 'tired',   label: 'Tired' },
];

function MoodIcon({ id }) {
  const s = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '1.7', strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (id === 'calm')    return React.createElement('svg', s, React.createElement('path', { d: 'M12 2C6.5 2 4 7 4 10c0 5 4 9 8 12 4-3 8-7 8-12 0-3-2.5-8-8-8z' }));
  if (id === 'focused') return React.createElement('svg', s, React.createElement('circle', { cx: '12', cy: '12', r: '9' }), React.createElement('circle', { cx: '12', cy: '12', r: '3', fill: 'currentColor' }));
  if (id === 'neutral') return React.createElement('svg', s, React.createElement('line', { x1: '5', y1: '9', x2: '19', y2: '9' }), React.createElement('line', { x1: '5', y1: '15', x2: '19', y2: '15' }));
  if (id === 'tired')   return React.createElement('svg', s, React.createElement('path', { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' }));
  return null;
}

function PlayerScreen({ freq, playing, onToggle, onClose, saved, onToggleFav }) {
  const [dur, setDur] = React.useState('loop');
  const [left, setLeft] = React.useState(null);     // seconds remaining (null = loop)
  const [completed, setCompleted] = React.useState(null); // { secs } once a timed session finishes
  const [mood, setMood] = React.useState(null);
  const band = bandOf(freq.beat);
  const isBinaural = freq.type === 'binaural';

  // Opening a different frequency resets any prior completion screen.
  React.useEffect(() => { setCompleted(null); setMood(null); }, [freq.id]);

  // countdown when a fixed duration is selected and audio is playing
  React.useEffect(() => {
    const sel = DURATIONS.find(d => d.id === dur);
    if (!playing || !sel || sel.secs == null) { setLeft(null); return; }
    setLeft(sel.secs);
    const id = setInterval(() => {
      setLeft(prev => {
        if (prev == null) return null;
        if (prev <= 1) {
          clearInterval(id);
          // Defer side-effects out of the state updater: stop audio + reveal
          // the Session Complete screen.
          Promise.resolve().then(() => { onToggle(freq); setCompleted({ secs: sel.secs }); });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [dur, playing, freq.id]);

  // Restart the same protocol from the completion screen.
  const listenAgain = () => { setCompleted(null); onToggle(freq); };

  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const clinical = band ? CLINICAL[band] : (CLINICAL_PURE[freq.mode] || CLINICAL_PURE.focus);

  // a tiling sine path (wavelength 48px), animated horizontally while playing
  const wavePath = (() => {
    let d = 'M -48 24';
    for (let i = 0; i < 13; i++) d += ' q 12 -17 24 0 q 12 17 24 0';
    return d;
  })();

  // ── Session Complete ── shown when a fixed-duration session reaches 0.
  if (completed) {
    const mins = Math.max(1, Math.round(completed.secs / 60));
    const durLabel = `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;

    const shareSession = async () => {
      const text = `Just completed ${durLabel} of ${freq.name} with echo.|| ✦`;
      if (navigator.share) {
        try { await navigator.share({ text }); } catch (_) {}
      } else {
        try { await navigator.clipboard.writeText(text); } catch (_) {}
      }
    };

    return (
      <div className="player session-complete">
        <div className="player-head">
          <button className="player-close" onClick={onClose} aria-label="Close"><Icon name="chevdown" size={20} /></button>
          <EchoLogo size="sm" light />
          <span style={{ width: 38 }} />
        </div>
        <div className="sc-inner" role="status" aria-live="polite">
          <div className="sc-halo" aria-hidden="true">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#82A9FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.2 4.2L19 7" />
            </svg>
          </div>
          <div className="sc-kick">Session Complete</div>
          <h1 className="sc-title">{freq.name}</h1>
          <p className="sc-dur">You tuned in for <b>{durLabel}</b>. Carry the calm with you.</p>
          <div className="sc-meta">
            {isBinaural ? `${freq.cL}/${freq.cR} Hz · ${freq.beat} Hz ${band}` : `${freq.hz} Hz · pure tone`}
          </div>
          <div className="sc-mood-section">
            <div className="sc-mood-q">How do you feel?</div>
            <div className="sc-mood-row" role="group" aria-label="Mood selection">
              {MOODS.map(m => (
                <button key={m.id} className={'sc-mood-btn' + (mood === m.id ? ' on' : '')} onClick={() => setMood(mood === m.id ? null : m.id)} aria-pressed={mood === m.id}>
                  <MoodIcon id={m.id} />
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <div className="sc-actions">
            <button className="sc-done" onClick={onClose}>Done</button>
            <button className="sc-again" onClick={listenAgain} aria-label={`Listen to ${freq.name} again`}>
              <Icon name="play" size={15} /> Listen again
            </button>
          </div>
          <button className="sc-share" onClick={shareSession}>Share this session →</button>
        </div>
        <div className="player-foot">echo.|| · for wellbeing, not a medical device</div>
      </div>
    );
  }

  return (
    <div className="player">
      {/* top 50% — atmospheric imagery */}
      <div className="player-top">
        <img className="player-bg" crossOrigin="anonymous" src={freq.img} alt="" />
        <div className="player-top-veil" />
        <div className="player-head">
          <button className="player-close" onClick={onClose} aria-label="Close player"><Icon name="chevdown" size={20} /></button>
          <EchoLogo size="sm" light />
          {onToggleFav ? (
            <button className={'player-fav' + (saved ? ' on' : '')} onClick={onToggleFav} aria-label={saved ? `Remove ${freq.name} from saved` : `Save ${freq.name}`} aria-pressed={!!saved}>
              <Icon name={saved ? 'heartfill' : 'heart'} size={19} />
            </button>
          ) : <span style={{ width: 38 }} />}
        </div>
        <div className="player-top-cap">
          <span className="player-kick">{(window.modeLabel ? modeLabel(freq.mode) : freq.mode)}{freq.premium ? ' · premium' : ''}</span>
        </div>
      </div>

      {/* bottom 50% — obsidian controls */}
      <div className="player-bottom">
        <h1 className="player-name">{freq.name}</h1>
        <p className="player-sub">{freq.sub}</p>

        {isBinaural
          ? <div className="hp-req">🎧 Headphones Required</div>
          : <div className="hp-req amb">◍ Ambient · speaker-safe</div>}

        <div className="readout">
          {isBinaural
            ? <>Left: {freq.cL}Hz <span className="rsep">|</span> Right: {freq.cR}Hz <span className="rsep">=</span> {freq.beat}Hz {band}</>
            : <>Pure tone <span className="rsep">·</span> {freq.hz}Hz <span className="rsep">·</span> Solfeggio</>}
        </div>

        {/* main play/pause toggle */}
        <button className={'player-play' + (playing ? ' on' : '')} onClick={() => onToggle(freq)} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? '❙❙' : '▶'}
        </button>

        {/* small elegant countdown */}
        <div className="countdown">{left != null ? fmt(left) : (playing ? 'Looping' : 'Ready')}</div>

        {/* animated sine waveform (active playback) */}
        <div className={'wave-wrap' + (playing ? ' on' : '')} aria-hidden="true">
          <svg className="wave" viewBox="0 0 240 48" preserveAspectRatio="none">
            <path d={wavePath} />
          </svg>
        </div>

        {/* duration selector */}
        <div className="dur-row">
          {DURATIONS.map(d => (
            <button key={d.id} className={'dur-chip' + (dur === d.id ? ' on' : '')} onClick={() => setDur(d.id)}>{d.label}</button>
          ))}
        </div>

        <div className="clinical">
          <span className="clinical-lab">Experiential note</span>
          <p>{clinical}</p>
        </div>

        <div className="player-foot">echo.|| · for wellbeing, not a medical device</div>
      </div>
    </div>
  );
}

window.PlayerScreen = PlayerScreen;
window.bandOf = bandOf;
