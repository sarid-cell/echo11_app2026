// echo.11 — Frequencies screen (Signal tab) + Web Audio engine.
// Light brand aesthetic (echo11.app): image-forward, per-frequency imagery.

const FREQS = [
  { id:'gamma', num:'A1', mode:'focus',   type:'binaural', hz:40,  cL:200, cR:240, beat:40, name:'Gamma MIT',   sub:'Focus · Brain Health', img:'img/astro-gaze.png' },
  { id:'alpha', num:'A2', mode:'focus',   type:'binaural', hz:10,  cL:200, cR:210, beat:10, name:'Alpha Silva',  sub:'Creativity · Clarity', img:'img/face-up.png' },
  { id:'theta', num:'A3', mode:'healing', type:'binaural', hz:6,   cL:200, cR:206, beat:6,  name:'Deep Theta',   sub:'Meditation · Subconscious', img:'img/eyes-closed.png' },
  { id:'beta',  num:'A4', mode:'focus',   type:'binaural', hz:18,  cL:300, cR:318, beat:18, name:'Beta Focus',   sub:'Attention · Sustained Focus', img:'img/astro-data.png' },
  { id:'delta', num:'A5', mode:'sleep',   type:'binaural', hz:2,   cL:200, cR:202, beat:2,  name:'Delta Sleep',  sub:'Deep Sleep · Renewal', img:'img/astro-rest.png' },
  { id:'hz174', num:'B1', mode:'healing', type:'solfeggio', hz:174, cL:174, cR:174, beat:null, name:'Release',      sub:'Grounding · Foundation', img:'img/helmet-field.png' },
  { id:'hz285', num:'B2', mode:'healing', type:'solfeggio', hz:285, cL:285, cR:285, beat:null, name:'Cellular Heal', sub:'Restoration · Renewal', img:'img/veil.png' },
  { id:'hz396', num:'B3', mode:'healing', type:'solfeggio', hz:396, cL:396, cR:396, beat:null, name:'Liberation',   sub:'Letting Go · Root', img:'img/cape-sun.png' },
  { id:'hz417', num:'B4', mode:'abundance', type:'solfeggio', hz:417, cL:417, cR:417, beat:null, name:'Change',     sub:'Openness · New Reality', img:'img/door.png' },
  { id:'hz432', num:'B5', mode:'sleep',   type:'solfeggio', hz:432, cL:432, cR:432, beat:null, name:'The Universe', sub:'Deep Sleep · Alignment', img:'img/cape-back.png' },
  { id:'hz528', num:'B6', mode:'healing', type:'solfeggio', hz:528, cL:528, cR:528, beat:null, name:'The Love',     sub:'Heart opening, self-love and emotional restoration.', img:'img/energy.png' },
  { id:'hz369', num:'B7', mode:'abundance', type:'solfeggio', hz:369, cL:369, cR:369, beat:null, premium:true, name:'Tesla 3-6-9', sub:'Energy · Alignment', img:'img/cape-sparkle.png' },
  { id:'hz639', num:'B8', mode:'healing', type:'solfeggio', hz:639, cL:639, cR:639, beat:null, premium:true, name:'Connection',   sub:'Relationships · Heart', img:'img/clear-helmet.png' },
  { id:'hz741', num:'B9', mode:'focus',   type:'solfeggio', hz:741, cL:741, cR:741, beat:null, premium:true, name:'Expression',   sub:'Creativity · Truth', img:'img/raincoat.png' },
  { id:'hz852', num:'B10', mode:'focus',  type:'solfeggio', hz:852, cL:852, cR:852, beat:null, premium:true, name:'Intuition',    sub:'Insight · Flow', img:'img/astro-profile.png' },
  { id:'hz963', num:'B11', mode:'abundance', type:'solfeggio', hz:963, cL:963, cR:963, beat:null, premium:true, name:'Unity',     sub:'Abundance · Awakening', img:'img/standing.png' },
  { id:'hz888', num:'B12', mode:'abundance', type:'solfeggio', hz:888, cL:888, cR:888, beat:null, premium:true, name:'Abundance', sub:'Financial · Attraction', img:'img/coat.png' },
  { id:'echo111',  num:'C1', mode:'healing', type:'binaural', hz:111, cL:111, cR:122, beat:11, premium:true, name:'The Echo',        sub:'echo.11 · Home Frequency', img:'img/desert.webp' },
  { id:'echoDual', num:'C2', mode:'focus',   type:'binaural', hz:528, cL:528, cR:568, beat:40, premium:true, name:'Gamma + Love',    sub:'Healing + Focus', img:'img/eyes-open.png' },
  { id:'echoFog',  num:'C3', mode:'focus',   type:'binaural', hz:40,  cL:200, cR:214, beat:14, premium:true, name:'Brain Fog Clear', sub:'Mental Clarity', img:'img/astro-data.png' },
  { id:'echoMiso', num:'C4', mode:'healing', type:'binaural', hz:6,   cL:180, cR:186, beat:6,  premium:true, name:'Sound Sensitivity', sub:'Calm · Sound Sensitivity', img:'img/eyes-closed.png' },
];
const FREQ_MODES = [
  { id:'all', label:'All' }, { id:'sleep', label:'Restorative State' }, { id:'healing', label:'Reflective Mode' },
  { id:'focus', label:'Cognitive Flow' }, { id:'abundance', label:'Deep Clarity' },
];
// State-based display names for a frequency's mode (used in player + detail).
// Keys are the stable internal ids; only the labels are presentation.
const MODE_LABELS = { focus:'Cognitive Flow', sleep:'Restorative State', healing:'Reflective Mode', abundance:'Deep Clarity' };
const modeLabel = (m) => MODE_LABELS[m] || m;
const freqById = (id) => FREQS.find(f => f.id === id);

