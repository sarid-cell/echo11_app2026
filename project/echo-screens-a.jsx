// ECHO.11 — line icons (stroke = currentColor)
function Icon({ name, size = 22, sw = 1.6 }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    signal: <g {...p}><path d="M3 12a9 9 0 0 1 9-9M6.5 12A5.5 5.5 0 0 1 12 6.5M12 21a9 9 0 0 0 9-9M12 17.5A5.5 5.5 0 0 0 17.5 12"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/></g>,
    insights: <g {...p}><path d="M5 4h14M5 4v16M5 20h14M9 9h7M9 13h7M9 17h4"/></g>,
    listen: <g {...p}><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="3" y="13" width="4" height="7" rx="1.6"/><rect x="17" y="13" width="4" height="7" rx="1.6"/></g>,
    about: <g {...p}><circle cx="12" cy="8.5" r="3.8"/><path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6"/></g>,
    play: <path d="M7 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>,
    pause: <g><rect x="6.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/><rect x="13.5" y="5" width="4" height="14" rx="1.2" fill="currentColor"/></g>,
    back15: <g {...p}><path d="M11 4 7 8l4 4"/><path d="M7 8h7a5 5 0 0 1 0 10h-3"/></g>,
    fwd15: <g {...p}><path d="M13 4l4 4-4 4"/><path d="M17 8h-7a5 5 0 0 0 0 10h3"/></g>,
    arrow: <g {...p}><path d="M5 12h14M13 6l6 6-6 6"/></g>,
    arrowUR: <g {...p}><path d="M7 17 17 7M9 7h8v8"/></g>,
    back: <g {...p}><path d="M15 5l-7 7 7 7"/></g>,
    share: <g {...p}><path d="M12 3v13M8 7l4-4 4 4"/><path d="M6 12v7a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-7"/></g>,
    bookmark: <g {...p}><path d="M6 4h12v16l-6-4-6 4z"/></g>,
    lock: <g {...p}><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></g>,
    chevdown: <g {...p}><path d="M6 9l6 6 6-6"/></g>,
    heart: <path d="M12 20.5s-6.6-4.2-9.1-7.9C1.3 10.4 2 7.2 4.7 6.1c1.8-.74 3.8-.05 4.9 1.45l.4.55.4-.55c1.1-1.5 3.1-2.19 4.9-1.45 2.7 1.1 3.4 4.3 1.8 6.5C18.6 16.3 12 20.5 12 20.5z" {...p}/>,
    heartfill: <path d="M12 20.5s-6.6-4.2-9.1-7.9C1.3 10.4 2 7.2 4.7 6.1c1.8-.74 3.8-.05 4.9 1.45l.4.55.4-.55c1.1-1.5 3.1-2.19 4.9-1.45 2.7 1.1 3.4 4.3 1.8 6.5C18.6 16.3 12 20.5 12 20.5z" fill="currentColor" stroke="none"/>,
    settings: <g {...p}><path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h6M14 18h6"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="12" cy="18" r="2"/></g>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24">{paths[name]}</svg>;
}

// ── BRAND LOGO ── inline "echo.||" — the || doubles as a pause glyph. Never stacked.
function EchoLogo({ size = 'sm', light = false }) {
  return (
    <span className={'echo-logo echo-logo--' + size + (light ? ' echo-logo--light' : '')} aria-label="echo.||">
      <span className="echo-logo__text">echo.</span>
      <span className="echo-logo__mark" aria-hidden="true"><i></i><i></i></span>
    </span>
  );
}

