// ─────────────────────────────────────────────────────────────
// echo.11 · frequency catalog
// Ported 1:1 from echo11-frequencies/app.js  (const FREQS = [...])
//
// Each entry preserves the EXACT values from the web engine:
//   type      'binaural' (two sine carriers, L/R)  |  'solfeggio' (one pure sine)
//   cL / cR   left / right carrier frequency in Hz  (solfeggio: cL === cR)
//   beat      cR - cL  (the binaural beat the brain perceives); null for pure tones
//   hz        the headline frequency shown in the UI
//
// This is the source of truth the native ToneEngine renders to PCM.
// 21 frequencies — matching the live array in app.js (Schumann is marketed
// but not present in the shipped array; add it here if/when you add it on web).
// ─────────────────────────────────────────────────────────────

export const FREQS = [
  // ── Science · binaural beats ───────────────────────────────
  { id: 'gamma', num: 'A1', cat: 'science', mode: 'focus',   type: 'binaural',  hz: 40,  cL: 200, cR: 240, beat: 40, name: 'Gamma MIT',   sub: 'Focus · Brain Health',   desc: 'Inspired by MIT 40 Hz research. Active concentration and cognitive performance.' },
  { id: 'alpha', num: 'A2', cat: 'science', mode: 'focus',   type: 'binaural',  hz: 10,  cL: 200, cR: 210, beat: 10, name: 'Alpha Silva',  sub: 'Creativity · Clarity',    desc: 'Alpha 8–12 Hz. Relaxed focus, creativity, the Silva method state.' },
  { id: 'theta', num: 'A3', cat: 'science', mode: 'healing', type: 'binaural',  hz: 6,   cL: 200, cR: 206, beat: 6,  name: 'Deep Theta',   sub: 'Meditation · Subconscious', desc: 'Theta 4–8 Hz. Deep meditation and emotional processing.' },
  { id: 'beta',  num: 'A4', cat: 'science', mode: 'focus',   type: 'binaural',  hz: 18,  cL: 300, cR: 318, beat: 18, name: 'Beta Focus',   sub: 'Attention · ADHD',        desc: 'Beta 12–30 Hz. Analytical work and active attention.' },
  { id: 'delta', num: 'A5', cat: 'science', mode: 'sleep',   type: 'binaural',  hz: 2,   cL: 200, cR: 202, beat: 2,  name: 'Delta Sleep',  sub: 'Deep Sleep · Renewal',    desc: 'Delta 0.5–4 Hz. Deep sleep and physical recovery.' },

  // ── Solfeggio · pure tones ─────────────────────────────────
  { id: 'hz174', num: 'B1',  cat: 'solfeggio', mode: 'healing',   type: 'solfeggio', hz: 174, cL: 174, cR: 174, beat: null, name: 'Release',      sub: 'Pain · Fear · Foundation', desc: '174 Hz. Associated with pain relief and a sense of security.' },
  { id: 'hz285', num: 'B2',  cat: 'solfeggio', mode: 'healing',   type: 'solfeggio', hz: 285, cL: 285, cR: 285, beat: null, name: 'Cellular Heal', sub: 'Cellular Healing',        desc: '285 Hz. Associated with tissue and cellular restoration.' },
  { id: 'hz396', num: 'B3',  cat: 'solfeggio', mode: 'healing',   type: 'solfeggio', hz: 396, cL: 396, cR: 396, beat: null, name: 'Liberation',   sub: 'Guilt · Trauma · Root',    desc: '396 Hz. Associated with releasing guilt and fear.' },
  { id: 'hz417', num: 'B4',  cat: 'solfeggio', mode: 'abundance', type: 'solfeggio', hz: 417, cL: 417, cR: 417, beat: null, name: 'Change',       sub: 'Openness · New Reality',   desc: '417 Hz. Associated with change and new beginnings.' },
  { id: 'hz432', num: 'B5',  cat: 'solfeggio', mode: 'sleep',     type: 'solfeggio', hz: 432, cL: 432, cR: 432, beat: null, name: 'The Universe', sub: 'Deep Sleep · Alignment',   desc: '432 Hz. "Natural tuning", aligned with the golden ratio.' },
  { id: 'hz528', num: 'B6',  cat: 'solfeggio', mode: 'healing',   type: 'solfeggio', hz: 528, cL: 528, cR: 528, beat: null, name: 'The Love',     sub: 'Heart · Restoration',      desc: '528 Hz. The MI tone — heart opening and emotional restoration.' },
  { id: 'hz369', num: 'B7',  cat: 'solfeggio', mode: 'abundance', type: 'solfeggio', hz: 369, cL: 369, cR: 369, beat: null, name: 'Tesla 3-6-9',  sub: 'Energy · Alignment',       desc: '369 Hz. The Tesla 3-6-9 philosophy of energy and alignment.' },
  { id: 'hz639', num: 'B8',  cat: 'solfeggio', mode: 'healing',   type: 'solfeggio', hz: 639, cL: 639, cR: 639, beat: null, name: 'Connection',   sub: 'Relationships · Heart',    desc: '639 Hz. Associated with empathy and connection.' },
  { id: 'hz741', num: 'B9',  cat: 'solfeggio', mode: 'focus',     type: 'solfeggio', hz: 741, cL: 741, cR: 741, beat: null, name: 'Expression',   sub: 'Creativity · Truth',       desc: '741 Hz. Associated with self-expression and clarity.' },
  { id: 'hz852', num: 'B10', cat: 'solfeggio', mode: 'focus',     type: 'solfeggio', hz: 852, cL: 852, cR: 852, beat: null, name: 'Intuition',    sub: 'Insight · Flow',           desc: '852 Hz. Associated with intuition and flow states.' },
  { id: 'hz963', num: 'B11', cat: 'solfeggio', mode: 'abundance', type: 'solfeggio', hz: 963, cL: 963, cR: 963, beat: null, name: 'Unity',        sub: 'Abundance · Awakening',    desc: '963 Hz. Associated with spiritual awakening and unity.' },
  { id: 'hz888', num: 'B12', cat: 'solfeggio', mode: 'abundance', type: 'solfeggio', hz: 888, cL: 888, cR: 888, beat: null, name: 'Abundance',    sub: 'Financial · Attraction',   desc: '888 Hz. Associated with abundance in Eastern numerology.' },

  // ── echo.11 originals ──────────────────────────────────────
  { id: 'echo111',  num: 'C1', cat: 'echo11', mode: 'healing', type: 'binaural', hz: 111, cL: 111, cR: 122, beat: 11, name: 'The Echo',        sub: 'echo.11 · Home Frequency', desc: '1+1+1=3 · Tesla Gate 11. An 11 Hz binaural beat on a 111 Hz carrier.' },
  { id: 'echoDual', num: 'C2', cat: 'echo11', mode: 'focus',   type: 'binaural', hz: 528, cL: 528, cR: 568, beat: 40, name: 'Gamma + Love',    sub: 'Healing + Focus',          desc: '528 Hz love frequency blended with a 40 Hz Gamma beat.' },
  { id: 'echoFog',  num: 'C3', cat: 'echo11', mode: 'focus',   type: 'binaural', hz: 40,  cL: 200, cR: 214, beat: 14, name: 'Brain Fog Clear', sub: 'Mental Clarity',           desc: 'Carrier 200 Hz with a 14 Hz Beta beat for a morning mental reset.' },
  { id: 'echoMiso', num: 'C4', cat: 'echo11', mode: 'healing', type: 'binaural', hz: 6,   cL: 180, cR: 186, beat: 6,  name: 'Misophonia',      sub: 'Sound Sensitivity Relief', desc: 'Theta 6 Hz to calm the auditory nervous system. An echo.11 original.' },
];

export const byId = (id) => FREQS.find((f) => f.id === id);

// The "home" frequency echo.11 leads with.
export const DEFAULT_FREQ_ID = 'hz528';
