// echo.|| — Home dashboard (Signal tab default).
// Premium, instantly actionable: Daily Neural Anchor → quick states → library preview.

const ANCHORS = [
  { q: 'Neurons that fire together, wire together. Choose, deliberately, what you repeat.', a: 'Hebbian principle' },
  { q: 'You are not the noise. You are the awareness that can tune it.', a: 'Daily anchor' },
  { q: 'Attention is the chisel. Every focused minute reshapes the architecture.', a: 'Neuroplasticity' },
  { q: 'Calm is a frequency you can return to — not a place you have to find.', a: 'Down-regulation' },
  { q: 'The nervous system learns the state you practice most. Practice the one you want.', a: 'State training' },
  { q: 'Coherence first, performance second. The signal precedes the result.', a: 'Peak protocol' },
  { q: 'What you tune into, you become. Guard the input.', a: 'Consumer of self' },
  ];

const QUICK = [
  { id: 'gamma', label: 'Focus', hz: '40 Hz', img: 'img/astro-gaze.png' },
  { id: 'delta', label: 'Sleep', hz: '2 Hz',  img: 'img/astro-rest.png' },
  { id: 'theta', label: 'Reset', hz: '6 Hz',  img: 'img/eyes-closed.png' },
  ];

const TIME_REC = {
    morning:   { id: 'alpha', reason: 'Prime your mind for the day.' },
    afternoon: { id: 'beta',  reason: 'Sustain focus and deep output.' },
    evening:   { id: 'theta', reason: 'Decompress and wind down.' },
};

const MOOD_LABEL = { calm: 'Calm', focused: 'Focused', neutral: 'Neutral', tired: 'Tired' };

// Day-streak helpers — local calendar days, based on saved session history.
const ONE_DAY_MS = 86400000;
  const dayKey = (ts) => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };

