/* echo.|| — app data: 22 frequencies (2 categories), gallery, rotating lines */
window.ECHO = (function(){
  var FREQS = [
    /* ── Binaural Synchronization (needs headphones) ── */
    { n:'Delta Sleep',     hz:'2 Hz',    sub:'Deep sleep · stillness',   cat:'binaural', img:'img/astro-rest.png' },
    { n:'Theta Drift',     hz:'6 Hz',    sub:'Meditation · subconscious',cat:'binaural', img:'img/eyes-closed.png' },
    { n:'Alpha Clarity',   hz:'10 Hz',   sub:'Calm focus · creativity',  cat:'binaural', img:'img/face-up.png' },
    { n:'Beta Focus',      hz:'18 Hz',   sub:'Sustained attention',      cat:'binaural', img:'img/astro-data.png' },
    { n:'Gamma Insight',   hz:'40 Hz',   sub:'Bright · wide awake',      cat:'binaural', img:'img/astro-gaze.png' },
    { n:'SMR Steady',      hz:'14 Hz',   sub:'Calm alertness',           cat:'binaural', img:'img/calm-closed.png' },
    { n:'Lucid Theta',     hz:'4.5 Hz',  sub:'Dream & lucidity',         cat:'binaural', img:'img/veil.png' },
    { n:'Schumann',        hz:'7.83 Hz', sub:'Earth resonance · grounding', cat:'binaural', img:'img/desert.webp' },
    { n:'The Genius Point',hz:'9 Hz',    sub:'Flow · absorbed', cat:'binaural', img:'img/schematic.png' },
    { n:'Deep Renewal',    hz:'1 Hz',    sub:'Slow, heavy rest',         cat:'binaural', img:'img/clear-helmet.png' },
    { n:'The Echo',        hz:'11 Hz',   sub:'echo.11 home frequency',   cat:'binaural', img:'img/cosmic-web.png', premium:true },
    /* ── Pure-Tone Resonance (single solfeggio tones) ── */
    { n:'Release',         hz:'174 Hz',  sub:'Foundation · ease',        cat:'tone', img:'img/helmet-field.png' },
    { n:'Sanctuary',       hz:'285 Hz',  sub:'Safety · ease',            cat:'tone', img:'img/eyes-open.png' },
    { n:'Liberation',      hz:'396 Hz',  sub:'Letting go',               cat:'tone', img:'img/cape-sun.png' },
    { n:'Change',          hz:'417 Hz',  sub:'Fresh start',              cat:'tone', img:'img/door.png' },
    { n:'The Universe',    hz:'432 Hz',  sub:'Natural tuning · alignment', cat:'tone', img:'img/neural-light.png' },
    { n:'The Heart',       hz:'528 Hz',  sub:'Warmth · softness',        cat:'tone', img:'img/energy.png' },
    { n:'Connection',      hz:'639 Hz',  sub:'Relationships · empathy',  cat:'tone', img:'img/cape-back.png' },
    { n:'Intuition',       hz:'741 Hz',  sub:'Clarity · expression',     cat:'tone', img:'img/standing.png' },
    { n:'Awakening',       hz:'852 Hz',  sub:'Intuition · insight',      cat:'tone', img:'img/gaze-dark.png' },
    { n:'Abundance',       hz:'963 Hz',  sub:'Open · expansive',         cat:'tone', img:'img/cape-sparkle.png', premium:true },
    { n:'Tesla 369',       hz:'369 Hz',  sub:'Bright · lifted',          cat:'tone', img:'img/schematic-2.png', premium:true }
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

  /* rotating lines for the Gallery card — a new one on every visit.
     'line' = a reflection; 'fact' = a true, checkable curiosity.
     Rule (same as the rest of the app): experiences and intentions, never
     health outcomes stated as fact. Each one should stand alone as a post. */
  var LINES = [
    { k:'line', t:'You don’t chase stillness — you <em>tune</em> to it.' },
    { k:'line', t:'Twenty quiet minutes isn’t a break from your day. It’s <em>part</em> of it.' },
    { k:'line', t:'Attention is the frequency you broadcast most. What are you tuned to today?' },
    { k:'line', t:'Slow is a speed, too.' },
    { k:'line', t:'Curiosity is the mind <em>leaning in</em>.' },
    { k:'line', t:'Some things only exist between the notes. Listen closer.' },
    { k:'line', t:'The quietest room is the one you carry with you.' },
    { k:'line', t:'You can’t force a wave. You can only make room for it.' },
    { k:'line', t:'Notice the pause between two thoughts. That’s where echo lives.' },
    { k:'line', t:'Energy follows attention. Where is yours right now?' },
    { k:'line', t:'Trade one scroll for one slow breath. See what changes.' },
    { k:'line', t:'Your mind has a tempo. Today, <em>choose</em> it.' },
    { k:'line', t:'Small rituals, repeated, become a rhythm.' },
    { k:'line', t:'Headphones on. World off. Just for a while.' },
    { k:'line', t:'Clarity rarely shouts. It <em>hums</em>.' },
    { k:'line', t:'The beat you hear is yours — your own mind is making it.' },
    { k:'line', t:'Rest isn’t the opposite of focus. It’s where focus starts.' },
    { k:'line', t:'Tune in before you reach out.' },
    { k:'line', t:'Stillness is a practice. Showing up counts more than getting it right.' },
    { k:'line', t:'Every frequency is an invitation, not an instruction.' },
    { k:'fact', t:'Binaural beats were first described in <em>1839</em>, by the physicist Heinrich Wilhelm Dove.' },
    { k:'fact', t:'The beat in a binaural tone isn’t in the air. No microphone between your ears could record it — it appears <em>inside</em> your head.' },
    { k:'fact', t:'Your brain is about 2% of your body’s weight, yet it uses roughly <em>20%</em> of its energy.' },
    { k:'fact', t:'Hans Berger recorded the first human brainwaves in 1924 — and noticed the “alpha” rhythm grows when the eyes <em>close</em>.' },
    { k:'fact', t:'The Earth rings. Lightning keeps the space between ground and sky resonating at about <em>7.83 Hz</em> — the Schumann resonance.' },
    { k:'fact', t:'A = 440 Hz was agreed as the tuning standard in 1939 and made official in 1955. Some musicians still prefer <em>432</em>.' },
    { k:'fact', t:'Your ears are about 20 cm apart, and your brain compares the sound reaching each one to within <em>millionths</em> of a second.' },
    { k:'fact', t:'Binaural beats work best on low carrier tones — under about 1,000 Hz. That’s why echo builds on <em>200 Hz</em>.' },
    { k:'fact', t:'Most of echo’s beats sit below the lowest pitch we can hear (about 20 Hz). You don’t hear them as notes — you feel them as a <em>pulse</em>.' },
    { k:'fact', t:'In a perfectly silent room, people start to hear their own heartbeat. Silence is never quite <em>empty</em>.' }
  ];

  return { FREQS:FREQS, WALLPAPERS:WALLPAPERS, LINES:LINES };
})();