// ── Web Audio engine (mirror of app.js) ──────────────────────
let _ctx = null, _nodes = null;
function _getCtx() { if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)(); return _ctx; }
function freqStart(f) {
  freqStop();
  const c = _getCtx();
  if (c.state === 'suspended') c.resume();
  const gain = c.createGain();
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.32, c.currentTime + 0.3);
  gain.connect(c.destination);
  if (f.type === 'binaural') {
    const merger = c.createChannelMerger(2); merger.connect(gain);
    const oL = c.createOscillator(); oL.type = 'sine'; oL.frequency.value = f.cL; oL.start();
    const oR = c.createOscillator(); oR.type = 'sine'; oR.frequency.value = f.cR; oR.start();
    const pL = c.createStereoPanner(); pL.pan.value = -1;
    const pR = c.createStereoPanner(); pR.pan.value = 1;
    oL.connect(pL); pL.connect(merger, 0, 0);
    oR.connect(pR); pR.connect(merger, 0, 1);
    _nodes = { oL, oR, gain };
  } else {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f.cL; o.connect(gain); o.start();
    _nodes = { o, gain };
  }
}
function freqStop() {
  if (!_nodes) return;
  const n = _nodes; _nodes = null;
  try {
    n.gain.gain.setValueAtTime(n.gain.gain.value, _getCtx().currentTime);
    n.gain.gain.linearRampToValueAtTime(0, _getCtx().currentTime + 0.4);
  } catch (e) {}
  setTimeout(() => { try { n.o?.stop(); n.oL?.stop(); n.oR?.stop(); n.gain.disconnect(); } catch (e) {} }, 460);
}

// ── Per-frequency detail page (full-bleed image) ─────────────
function FreqDetail({ freq, on, locked, onToggle, onBack }) {
  return (
    <div className="freq-detail">
      <img className="fd-img" crossOrigin="anonymous" src={freq.img} alt={`Cinematic black-and-white portrait representing the ${freq.name} frequency`} />
      <div className="fd-grad" aria-hidden="true" />
      <button className="fd-back" onClick={onBack} aria-label="Back to library"><Icon name="back" size={16} /> Back</button>
      <div className="fd-body">
        <div className="kicker" style={{ color: 'rgba(255,255,255,.7)' }}>{modeLabel(freq.mode)}{locked ? ' · premium' : ''}</div>
        <h1 className="fd-name">{freq.name}</h1>
        <p className="fd-sub">{freq.sub}</p>
        <div className="fd-meta">{freq.hz}.000 Hz · {freq.type === 'binaural' ? `Binaural · ${freq.beat} Hz beat` : 'Pure tone'}</div>
        <button className={'fd-play' + (on ? ' on' : '')} onClick={() => onToggle(freq)} aria-label={locked ? `Unlock ${freq.name} (premium)` : (on ? `Stop ${freq.name}` : `Play ${freq.name}`)}>
          {locked ? <Icon name="lock" size={28} /> : (on ? '■' : '▶')}
        </button>
        <div className="fd-state">{locked ? 'PREMIUM · TAP TO UNLOCK' : (on ? 'PLAYING' : 'TAP TO PLAY')}</div>
      </div>
    </div>
  );
}

