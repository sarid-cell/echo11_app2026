// echo.11 dashboard — web mirror of the React Native App.js (so you can SEE + HEAR it here).
// The Web Audio engine below is the ORIGINAL browser engine; the RN ToneEngine
// reproduces the identical tones natively. Same catalog, same look.

const FREQS = [
  { id:'gamma', num:'A1', mode:'focus',   type:'binaural', hz:40,  cL:200, cR:240, beat:40, name:'Gamma MIT',   sub:'Focus · Brain Health' },
  { id:'alpha', num:'A2', mode:'focus',   type:'binaural', hz:10,  cL:200, cR:210, beat:10, name:'Alpha Silva',  sub:'Creativity · Clarity' },
  { id:'theta', num:'A3', mode:'healing', type:'binaural', hz:6,   cL:200, cR:206, beat:6,  name:'Deep Theta',   sub:'Meditation · Subconscious' },
  { id:'beta',  num:'A4', mode:'focus',   type:'binaural', hz:18,  cL:300, cR:318, beat:18, name:'Beta Focus',   sub:'Attention · ADHD' },
  { id:'delta', num:'A5', mode:'sleep',   type:'binaural', hz:2,   cL:200, cR:202, beat:2,  name:'Delta Sleep',  sub:'Deep Sleep · Renewal' },
  { id:'hz174', num:'B1', mode:'healing', type:'solfeggio', hz:174, cL:174, cR:174, beat:null, name:'Release',      sub:'Pain · Fear · Foundation' },
  { id:'hz285', num:'B2', mode:'healing', type:'solfeggio', hz:285, cL:285, cR:285, beat:null, name:'Cellular Heal', sub:'Cellular Healing' },
  { id:'hz396', num:'B3', mode:'healing', type:'solfeggio', hz:396, cL:396, cR:396, beat:null, name:'Liberation',   sub:'Guilt · Trauma · Root' },
  { id:'hz417', num:'B4', mode:'abundance', type:'solfeggio', hz:417, cL:417, cR:417, beat:null, name:'Change',     sub:'Openness · New Reality' },
  { id:'hz432', num:'B5', mode:'sleep',   type:'solfeggio', hz:432, cL:432, cR:432, beat:null, name:'The Universe', sub:'Deep Sleep · Alignment' },
  { id:'hz528', num:'B6', mode:'healing', type:'solfeggio', hz:528, cL:528, cR:528, beat:null, name:'The Love',     sub:'528 Hz · Heart opening, self-love and emotional restoration.' },
  { id:'hz369', num:'B7', mode:'abundance', type:'solfeggio', hz:369, cL:369, cR:369, beat:null, name:'Tesla 3-6-9', sub:'Energy · Alignment' },
  { id:'hz639', num:'B8', mode:'healing', type:'solfeggio', hz:639, cL:639, cR:639, beat:null, name:'Connection',   sub:'Relationships · Heart' },
  { id:'hz741', num:'B9', mode:'focus',   type:'solfeggio', hz:741, cL:741, cR:741, beat:null, name:'Expression',   sub:'Creativity · Truth' },
  { id:'hz852', num:'B10', mode:'focus',  type:'solfeggio', hz:852, cL:852, cR:852, beat:null, name:'Intuition',    sub:'Insight · Flow' },
  { id:'hz963', num:'B11', mode:'abundance', type:'solfeggio', hz:963, cL:963, cR:963, beat:null, name:'Unity',     sub:'Abundance · Awakening' },
  { id:'hz888', num:'B12', mode:'abundance', type:'solfeggio', hz:888, cL:888, cR:888, beat:null, name:'Abundance', sub:'Financial · Attraction' },
  { id:'echo111',  num:'C1', mode:'healing', type:'binaural', hz:111, cL:111, cR:122, beat:11, name:'The Echo',        sub:'echo.11 · Home Frequency' },
  { id:'echoDual', num:'C2', mode:'focus',   type:'binaural', hz:528, cL:528, cR:568, beat:40, name:'Gamma + Love',    sub:'Healing + Focus' },
  { id:'echoFog',  num:'C3', mode:'focus',   type:'binaural', hz:40,  cL:200, cR:214, beat:14, name:'Brain Fog Clear', sub:'Mental Clarity' },
  { id:'echoMiso', num:'C4', mode:'healing', type:'binaural', hz:6,   cL:180, cR:186, beat:6,  name:'Misophonia',      sub:'Sound Sensitivity Relief' },
];
const MODES = [
  { id:'all', label:'All' }, { id:'sleep', label:'Sleep' }, { id:'healing', label:'Healing' },
  { id:'focus', label:'Focus' }, { id:'abundance', label:'Abundance' },
];
const FEATURED_ID = 'hz528';
const byId = (id) => FREQS.find(f => f.id === id);

