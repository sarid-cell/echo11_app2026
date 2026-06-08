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

  // Today's Protocol — time-aware recommendation
  const rec = TIME_REC[partOfDay] || TIME_REC.morning;
  const recFreq = freqById(rec.id);
  const timeLabel = partOfDay.charAt(0).toUpperCase() + partOfDay.slice(1);

  // Full Protocol Library, grouped — binaural (headphones) vs ambient, premium flagged.
  const binaural = FREQS.filter(f => f.type === 'binaural');
  const ambient  = FREQS.filter(f => f.type === 'solfeggio');
  const band = (b) => b == null ? null : b < 4 ? 'Delta' : b < 8 ? 'Theta' : b < 12 ? 'Alpha' : b < 30 ? 'Beta' : 'Gamma';
  const FreqRow = (f) => {
    const on = currentId === f.id;
    const locked = f.premium && !unlocked;
    const isSaved = favs.includes(f.id);
    return (
      <div key={f.id} className={'freq-row' + (on ? ' on' : '')} onClick={() => onOpenPlayer(f)}>
        <div className="fthumb">
          <img crossOrigin="anonymous" src={f.img} alt={`Portrait for the ${f.name} frequency`} />
          {f.premium ? <span className="lockpip" aria-hidden="true"><Icon name="lock" size={11} /></span> : null}
        </div>
        <div className="fmid">
          <div className="fname">{f.name}</div>
          <div className="fcsub">{f.sub}</div>
          <div className="track-meta">
            <span className="track-hz">{f.type === 'binaural' ? `${f.cL}/${f.cR}Hz · ${f.beat}Hz ${band(f.beat)}` : `${f.hz}Hz · pure`}</span>
            {f.premium ? <span className="badge-premium"><Icon name="lock" size={9} /> Premium</span> : <span className="badge-free">Free</span>}
          </div>
        </div>
        <div className="freq-row-actions">
          {onToggleFav && (
            <button className={'fav-btn' + (isSaved ? ' on' : '')} onClick={(e) => { e.stopPropagation(); onToggleFav(f); }} aria-label={isSaved ? `Remove ${f.name} from saved` : `Save ${f.name}`} aria-pressed={isSaved}>
              <Icon name={isSaved ? 'heartfill' : 'heart'} size={16} />
            </button>
          )}
          <button className={'fbtn' + (on ? ' on' : '')} onClick={(e) => { e.stopPropagation(); onOpenPlayer(f); }} aria-label={locked ? `Unlock ${f.name} (premium)` : (on ? `Stop ${f.name}` : `Play ${f.name}`)}>
            {locked ? <Icon name="lock" size={14} /> : (on ? '■' : '▶')}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="echo-page home">
      {/* ── Hero: looping atmospheric film (blonde astronaut). Greeting + Daily Neural
           Anchor float elegantly over the bottom edge — no solid box, the video breathes. ── */}
      <div className="home-hero">
        <img className="home-hero-bg" crossOrigin="anonymous" src="img/astro-loop.gif" alt="Looping black-and-white film of a blonde astronaut resting with eyes closed inside a glass helmet" />
        <div className="home-hero-veil" aria-hidden="true" />
        <div className="home-hero-foot">
          <div className="home-hero-greet">
            <span className="greet-line">Good {partOfDay}, {NAME}.</span>
            <span className="greet-sub">{SUBLINE}</span>
          </div>
          <div className="hha">
            <div className="hha-top">
              <span className="hha-label">Daily Neural Anchor</span>
              <button className="hha-share" onClick={share} aria-label="Share today’s neural anchor"><Icon name="share" size={15} /></button>
            </div>
            <p className="hha-quote">{anchor.q}</p>
            <span className="hha-by">— {anchor.a}</span>
          </div>
        </div>
      </div>

      {/* ── Neural Reset → pushes to Player (softened from "SOS" so it reads as an invitation, not an alarm) ── */}
      <div className="section" style={{ marginTop: 20 }}>
        <button className="sos" onClick={onSOS} aria-label="Neural Reset — start a calming theta session">
          <span className="sos-pulse" aria-hidden="true"><i></i><i></i><i></i></span>
          <span className="sos-text">
            <span className="sos-title">Neural Reset</span>
            <span className="sos-sub">A one-tap shift back to calm — whenever you need it</span>
          </span>
          <span className="sos-ico">▶</span>
        </button>
      </div>

      {/* ── Quick Start → push to Player ── */}
      <div className="section" style={{ marginTop: 22 }}>
        <div className="kicker">Quick start</div>
        <div className="quick-grid">
          {QUICK.map(q => (
            <button key={q.id} className="quick-card" onClick={() => onOpenPlayer(freqById(q.id))} aria-label={`Quick start: ${q.label} at ${q.hz}`}>
              <img crossOrigin="anonymous" src={q.img} alt={`${q.label} quick-start frequency`} />
              <span className="quick-grad" aria-hidden="true" />
              <span className="quick-body">
                <span className="quick-label">{q.label}</span>
                <span className="quick-hz">{q.hz}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Today's Sessions — post-session log ── */}
      <div className="section" style={{ marginTop: 22 }}>
        <div className="kicker">Today</div>
        {sessions.length === 0 ? (
          <div className="today-empty">Your first session today will appear here.</div>
        ) : (
          <div className="today-card">
            {sessions.map((s, i) => {
              const d = new Date(s.ts);
              const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
              const mins = Math.max(1, Math.round(s.secs / 60));
              return (
                <div key={s.ts} className={'today-row' + (i === sessions.length - 1 ? ' last' : '')}>
                  <span className="today-time">{time}</span>
                  <span className="today-name">{s.name}</span>
                  <span className="today-dur">{mins} min</span>
                  {s.mood && <span className="today-mood">{MOOD_LABEL[s.mood] || ''}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Saved — quick access to favorited frequencies. Lives directly under
           Quick Start so the user's own shortlist is one tap away. ── */}
      <div className="section" style={{ marginTop: 30 }}>
        <div className="row-between">
          <div className="kicker">Saved</div>
          {savedFreqs.length > 0 && <span className="meta">{savedFreqs.length} {savedFreqs.length === 1 ? 'frequency' : 'frequencies'}</span>}
        </div>
        {savedFreqs.length === 0 ? (
          <div className="saved-empty">
            <span className="saved-empty-ico" aria-hidden="true"><Icon name="heart" size={20} /></span>
            <p>Tap the <span className="inline-heart" aria-hidden="true"><Icon name="heart" size={11} /></span> on any frequency to save it here for one-tap access.</p>
          </div>
        ) : (
          <div className="saved-list">{savedFreqs.map(FreqRow)}</div>
        )}
      </div>

      {/* ── Protocol Library — editorial, collapsible. Hero stays minimal; the full
           catalogue lives behind tappable section headers so it never floods the screen. ── */}
      <div className="section" style={{ marginTop: 32 }}>
        <div className="row-between">
          <div className="kicker">Protocol Library</div>
          <span className="meta">{FREQS.length} frequencies</span>
        </div>

        <button className="lib-acc-head" onClick={() => toggleSec('binaural')} aria-expanded={openSec.binaural} aria-controls="lib-binaural">
          <span className="lib-acc-title">🎧 Binaural Protocols</span>
          <span className="lib-acc-meta">
            <span className="lib-acc-sub">{binaural.length} · Headphones</span>
            <span className={'lib-acc-chev' + (openSec.binaural ? ' open' : '')} aria-hidden="true"><Icon name="chevdown" size={16} /></span>
          </span>
        </button>
        {openSec.binaural && <div id="lib-binaural" className="lib-acc-body">{binaural.map(FreqRow)}</div>}

        <button className="lib-acc-head" onClick={() => toggleSec('ambient')} aria-expanded={openSec.ambient} aria-controls="lib-ambient">
          <span className="lib-acc-title">Ambient Synthesis</span>
          <span className="lib-acc-meta">
            <span className="lib-acc-sub">{ambient.length} · Speaker-safe</span>
            <span className={'lib-acc-chev' + (openSec.ambient ? ' open' : '')} aria-hidden="true"><Icon name="chevdown" size={16} /></span>
          </span>
        </button>
        {openSec.ambient && <div id="lib-ambient" className="lib-acc-body">{ambient.map(FreqRow)}</div>}
      </div>

      {/* ── Today's Protocol — time-aware recommendation ── */}
      {recFreq && (
        <div className="section" style={{ marginTop: 26 }}>
          <div className="today-protocol" onClick={() => onOpenPlayer(recFreq)} role="button" aria-label={`Today's protocol: ${recFreq.name}. Tap to open.`}>
            <div className="tp-top">
              <span className="kicker">Today's Protocol</span>
              <span className="tp-time">{timeLabel}</span>
            </div>
            <div className="tp-body">
              <div className="tp-img">
                <img crossOrigin="anonymous" src={recFreq.img} alt="" />
              </div>
              <div className="tp-info">
                <div className="tp-name">{recFreq.name}</div>
                <div className="tp-sub">{recFreq.sub}</div>
                <div className="tp-reason">{rec.reason}</div>
              </div>
              <button className={'tp-play' + (currentId === recFreq.id ? ' on' : '')} onClick={(e) => { e.stopPropagation(); onOpenPlayer(recFreq); }} aria-label={`Begin ${recFreq.name} session`}>
                {currentId === recFreq.id ? '■' : '▶'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="foot">echo.|| · native synthesis · not a medical device</div>
      {toast ? <div className="home-toast">{toast}</div> : null}
    </div>
  );
}

window.HomeDashboard = HomeDashboard;