// ── Frequencies screen ───────────────────────────────────────
function FrequenciesScreen({ currentId, onToggle, unlocked, initialMode, onHome, onOpenPlayer }) {
  const [mode, setMode] = React.useState(initialMode || 'all');
  const [typeF, setTypeF] = React.useState('all');   // all | binaural | solfeggio
  const [detail, setDetail] = React.useState(null);
  const featured = freqById('hz528');
  const list = FREQS.filter(f => (mode === 'all' || f.mode === mode) && (typeF === 'all' || f.type === typeF));
  const isLocked = (f) => f.premium && !unlocked;

  if (detail) {
    return <FreqDetail freq={detail} on={currentId === detail.id} locked={isLocked(detail)} onToggle={onToggle} onBack={() => setDetail(null)} />;
  }

  const featOn = currentId === featured.id;
  return (
    <div className="echo-page">
      {onHome && (
        <div className="section tight" style={{ marginTop: 6 }}>
          <button className="lib-back" onClick={onHome} aria-label="Back to home"><Icon name="back" size={15} /> Home</button>
        </div>
      )}
      <div className="section tight" style={{ marginTop: onHome ? 10 : 8 }}>
        <div className="kicker">Protocol Library</div>
      </div>

      {/* image-backed featured hero */}
      <div className="freq-hero-img" onClick={() => (onOpenPlayer ? onOpenPlayer(featured) : setDetail(featured))}>
        <img crossOrigin="anonymous" src={featured.img} alt={`Cinematic black-and-white portrait representing the ${featured.name} frequency`} />
        <div className="fh-grad" aria-hidden="true" />
        <div className="fh-body">
          <h1>{featured.name}</h1>
          <p className="fsub">{featured.sub}</p>
          <div className="fh-row">
            <div>
              <div className="fhz">{featured.hz}.000 Hz</div>
              <div className="fhzl">Pure tone · Solfeggio</div>
            </div>
            <button className={'fplay' + (featOn ? ' on' : '')} onClick={(e) => { e.stopPropagation(); onToggle(featured); }} aria-label={featOn ? `Stop ${featured.name}` : `Play ${featured.name}`}>
              {featOn ? '■' : '▶'}
            </button>
          </div>
        </div>
      </div>

      {/* sticky type filter — All | Binaural | Ambient */}
      <div className="lib-tabs" role="tablist" aria-label="Filter by synthesis type">
        <button className={'lib-tab' + (typeF === 'all' ? ' on' : '')} onClick={() => setTypeF('all')} aria-pressed={typeF === 'all'} aria-label="Show all frequencies">All</button>
        <button className={'lib-tab' + (typeF === 'binaural' ? ' on' : '')} onClick={() => setTypeF('binaural')} aria-pressed={typeF === 'binaural'} aria-label="Show binaural protocols">Binaural 🎧</button>
        <button className={'lib-tab' + (typeF === 'solfeggio' ? ' on' : '')} onClick={() => setTypeF('solfeggio')} aria-pressed={typeF === 'solfeggio'} aria-label="Show ambient frequencies">Ambient</button>
      </div>

      <div className="freq-chips" role="tablist" aria-label="Filter by intention">
        {FREQ_MODES.map(m => (
          <button key={m.id} className={'freq-chip' + (mode === m.id ? ' on' : '')} onClick={() => setMode(m.id)} aria-pressed={mode === m.id} aria-label={`Filter: ${m.label}`}>{m.label}</button>
        ))}
      </div>

      <div className="section" style={{ marginTop: 22 }}>
        <div className="kicker">{list.length} {typeF === 'binaural' ? 'Binaural protocols' : typeF === 'solfeggio' ? 'Ambient frequencies' : 'Frequencies'}</div>
        {list.map(f => {
          const on = currentId === f.id;
          const locked = isLocked(f);
          return (
            <div key={f.id} className={'freq-row' + (on ? ' on' : '')} onClick={() => (onOpenPlayer ? onOpenPlayer(f) : setDetail(f))}>
              <div className="fthumb">
                <img crossOrigin="anonymous" src={f.img} alt={`Portrait for the ${f.name} frequency`} />
                {locked ? <span className="lockpip" aria-hidden="true"><Icon name="lock" size={11} /></span> : null}
              </div>
              <div className="fmid">
                <div className="fname">{f.name}</div>
                <div className="fcsub">{f.sub}</div>
                <div className="fchz">{locked ? <span className="freq-lock"><Icon name="lock" size={9} /> Premium</span> : <>{f.hz} Hz{f.type === 'binaural' ? ` · ${f.beat} Hz beat` : ' · pure'}</>}</div>
              </div>
              <button className={'fbtn' + (on ? ' on' : '')} onClick={(e) => { e.stopPropagation(); onToggle(f); }} aria-label={locked ? `Unlock ${f.name} (premium)` : (on ? `Stop ${f.name}` : `Play ${f.name}`)}>
                {locked ? <Icon name="lock" size={14} /> : (on ? '■' : '▶')}
              </button>
            </div>
          );
        })}
      </div>

      <div className="foot">echo.|| · native synthesis · not a medical device</div>
    </div>
  );
}

