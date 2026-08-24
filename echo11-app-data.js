/* echo.|| — app data: 22 frequencies (2 categories), gallery, history, AI */
window.ECHO = (function(){
  var FREQS = [
    /* ── Binaural Synchronization (needs headphones) ── */
    { n:'Delta Sleep',     hz:'2 Hz',    sub:'Deep sleep & renewal',     cat:'binaural', img:'img/astro-rest.png' },
    { n:'Theta Drift',     hz:'6 Hz',    sub:'Meditation · subconscious',cat:'binaural', img:'img/eyes-closed.png' },
    { n:'Alpha Clarity',   hz:'10 Hz',   sub:'Calm focus · creativity',  cat:'binaural', img:'img/face-up.png' },
    { n:'Beta Focus',      hz:'18 Hz',   sub:'Sustained attention',      cat:'binaural', img:'img/astro-data.png' },
    { n:'Gamma Insight',   hz:'40 Hz',   sub:'Peak cognition · brain health', cat:'binaural', img:'img/astro-gaze.png' },
    { n:'SMR Steady',      hz:'14 Hz',   sub:'Calm alertness',           cat:'binaural', img:'img/calm-closed.png' },
    { n:'Lucid Theta',     hz:'4.5 Hz',  sub:'Dream & lucidity',         cat:'binaural', img:'img/veil.png' },
    { n:'Schumann',        hz:'7.83 Hz', sub:'Earth resonance · grounding', cat:'binaural', img:'img/desert.webp' },
    { n:'The Genius Point',hz:'9 Hz',    sub:'Flow · the point of genius', cat:'binaural', img:'img/schematic.png' },
    { n:'Deep Renewal',    hz:'1 Hz',    sub:'Restorative rest',         cat:'binaural', img:'img/clear-helmet.png' },
    { n:'The Echo',        hz:'11 Hz',   sub:'echo.11 home frequency',   cat:'binaural', img:'img/cosmic-web.png', premium:true },
    /* ── Pure-Tone Resonance (single solfeggio tones) ── */
    { n:'Release',         hz:'174 Hz',  sub:'Foundation · ease',        cat:'tone', img:'img/helmet-field.png' },
    { n:'Cellular',        hz:'285 Hz',  sub:'Restoration',              cat:'tone', img:'img/eyes-open.png' },
    { n:'Liberation',      hz:'396 Hz',  sub:'Letting go',               cat:'tone', img:'img/cape-sun.png' },
    { n:'Change',          hz:'417 Hz',  sub:'Facilitating change',      cat:'tone', img:'img/door.png' },
    { n:'The Universe',    hz:'432 Hz',  sub:'Natural tuning · alignment', cat:'tone', img:'img/neural-light.png' },
    { n:'Repair',          hz:'528 Hz',  sub:'Renewal · the heart',      cat:'tone', img:'img/energy.png' },
    { n:'Connection',      hz:'639 Hz',  sub:'Relationships · empathy',  cat:'tone', img:'img/cape-back.png' },
    { n:'Intuition',       hz:'741 Hz',  sub:'Clarity · expression',     cat:'tone', img:'img/standing.png' },
    { n:'Awakening',       hz:'852 Hz',  sub:'Intuition · insight',      cat:'tone', img:'img/gaze-dark.png' },
    { n:'Abundance',       hz:'963 Hz',  sub:'Abundance · expansion',    cat:'tone', img:'img/cape-sparkle.png', premium:true },
    { n:'Tesla 369',       hz:'369 Hz',  sub:'Energy · vitality',        cat:'tone', img:'img/schematic-2.png', premium:true }
  ];

  var WALLPAPERS = [
    { name:'Drift',     img:'img/veil.png',         pro:false },
    { name:'Ascend',    img:'img/energy.png',       pro:false },
    { name:'Solace',    img:'img/cape-sun.png',     pro:false },
    { name:'Field',     img:'img/helmet-field.png', pro:false },
    { name:'Horizon',   img:'img/desert.webp',      pro:false },
    { name:'Rest',      img:'img/astro-rest.png',   pro:false },
    { name:'Gaze',      img:'img/gaze-dark.png',    pro:true },
    { name:'Stillness', img:'img/calm-closed.png',  pro:true },
    { name:'Orbit',     img:'img/cape-sparkle.png', pro:true },
    { name:'Eclipse',   img:'img/cape-back.png',    pro:true },
    { name:'Threshold', img:'img/door.png',         pro:true },
    { name:'Vessel',    img:'img/clear-helmet.png', pro:true }
  ];

  var WEEK_QUOTE = {
    week:'Week 24 · 2026',
    text:'You don\u2019t chase stillness \u2014 you <em>tune</em> to it. Twenty quiet minutes today is a signal the rest of your week will follow.'
  };

  /* listening history (most recent first) */
  var HISTORY = [
    { n:'Alpha Clarity', hz:'10 Hz',  cat:'binaural', when:'Today · 21:12',     min:15, img:'img/face-up.png' },
    { n:'Repair',        hz:'528 Hz', cat:'tone',     when:'Today · 08:05',     min:10, img:'img/energy.png' },
    { n:'Theta Drift',   hz:'6 Hz',   cat:'binaural', when:'Yesterday · 22:40', min:20, img:'img/eyes-closed.png' },
    { n:'Delta Sleep',   hz:'2 Hz',   cat:'binaural', when:'Yesterday · 23:30', min:30, img:'img/astro-rest.png' },
    { n:'Gamma Insight', hz:'40 Hz',  cat:'binaural', when:'2 days ago · 19:50',min:25, img:'img/astro-gaze.png' },
    { n:'The Universe',  hz:'432 Hz', cat:'tone',     when:'3 days ago · 07:30',min:12, img:'img/neural-light.png' }
  ];

  /* simulated cognitive-behaviour agent — analyses time/duration/band */
  function buildAI(){
    return {
      stats:{ streak:4, week:182, sessions:21, coherence:'0.82' },
      summary:'You listen <b>almost entirely in the evening</b>, mostly in the <b>alpha\u2013theta</b> range. That\u2019s a calm, wind-down pattern \u2014 great for your nervous system, but your <b>focus &amp; peak-cognition bands are under-used</b>. Sessions average 17 min; nudging two of them to 20 would deepen entrainment.',
      recs:[
        { n:'Beta Focus', hz:'18 Hz', why:'A morning focus block \u2014 the band you skip most.' },
        { n:'Delta Sleep', hz:'2 Hz', why:'Close the night instead of stopping at theta.' },
        { n:'Gamma Insight', hz:'40 Hz', why:'One peak-cognition session to balance the week.' }
      ]
    };
  }

  return { FREQS:FREQS, WALLPAPERS:WALLPAPERS, WEEK_QUOTE:WEEK_QUOTE, HISTORY:HISTORY, buildAI:buildAI };
})();