function HomeDashboard({ currentId, onToggle, unlocked, onOpenPlayer, onSOS, favs = [], onToggleFav, sessions = [] }) {
    const [toast, setToast] = React.useState('');
    const [openSec, setOpenSec] = React.useState({ binaural: true, ambient: false });
    const toggleSec = (k) => setOpenSec(o => ({ ...o, [k]: !o[k] }));
    const savedFreqs = favs.map(freqById).filter(Boolean);
    const now = new Date();
    const anchor = ANCHORS[now.getDate() % ANCHORS.length];
    const hour = now.getHours();
    const partOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
    const NAME = 'Shira';
    const SUBLINE = { morning: 'Align your system for the day.', afternoon: 'Realign and refocus.', evening: 'Align your system. Wind down.' }[partOfDay];

  const share = async () => {
        const text = `"${anchor.q}" — echo.||`;
        try {
                if (navigator.share) { await navigator.share({ text }); return; }
                await navigator.clipboard.writeText(text);
                setToast('Copied to clipboard'); setTimeout(() => setToast(''), 1800);
        } catch (e) { /* cancelled */ }
  };

  // Today's recommended frequency — powers the hero "Begin tonight's signal" CTA.
  const recFreq = freqById((TIME_REC[partOfDay] || TIME_REC.morning).id);

  // Last Session + Day Streak — read the full saved history (not just today's
  // slice) so both stats stay correct across midnight.
  const fullHistory = React.useMemo(() => {
        try { return JSON.parse(localStorage.getItem('echo:history') || '[]'); } catch (e) { return []; }
  }, [sessions]);
    const lastSession = fullHistory[0] || null;
    const lastMins = lastSession ? Math.max(1, Math.round(lastSession.secs / 60)) : 0;
    const lastLabel = React.useMemo(() => {
          if (!lastSession) return '';
          const d0 = dayKey(lastSession.ts), t0 = dayKey(Date.now());
          if (d0 === t0) return 'Today';
          if (t0 - d0 === ONE_DAY_MS) return 'Yesterday';
          return new Date(lastSession.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }, [lastSession]);
    const streak = React.useMemo(() => {
          const days = new Set(fullHistory.map(s => dayKey(s.ts)));
          let n = 0, cur = dayKey(Date.now());
          if (!days.has(cur)) cur -= ONE_DAY_MS; // no session yet today — count from yesterday
                                     while (days.has(cur)) { n++; cur -= ONE_DAY_MS; }
          return n;
    }, [fullHistory]);

  // Full Protocol Library, grouped — binaural (headphones) vs ambient, premium flagged.
  const binaural = FREQS.filter(f => f.type === 'binaural');
    const ambient = FREQS.filter(f => f.type === 'solfeggio');
    const band = (b) => b == null ? null : b < 4 ? 'Delta' : b < 8 ? 'Theta' : b < 12 ? 'Alpha' : b < 30 ? 'Beta' : 'Gamma';
    const FreqRow = (f) => {
          const on = currentId === f.id;
          const locked = f.premium && !unlocked;
          const isSaved = favs.includes(f.id);
          return (
                  <div key={f.id} className={'freq-row' + (on ? ' on' : '')} onClick={() => onOpenPlayer(f)}>
                            <div className="fthumb">
                                      <img crossOrigin="anonymous" src={f.img} alt={`Portrait for the ${f.name} frequency`} />
                              {f.premium ? <span className="lockpip" aria-hidden="true"><Icon name="lock" size={11} /></span>span> : null}
                            </div>div>
                          <div className="fmid">
                                    <div className="fname">{f.name}</div>div>
                                    <div className="fcsub">{f.sub}</div>div>
                                    <div className="track-meta">
                                                <span className="track-hz">{f.type === 'binaural' ? `${f.cL}/${f.cR}Hz · ${f.beat}Hz ${band(f.beat)}` : `${f.hz}Hz · pure`}</span>span>
                                      {f.premium ? <span className="badge-premium"><Icon name="lock" size={9} /> Premium</span>span> : <span className="badge-free">Free</span>span>}
                                    </div>div>
                          </div>div>
                          <div className="freq-row-actions">
                            {onToggleFav && (
                                <button className={'fav-btn' + (isSaved ? ' on' : '')} onClick={(e) => { e.stopPropagation(); onToggleFav(f); }} aria-label={isSaved ? `Remove ${f.name} from saved` : `Save ${f.name}`} aria-pressed={isSaved}>
                                              <Icon name={isSaved ? 'heartfill' : 'heart'} size={16} />
                                </button>button>
                                    )}
                                    <button className={'fbtn' + (on ? ' on' : '')} onClick={(e) => { e.stopPropagation(); onOpenPlayer(f); }} aria-label={locked ? `Unlock ${f.name} (premium)` : (on ? `Stop ${f.name}` : `Play ${f.name}`)}>
                                      {locked ? <Icon name="lock" size={14} /> : (on ? '■' : '▶')}
                                    </button>button>
                          </div>div>
                  </div>div>
                );
    };
  
    return (
          <div className="echo-page home">
            {/* Hero: looping atmospheric film (blonde astronaut). Kicker + greeting +
                  orbit line + the primary "Begin tonight's signal" CTA float over the bottom
                        edge — no solid box, the video breathes. */}
                <div className="home-hero">
                        <img className="home-hero-bg" crossOrigin="anonymous" src="img/astro-loop.gif" alt="Looping black-and-white film of a blonde astronaut resting with eyes closed inside a glass helmet" />
                        <div className="home-hero-veil" aria-hidden="true" />
                        <div className="home-hero-foot">
                                  <div className="home-hero-greet">
                                              <span className="hg-kicker"><i className="hg-dot" aria-hidden="true" />Day Signal · {FREQS.length} Frequencies</span>span>
                                              <span className="greet-line">Good {partOfDay}, <b className="greet-name">{NAME}</b>b></span>span>
                                              <span className="orbit-line">ISS · Orbit 11 · 20 min</span>span>
                                  </div>div>
                                  <button className="signal-cta" onClick={() => onOpenPlayer(recFreq)} aria-label={`Begin tonight's signal — ${recFreq.name} at ${recFreq.hz} hertz`}>
                                              <span className="signal-cta-ico" aria-hidden="true">▶</span>span>
                                              <span className="signal-cta-label">Begin tonight's signal</span>span>
                                              <span className="signal-cta-hz">{recFreq.hz} Hz</span>span>
                                  </button>button>
                                  <p className="signal-cta-sub">A steady tone, not music — give it 60 seconds.</p>p>
                        </div>div>
                </div>div>
          
            {/* Last Session + Day Streak */}
                <div className="section" style={{ marginTop: 18 }}>
                        <div className="stat-row">
                                  <div className="stat-card">
                                              <div className="stat-label">Last Session</div>div>
                                    {lastSession ? (
                          <>
                                          <div className="stat-meta">{lastMins} MIN · {lastLabel}</div>div>
                                          <div className="stat-name">{lastSession.name}</div>div>
                          </>>
                        ) : (
                          <div className="stat-empty">Your first session will appear here.</div>div>
                                              )}
                                  </div>div>
                                  <div className="stat-card stat-card-streak">
                                              <div className="stat-label">Day Streak</div>div>
                                              <div className="stat-streak-num">{streak}</div>div>
                                  </div>div>
                        </div>div>
                </div>div>
          
            {/* Neural Reset → pushes to Player (softened from "SOS" so it reads as an invitation, not an alarm) */}
                <div className="section" style={{ marginTop: 22 }}>
                        <button className="sos" onClick={onSOS} aria-label="Neural Reset — start a calming theta session">
                                  <span className="sos-pulse" aria-hidden="true"><i></i>i><i></i>i><i></i>i></span>span>
                                  <span className="sos-text">
                                              <span className="sos-title">Neural Reset</span>span>
                                              <span className="sos-sub">A one-tap shift back to calm — whenever you need it</span>span>
                                  </span>span>
                                  <span className="sos-ico">▶</span>span>
                        </button>button>
                </div>div>
          
            {/* Quick Start → push to Player */}
                <div className="section" style={{ marginTop: 22 }}>
                        <div className="kicker">Quick start</div>div>
                        <div className="quick-grid">
                          {QUICK.map(q => (
                        <button key={q.id} className="quick-card" onClick={() => onOpenPlayer(freqById(q.id))} aria-label={`Quick start: ${q.label} at ${q.hz}`}>
                                      <img crossOrigin="anonymous" src={q.img} alt={`${q.label} quick-start frequency`} />
                                      <span className="quick-grad" aria-hidden="true" />
                                      <span className="quick-body">
                                                      <span className="quick-label">{q.label}</span>span>
                                                      <span className="quick-hz">{q.hz}</span>span>
                                      </span>span>
                        </button>button>
                      ))}
                        </div>div>
                </div>div>
          
            {/* Daily Neural Anchor — relocated here (off the hero image, onto its own
                  card) so the hero can lead with the "Begin tonight's signal" CTA. */}
                <div className="section" style={{ marginTop: 22 }}>
                        <div className="anchor">
                                  <div className="anchor-top">
                                              <span className="kicker">Daily Neural Anchor</span>span>
                                              <button className="anchor-share" onClick={share} aria-label="Share today's neural anchor"><Icon name="share" size={15} /></button>button>
                                  </div>div>
                                  <p className="anchor-quote">{anchor.q}</p>p>
                                  <span className="anchor-by">— {anchor.a}</span>span>
                        </div>div>
                </div>div>
          
            {/* Today's Sessions — post-session log */}
                <div className="section" style={{ marginTop: 22 }}>
                        <div className="kicker">Today</div>div>
                  {sessions.length === 0 ? (
                      <div className="today-empty">Your first session today will appear here.</div>div>
                    ) : (() => {
                      const visible = sessions.slice(0, 3);
                      const hasMore = sessions.length > 3;
                      return (
                                    <div className="today-card">
                                      {visible.map((s, i) => {
                                                      const d = new Date(s.ts);
                                                      const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
                                                      const mins = Math.max(1, Math.round(s.secs / 60));
                                                      return (
                                                                          <div key={s.ts} className={'today-row' + (!hasMore && i === visible.length - 1 ? ' last' : '')}>
                                                                                              <span className="today-time">{time}</span>span>
                                                                                              <span className="today-name">{s.name}</span>span>
                                                                                              <span className="today-dur">{mins} min</span>span>
                                                                            {s.mood && <span className="today-mood">{MOOD_LABEL[s.mood] || ''}</span>span>}
                                                                          </div>div>
                                                                        );
                                    })}
                                      {hasMore && (
                                                      <div className="today-more">
                                                                        View full history →
                                                      </div>div>
                                                  )}
                                    </div>div>
                                  );
          })()}
                </div>div>
          
            {/* Saved — quick access to favorited frequencies. Lives directly under
                  Quick Start so the user's own shortlist is one tap away. */}
                <div className="section" style={{ marginTop: 30 }}>
                        <div className="row-between">
                                  <div className="kicker">Saved</div>div>
                          {savedFreqs.length > 0 && <span className="meta">{savedFreqs.length} {savedFreqs.length === 1 ? 'frequency' : 'frequencies'}</span>span>}
                        </div>div>
                  {savedFreqs.length === 0 ? (
                      <div className="saved-empty">
                                  <span className="saved-empty-ico" aria-hidden="true"><Icon name="heart" size={20} /></span>span>
                                  <p>Tap the <span className="inline-heart" aria-hidden="true"><Icon name="heart" size={11} /></span>span> on any frequency to save it here for one-tap access.</p>p>
                      </div>div>
                    ) : (
                      <div className="saved-list">{savedFreqs.map(FreqRow)}</div>div>
                        )}
                </div>div>
          
            {/* Protocol Library — editorial, collapsible. Hero stays minimal; the full
                  catalogue lives behind tappable section headers so it never floods the screen. */}
                <div className="section" style={{ marginTop: 32 }}>
                        <div className="row-between">
                                  <div className="kicker">Protocol Library</div>div>
                                  <span className="meta">{FREQS.length} frequencies</span>span>
                        </div>div>
                
                        <button className="lib-acc-head" onClick={() => toggleSec('binaural')} aria-expanded={openSec.binaural} aria-controls="lib-binaural">
                                  <span className="lib-acc-title">🎧 Binaural Protocols</span>span>
                                  <span className="lib-acc-meta">
                                              <span className="lib-acc-sub">{binaural.length} · Headphones</span>span>
                                              <span className={'lib-acc-chev' + (openSec.binaural ? ' open' : '')} aria-hidden="true"><Icon name="chevdown" size={16} /></span>span>
                                  </span>span>
                        </button>button>
                  {openSec.binaural && <div id="lib-binaural" className="lib-acc-body">{binaural.map(FreqRow)}</div>div>}
                
                        <button className="lib-acc-head" onClick={() => toggleSec('ambient')} aria-expanded={openSec.ambient} aria-controls="lib-ambient">
                                  <span className="lib-acc-title">Ambient Synthesis</span>span>
                                  <span className="lib-acc-meta">
                                              <span className="lib-acc-sub">{ambient.length} · Speaker-safe</span>span>
                                              <span className={'lib-acc-chev' + (openSec.ambient ? ' open' : '')} aria-hidden="true"><Icon name="chevdown" size={16} /></span>span>
                                  </span>span>
                        </button>button>
                  {openSec.ambient && <div id="lib-ambient" className="lib-acc-body">{ambient.map(FreqRow)}</div>div>}
                </div>div>
          
                <div className="foot">echo.|| · native synthesis · not a medical device</div>div>
            {toast ? <div className="home-toast">{toast}</div>div> : null}
          </div>div>
        );
}

window.HomeDashboard = HomeDashboard;
</></div>