// ── Listen ── master library: Binaural vs Ambient, with Free/Premium status.
function ListenScreen({ currentId, onOpenPlayer, unlocked, onPodcast }) {
  const binaural = FREQS.filter(f => f.type === 'binaural');
  const ambient  = FREQS.filter(f => f.type === 'solfeggio');
  const band = (b) => b == null ? null : b < 4 ? 'Delta' : b < 8 ? 'Theta' : b < 12 ? 'Alpha' : b < 30 ? 'Beta' : 'Gamma';

  const Track = (f) => {
    const locked = f.premium && !unlocked;
    return (
      <div key={f.id} className={'freq-row' + (currentId === f.id ? ' on' : '')} onClick={() => onOpenPlayer(f)}>
        <div className="fthumb">
          <img crossOrigin="anonymous" src={f.img} alt="" />
          {f.premium ? <span className="lockpip"><Icon name="lock" size={11} /></span> : null}
        </div>
        <div className="fmid">
          <div className="fname">{f.name}</div>
          <div className="fcsub">{f.sub}</div>
          <div className="track-meta">
            <span className="track-hz">{f.type === 'binaural' ? `${f.cL}/${f.cR}Hz · ${f.beat}Hz ${band(f.beat)}` : `${f.hz}Hz · pure`}</span>
            {f.premium ? <span className="badge-premium"><Icon name="lock" size={9} /> Premium</span> : <span className="badge-free">Free</span>}
          </div>
        </div>
        <button className={'fbtn' + (currentId === f.id ? ' on' : '')} onClick={(e) => { e.stopPropagation(); onOpenPlayer(f); }} aria-label={locked ? 'unlock' : 'play'}>
          {locked ? <Icon name="lock" size={14} /> : (currentId === f.id ? '■' : '▶')}
        </button>
      </div>
    );
  };

  return (
    <div className="echo-page">
      <div className="section tight" style={{ marginTop: 8 }}>
        <div className="kicker">Library</div>
        <h2 className="section-title">Protocol Library</h2>
        <p className="section-sub">21 frequencies · synthesized live</p>
      </div>

      {/* Podcast — CTRL+HUMAN, back on the library page */}
      {onPodcast && (
        <div className="section" style={{ marginTop: 18 }}>
          <div className="feat" style={{ marginInline: 0 }} onClick={onPodcast}>
            <div className="feat-img" style={{ aspectRatio: '16/9' }}>
              <img crossOrigin="anonymous" src={EPISODES[0].art} alt="" />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 54, height: 54, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--accent)', color: 'var(--accent-ink)' }}><Icon name="play" size={22} /></div>
              </div>
            </div>
            <div className="feat-body">
              <span className="meta">Podcast · CTRL+HUMAN</span>
              <h3>Listen to the latest episode</h3>
              <p>Conversations on AI, psychology, and the future of human potential.</p>
            </div>
          </div>
        </div>
      )}

      <div className="section" style={{ marginTop: 24 }}>
        <div className="lib-sec-head">
          <span className="lib-sec-title">🎧 Binaural Protocols</span>
          <span className="lib-sec-sub">Headphones required</span>
        </div>
        {binaural.map(Track)}
      </div>

      <div className="section" style={{ marginTop: 32 }}>
        <div className="lib-sec-head">
          <span className="lib-sec-title">Ambient Synthesis</span>
          <span className="lib-sec-sub">Speaker friendly</span>
        </div>
        {ambient.map(Track)}
      </div>

      <div className="foot">echo.|| · native synthesis · not a medical device</div>
    </div>
  );
}

Object.assign(window, { FREQS, freqById, freqStart, freqStop, FrequenciesScreen, ListenScreen, MODE_LABELS, modeLabel });