// ── HOME / THE SIGNAL ──────────────────────────────────────────
function HomeScreen({ go }) {
  return (
    <div className="echo-page">
      <div className="hero">
        <img crossOrigin="anonymous" src={IMG.astroOpen} alt="Cinematic black-and-white portrait of an astronaut gazing forward through a glass helmet" />
        <div className="hero-body">
          <div className="kicker">The Vision</div>
          <h1>Decoding the <em>Algorithm</em> of Human Resilience</h1>
        </div>
      </div>

      <div className="section tight">
        <div className="kicker">Psychology First, Pixels Second</div>
        <p className="manifesto"><span className="lead">In an economy of attention, visuals are not enough.</span> My approach decodes the neural pathways of your audience — fusing consumer psychology with Generative AI to craft experiences that cut through the noise. We strip away the excess to reach the <b>signal</b>.</p>
      </div>

      <div className="section">
        <div className="kicker">The Approach</div>
        <div className="pillars">
          {PILLARS.map(p => (
            <div className="pillar" key={p.n}>
              <div className="num">{p.n}</div>
              <div>
                <h3>{p.h}</h3>
                <p>{p.p}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="row-between">
          <div className="kicker">Fresh Insight</div>
          <span className="meta" onClick={() => go('insights')} style={{ cursor: 'pointer' }}>All →</span>
        </div>
      </div>
      <div className="feat" onClick={() => go('reader', ARTICLES[0])}>
        <div className="feat-img">
          <img crossOrigin="anonymous" src={ARTICLES[0].img} alt={`Editorial image for the article “${ARTICLES[0].title}”`} />
        </div>
        <div className="feat-body">
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span className="badge">New</span>
            <span className="meta">{ARTICLES[0].read} read</span>
          </div>
          <h3>{ARTICLES[0].title}</h3>
          <p>{ARTICLES[0].dek}</p>
        </div>
      </div>

      <div className="section">
        <div className="feat" style={{ marginInline: 0 }} onClick={() => go('listen')}>
          <div className="feat-img" style={{ aspectRatio: '16/9' }}>
            <img crossOrigin="anonymous" src={IMG.astroClosed} alt="Cinematic black-and-white portrait of an astronaut with eyes closed — the CTRL+HUMAN podcast" />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="transport" style={{ margin: 0, padding: 0 }}>
                <div className="play" style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'var(--accent)', color: 'var(--accent-ink)' }}><Icon name="play" size={22} /></div>
              </div>
            </div>
          </div>
          <div className="feat-body">
            <span className="meta">Podcast · CTRL+HUMAN</span>
            <h3>Listen to the latest signal</h3>
            <p>Conversations on AI, psychology, and the future of human potential.</p>
          </div>
        </div>
      </div>

      <div className="foot">echo.|| — by Shira Sarid</div>
    </div>
  );
}

// ── INSIGHTS FEED ──────────────────────────────────────────────
// STRICTLY reading. Two content tiers:
//   • HERO  → the latest post, fetched dynamically from the Substack RSS feed.
//   • LIST  → hardcoded "evergreen" explainers that don't change week to week.
//
// SUBSTACK RSS (hero):
//   Feed: https://shirasarid.substack.com/feed
//   Browsers can't fetch it directly (no CORS on Substack), so in production
//   route it through a tiny proxy — e.g. a Supabase Edge Function that fetches
//   the XML server-side and returns JSON. Wire FEED_ENDPOINT to that URL.
//   Until then this falls back to the newest local article (ARTICLES[0]).
const FEED_ENDPOINT = null;   // e.g. 'https://<project>.supabase.co/functions/v1/substack-latest'

function useLatestSubstackPost() {
  // Defensive states: loading (skeleton) → success | error (Retry).
  // Previously this silently swallowed failures; now the UI can react.
  const [state, setState] = React.useState({ post: null, loading: true, error: false });

  const load = React.useCallback(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: false }));
    (async () => {
      try {
        if (!FEED_ENDPOINT) {
          // Demo mode: no proxy wired yet. Simulate the fetch so the loading
          // skeleton is exercised, then resolve to the newest local article.
          await echoWait(950);
          if (alive) setState({ post: ARTICLES[0], loading: false, error: false });
          return;
        }
        const res = await fetch(FEED_ENDPOINT);
        if (!res.ok) throw new Error('Bad status ' + res.status);
        const items = await res.json();                    // [{ title, dek, img, url, read }]
        const latest = Array.isArray(items) ? items[0] : items;
        if (!latest) throw new Error('Empty feed');
        if (alive) setState({
          post: {
            id: 'latest', badge: 'New', kicker: 'Latest from Substack',
            title: latest.title, dek: latest.dek || latest.subtitle || '',
            img: latest.img || ARTICLES[0].img, read: latest.read || '5 min',
            url: latest.url, body: latest.body || [], quote: latest.quote || null,
          },
          loading: false, error: false,
        });
      } catch (e) {
        if (alive) setState({ post: null, loading: false, error: true });
      }
    })();
    return () => { alive = false; };
  }, []);

  React.useEffect(() => load(), [load]);
  return { ...state, retry: load };
}