// ── Web Audio engine (mirrors app.js createOscillator + panner + gain ramp) ──
let ctx = null, nodes = null;
function getCtx() { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); return ctx; }
function startTone(f) {
  stopTone();
  const c = getCtx();
  if (c.state === 'suspended') c.resume();
  const gain = c.createGain();
  gain.gain.setValueAtTime(0, c.currentTime);
  gain.gain.linearRampToValueAtTime(0.35, c.currentTime + 0.3);
  gain.connect(c.destination);
  if (f.type === 'binaural') {
    const merger = c.createChannelMerger(2); merger.connect(gain);
    const oL = c.createOscillator(); oL.type = 'sine'; oL.frequency.value = f.cL; oL.start();
    const oR = c.createOscillator(); oR.type = 'sine'; oR.frequency.value = f.cR; oR.start();
    const pL = c.createStereoPanner(); pL.pan.value = -1;
    const pR = c.createStereoPanner(); pR.pan.value = 1;
    oL.connect(pL); pL.connect(merger, 0, 0);
    oR.connect(pR); pR.connect(merger, 0, 1);
    nodes = { oL, oR, gain };
  } else {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f.cL; o.connect(gain); o.start();
    nodes = { o, gain };
  }
}
function stopTone() {
  if (!nodes) return;
  const n = nodes; nodes = null;
  try {
    n.gain.gain.setValueAtTime(n.gain.gain.value, getCtx().currentTime);
    n.gain.gain.linearRampToValueAtTime(0, getCtx().currentTime + 0.4);
  } catch (e) {}
  setTimeout(() => { try { n.o?.stop(); n.oL?.stop(); n.oR?.stop(); n.gain.disconnect(); } catch (e) {} }, 460);
}

function Dashboard() {
  const [mode, setMode] = React.useState('all');
  const [cur, setCur] = React.useState(null);
  const [clock, setClock] = React.useState(0);

  React.useEffect(() => { const t = setInterval(() => setClock(c => c + 1), 1000); return () => clearInterval(t); }, []);
  React.useEffect(() => () => stopTone(), []);

  const featured = byId(FEATURED_ID);
  const list = mode === 'all' ? FREQS : FREQS.filter(f => f.mode === mode);
  const toggle = (f) => { if (cur === f.id) { setCur(null); stopTone(); } else { startTone(f); setCur(f.id); } };

  const pad = (n) => String(Math.floor(n)).padStart(2, '0');
  const clockStr = `${pad(clock/3600)}:${pad((clock%3600)/60)}:${pad(clock%60)}`;
  const now = cur ? byId(cur) : null;
  const featOn = cur === featured.id;

  return (
    <div className="echo-root">
      <div className="topbar">
        <div className="wordmark">ECHO<span>.11</span></div>
        <div className="clock"><span className="dot"></span>{clockStr}</div>
      </div>

      <div className="scroll">
        <div className="hero">
          <div className="glow"></div>
          <div className="kicker"><span className="bar"></span><span>Tonight's Signal</span></div>
          <h1>{featured.name}</h1>
          <div className="sub">{featured.sub}</div>
          <div className="bottom">
            <div>
              <div className="hz">{featured.hz}.000 Hz</div>
              <div className="hzl">{featured.type === 'binaural' ? `Binaural · ${featured.beat} Hz beat` : 'Pure tone'}</div>
            </div>
            <button className={'playbtn' + (featOn ? ' on' : '')} onClick={() => toggle(featured)}>{featOn ? '■' : '▶'}</button>
          </div>
        </div>

        <div className="chips">
          {MODES.map(m => (
            <button key={m.id} className={'chip' + (mode === m.id ? ' on' : '')} onClick={() => setMode(m.id)}>{m.label}</button>
          ))}
        </div>

        <div className="section">
          <div className="kicker"><span className="bar"></span><span>{list.length} Frequencies</span></div>
          {list.map(f => {
            const on = cur === f.id;
            return (
              <div key={f.id} className={'card' + (on ? ' on' : '')} onClick={() => toggle(f)}>
                <div className="num">{f.num}</div>
                <div className="mid">
                  <div className="name">{f.name}</div>
                  <div className="csub">{f.sub}</div>
                  <div className="chz">{f.hz} Hz{f.type === 'binaural' ? ` · ${f.beat} Hz beat` : ' · pure'}</div>
                </div>
                <div className="cbtn">{on ? '■' : '▶'}</div>
              </div>
            );
          })}
        </div>

        <div className="foot">echo.11 · native synthesis · not a medical device</div>
      </div>

      {now && (
        <div className="npbar">
          <div className="eq"><i></i><i></i><i></i></div>
          <div className="mid">
            <div className="npname">{now.name}</div>
            <div className="npmeta">Playing · {now.hz} Hz</div>
          </div>
          <button className="stop" onClick={() => toggle(now)}>Stop</button>
        </div>
      )}
    </div>
  );
}

function Root() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#08070a', padding:'24px 0' }}>
      <IOSDevice dark width={390} height={844}>
        <Dashboard />
      </IOSDevice>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
