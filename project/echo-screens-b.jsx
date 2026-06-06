// ECHO.11 — Podcast (CTRL+HUMAN) & About/Connect

// ── PODCAST ────────────────────────────────────────────────────
function PodcastScreen() {
  const [playing, setPlaying] = React.useState(true);
  const [cur, setCur] = React.useState(0);       // 0..1 progress
  const [epIdx, setEpIdx] = React.useState(0);
  const total = 38 * 60 + 12;                     // 38:12 of ep 01

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setCur(c => (c >= 1 ? 1 : c + 1 / total)), 1000);
    return () => clearInterval(id);
  }, [playing]);

  const ep = EPISODES[epIdx];
  const fmt = (sec) => {
    sec = Math.max(0, Math.round(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };
  const seekTo = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setCur(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  };

  // static waveform pattern
  const bars = React.useMemo(() => Array.from({ length: 56 }, (_, i) =>
    0.25 + 0.75 * Math.abs(Math.sin(i * 0.7) * Math.cos(i * 0.31) + Math.sin(i * 1.3) * 0.4)), []);

  return (
    <div className="echo-page">
      <div className="section" style={{ marginTop: 8 }}>
        <div className="kicker">Podcast</div>
        <h2 className="section-title">CTRL+HUMAN</h2>
        <p className="section-sub">A podcast by Shira Sarid.</p>
      </div>

      <div className="np-art">
        <img crossOrigin="anonymous" src={ep.art} alt={`Cover art for CTRL+HUMAN episode ${ep.n}: ${ep.title}`} />
        <div className="np-badge badge">Now Playing</div>
      </div>

      <div className="np-meta">
        <span className="ep">EPISODE {ep.n}</span>
        <h2>{ep.title}</h2>
      </div>

      <div className="waveform">
        {bars.map((h, i) => (
          <div key={i} className={'bar' + (i / bars.length <= cur ? ' on' : '')}
               style={{ height: `${h * 100}%` }} />
        ))}
      </div>

      <div className="scrub">
        <div className="track" onClick={seekTo}>
          <div className="fill" style={{ width: `${cur * 100}%` }} />
          <div className="knob" style={{ left: `${cur * 100}%` }} />
        </div>
        <div className="times">
          <span>{fmt(cur * total)}</span>
          <span>-{fmt(total - cur * total)}</span>
        </div>
      </div>

      <div className="transport">
        <button onClick={() => setCur(c => Math.max(0, c - 15 / total))} aria-label="Rewind 15 seconds"><Icon name="back15" size={28} /></button>
        <button className="play" onClick={() => setPlaying(p => !p)} aria-label={playing ? 'Pause episode' : 'Play episode'}>
          <Icon name={playing ? 'pause' : 'play'} size={30} />
        </button>
        <button onClick={() => setCur(c => Math.min(1, c + 15 / total))} aria-label="Forward 15 seconds"><Icon name="fwd15" size={28} /></button>
      </div>
      <div style={{ textAlign: 'center', marginTop: 14 }}>
        <span className="meta">CTRL+HUMAN · Available on Apple Podcasts</span>
      </div>

      <div className="section" style={{ marginTop: 34 }}>
        <div className="kicker">Episodes</div>
        {EPISODES.map((e, i) => (
          <div className={'ep-row' + (i === epIdx ? ' playing' : '')} key={e.n}
               onClick={() => { setEpIdx(i); setCur(0); setPlaying(true); }}>
            <span className="epn">{e.n}</span>
            <div>
              <h4>{e.title}</h4>
              <div className="epd">{e.guest} · CTRL+HUMAN</div>
            </div>
            <span className="dur">{i === epIdx && playing ? '▶' : e.dur}</span>
          </div>
        ))}
      </div>

      <div className="section">
        <button className="btn ghost" onClick={() => window.open('https://podcasts.apple.com/us/podcast/ctrl-human-is-a-podcast-created-by-shira-sarid/id1812866120', '_blank')}>
          Open in Apple Podcasts <Icon name="arrowUR" size={16} />
        </button>
      </div>
    </div>
  );
}

// ── ABOUT / CONNECT ────────────────────────────────────────────
function AboutScreen({ unlocked, onUnlock, onLogout, savedCount = 0, onOpenSaved, onOpenSettings }) {
  return (
    <div className="echo-page">
      <div className="about-hero">
        <img crossOrigin="anonymous" src={IMG.astroClosed} alt="Cinematic black-and-white portrait of an astronaut resting with eyes closed inside a glass helmet" />
        <div className="ah-body">
          <h2>echo.||</h2>
          <p>by Shira Sarid</p>
        </div>
      </div>

      <div className="section" style={{ marginTop: 22 }}>
        <div className="kicker">Membership</div>
        {unlocked ? (
          <div className="premium-card" style={{ cursor: 'default' }}>
            <div className="pc-glow" />
            <div className="pc-kick">✦ Premium active</div>
            <h3>The Optimal Protocol</h3>
            <p>All 21 frequencies, extended sessions and the full protocol library unlocked. Thank you for tuning in.</p>
            <button className="pc-btn" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff' }}>Manage subscription</button>
          </div>
        ) : (
          <div className="premium-card" onClick={onUnlock}>
            <div className="pc-glow" />
            <div className="pc-kick">✦ echo.|| premium</div>
            <h3>Unlock the Full Spectrum</h3>
            <p>Access all 21 sound-based frequencies, extended session lengths and the full protocol library.</p>
            <button className="pc-btn" onClick={onUnlock}>Unlock Premium Protocol</button>
          </div>
        )}
      </div>

      {/* Your Library — secondary entry point to the Saved list on Home */}
      <div className="section" style={{ marginTop: 30 }}>
        <div className="kicker">Your Library</div>
        <button className="about-row" onClick={onOpenSaved} aria-label={`View saved frequencies, ${savedCount} saved`}>
          <span className="about-row-ico" aria-hidden="true"><Icon name="heartfill" size={17} /></span>
          <span className="about-row-body">
            <span className="about-row-title">Saved frequencies</span>
            <span className="about-row-sub">{savedCount === 0 ? 'Nothing saved yet — tap the heart on any frequency' : `${savedCount} saved · view on Home`}</span>
          </span>
          <span className="about-row-arr" aria-hidden="true"><Icon name="arrow" size={18} /></span>
        </button>
      </div>

      {/* Preferences — entry to the Settings sub-screen */}
      <div className="section" style={{ marginTop: 30 }}>
        <div className="kicker">Preferences</div>
        <button className="about-row" onClick={onOpenSettings} aria-label="Open settings">
          <span className="about-row-ico" aria-hidden="true"><Icon name="settings" size={17} /></span>
          <span className="about-row-body">
            <span className="about-row-title">Settings</span>
            <span className="about-row-sub">Appearance, account &amp; preferences</span>
          </span>
          <span className="about-row-arr" aria-hidden="true"><Icon name="arrow" size={18} /></span>
        </button>
      </div>

      <div className="section connect" style={{ marginTop: 30 }}>
        <div className="kicker">The Science / FAQ</div>
        <div className="faq">
          <details className="faq-item">
            <summary>What are binaural beats?<span className="faq-x"><Icon name="chevdown" size={16} /></span></summary>
            <p>When two slightly different pure tones are played — one in each ear — the brain perceives a third "beat" equal to their difference (e.g. 200 Hz left, 210 Hz right → a 10 Hz Alpha beat). This is associated with gently guiding brainwave activity toward that band.</p>
          </details>
          <details className="faq-item">
            <summary>Why do I need headphones?<span className="faq-x"><Icon name="chevdown" size={16} /></span></summary>
            <p>Binaural protocols only work with stereo separation — each ear must receive its own tone. On a speaker the two tones mix in the air and the effect is lost. Ambient (pure-tone) frequencies are speaker-safe.</p>
          </details>
          <details className="faq-item">
            <summary>How long &amp; how often?<span className="faq-x"><Icon name="chevdown" size={16} /></span></summary>
            <p>Most sessions are 15–30 minutes. Use the in-player duration selector. Sit or lie somewhere undisturbed, and stop if you feel any discomfort.</p>
          </details>
          <details className="faq-item">
            <summary>Is this safe?<span className="faq-x"><Icon name="chevdown" size={16} /></span></summary>
            <p>For most people, yes. <b>Do not use while driving or operating machinery.</b> If you have epilepsy, a seizure disorder, a pacemaker, or are pregnant, consult a physician first.</p>
          </details>
        </div>
        <div className="med-disclaimer">
          echo.|| is a wellbeing tool for relaxation and focus. It is <b>not a medical device</b> and is not intended to diagnose, treat, cure, or prevent any condition.
        </div>
      </div>

      <div className="section connect" style={{ marginTop: 30 }}>
        <div className="kicker">About</div>
        <p className="manifesto" style={{ marginTop: 14 }}>
          Bridging the gap between <b>Consumer Psychology</b> and <b>Generative AI</b> to build future-proof brands. Exploring the intersection of technology and human behavior — and the 2026 digital landscape.
        </p>
        <div className="signal-tags">
          <span className="tag">Strategy</span>
          <span className="tag">Psychology</span>
          <span className="tag">AI Tools</span>
        </div>
      </div>

      <div className="section connect">
        <div className="kicker">Let's connect in the noise</div>
        <h3 style={{ marginTop: 12 }}>Let’s build something that feels human.</h3>
        <a className="email" href="mailto:shirasarid@gmail.com" aria-label="Email Shira Sarid">shirasarid@gmail.com</a>
      </div>

      <div className="section">
        <div className="social">
          {SOCIALS.map(s => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" aria-label={`${s.label} — ${s.sub} (opens in a new tab)`}>
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                {s.label}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--faint)', fontWeight: 400, letterSpacing: '.5px', marginTop: 3 }}>{s.sub}</span>
              </span>
              <span className="arr" aria-hidden="true"><Icon name="arrowUR" size={18} /></span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Legal ─────────────────────────────────────────────── */}
      <div className="section connect">
        <div className="kicker">Legal</div>
        <div className="legal-links">
          <a href="https://echo-11-site.vercel.app/terms" target="_blank" rel="noreferrer" aria-label="Terms of Service (opens in a new tab)">Terms of Service (EULA)</a>
          <a href="https://echo-11-site.vercel.app/privacy" target="_blank" rel="noreferrer" aria-label="Privacy Policy (opens in a new tab)">Privacy Policy</a>
          <a href="https://echo-11-site.vercel.app/disclaimer" target="_blank" rel="noreferrer" aria-label="Medical disclaimer (opens in a new tab)">Medical Disclaimer</a>
        </div>
      </div>

      {/* ── Account / Log Out ─────────────────────────────────── */}
      <div className="section">
        <button className="btn ghost logout-btn" onClick={onLogout} aria-label="Log out of your account">Log Out</button>
      </div>

      <div className="foot">© 2026 echo.|| by Shira Sarid. All rights reserved.</div>
    </div>
  );
}

Object.assign(window, { PodcastScreen, AboutScreen });