function InsightsScreen({ go }) {
  // HERO — dynamic latest post (see useLatestSubstackPost above).
  const { post: hero, loading, error, retry } = useLatestSubstackPost();
  // LIST — evergreen explainers, intentionally hardcoded (skip the dynamic hero).
  const evergreen = ARTICLES.filter(a => !hero || a.id !== hero.id).slice(0, 4);
  return (
    <div className="echo-page">
      <div className="section" style={{ marginTop: 8 }}>
        <div className="kicker">Insights</div>
        <h2 className="section-title">Fresh Insights</h2>
        <p className="section-sub">Simple. Read the future.</p>
      </div>

      {/* HERO ARTICLE — latest from the Substack RSS feed.
          Loading → skeleton · Error → InlineError+Retry · Success → article. */}
      {loading ? (
        <div className="feat skel-feat" aria-hidden="true">
          <div className="feat-img"><Skeleton w="100%" h="100%" r={0} /></div>
          <div className="feat-body">
            <Skeleton w={64} h={20} r={99} />
            <Skeleton w="86%" h={24} r={8} style={{ marginTop: 14 }} />
            <Skeleton w="100%" h={14} r={6} style={{ marginTop: 12 }} />
            <Skeleton w="52%" h={14} r={6} style={{ marginTop: 7 }} />
          </div>
        </div>
      ) : error ? (
        <div className="section">
          <InlineError
            center
            message="We couldn’t load the latest post."
            hint="Your evergreen reads are still below."
            onRetry={retry}
            retrying={loading}
          />
        </div>
      ) : (
        <div className="feat" onClick={() => go('reader', hero)}>
          <div className="feat-img"><img crossOrigin="anonymous" src={hero.img} alt={`Editorial image for the article “${hero.title}”`} /></div>
          <div className="feat-body">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="badge">New</span>
              <span className="meta">{hero.read} read</span>
            </div>
            <h3>{hero.title}</h3>
            <p>{hero.dek}</p>
          </div>
        </div>
      )}

      {/* EVERGREEN LIST — hardcoded explainers */}
      <div className="section">
        {evergreen.map(a => (
          <div className="ins-row" key={a.id} onClick={() => go('reader', a)}>
            <div>
              <div className="row-top">
                <span className="meta">{a.kicker}</span>
                <span className="meta">· {a.read}</span>
              </div>
              <h3>{a.title}</h3>
              <p>{a.dek}</p>
            </div>
            <div className="thumb"><img crossOrigin="anonymous" src={a.img} alt={`Thumbnail for the article “${a.title}”`} /></div>
          </div>
        ))}
      </div>

      <div className="section">
        <button className="btn ghost" onClick={() => window.open('https://shirasarid.substack.com/', '_blank')} aria-label="View all articles on Substack (opens in a new tab)">
          View all on Substack <Icon name="arrowUR" size={16} />
        </button>
      </div>
    </div>
  );
}

// ── ARTICLE READER ─────────────────────────────────────────────
function ReaderScreen({ article, back, scrollRef }) {
  const [prog, setProg] = React.useState(0);
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProg(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
    };
    el.addEventListener('scroll', onScroll);
    el.scrollTop = 0;
    return () => el.removeEventListener('scroll', onScroll);
  }, [article]);

  return (
    <div className="echo-page">
      <div className="progressbar" style={{ width: `${prog * 100}%` }} />
      <div className="reader-hero">
        <img crossOrigin="anonymous" src={article.img} alt={`Header image for the article “${article.title}”`} />
      </div>
      <div className="reader-body">
        <div className="kicker">{article.kicker}</div>
        <h1>{article.title}</h1>
        <div className="reader-byline">
          <span>BY SHIRA SARID</span>
          <span style={{ color: 'var(--faint)' }}>·</span>
          <span>{article.read} READ</span>
          <span style={{ color: 'var(--faint)' }}>·</span>
          <span>2026</span>
        </div>
        <div className="reader-text">
          {article.body.map((para, i) => (
            <React.Fragment key={i}>
              <p>{para}</p>
              {i === 0 && article.quote && <div className="pullquote">{article.quote}</div>}
            </React.Fragment>
          ))}
        </div>
        <div style={{ marginTop: 8 }}>
          <button className="btn solid" onClick={() => window.open(article.url, '_blank')}>
            Read full essay on Substack <Icon name="arrowUR" size={16} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button className="btn ghost" style={{ flex: 1 }}><Icon name="bookmark" size={17} /> Save</button>
          <button className="btn ghost" style={{ flex: 1 }}><Icon name="share" size={17} /> Share</button>
        </div>
        <div className="foot">echo.|| — Decoding the algorithm of human resilience</div>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, EchoLogo, HomeScreen, InsightsScreen, ReaderScreen });
