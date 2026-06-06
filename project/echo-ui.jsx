// echo.|| — Defensive UX primitives (Task 1)
// Reusable Spinner, Skeleton, and InlineError+Retry. Used by Auth, Insights
// (RSS), Paywall — and later by the Saved (favorites) and Settings screens.

// ── Spinner ── a quiet rotating ring. tone: 'accent' (default, on surfaces)
//    | 'light' (on dark buttons) | 'ink' (dark, on light buttons).
function Spinner({ size = 18, tone = 'accent', style }) {
  const cls = 'echo-spinner' + (tone === 'light' ? ' on-light' : tone === 'ink' ? ' on-ink' : '');
  return (
    <span
      className={cls}
      role="status"
      aria-label="Loading"
      style={{ width: size, height: size, borderWidth: Math.max(2, Math.round(size / 8)), ...style }}
    />
  );
}

// ── Skeleton ── shimmering placeholder block while content loads.
function Skeleton({ w = '100%', h = 16, r = 10, style }) {
  return <div className="skel" aria-hidden="true" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

// ── InlineError ── clear failure message + an explicit Retry. Replaces the
//    app's previous silent fallbacks. `tone="light"` for the light Auth canvas.
function InlineError({ message = 'Something went wrong.', hint, onRetry, retrying = false, center = false, tone }) {
  return (
    <div className={'inline-err' + (center ? ' center' : '') + (tone === 'light' ? ' on-light' : '')} role="alert">
      <div className="ie-head">
        <span className="ie-ico" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 8v5M12 16.5v.5" /><circle cx="12" cy="12" r="9" />
          </svg>
        </span>
        <div className="ie-text">
          <div className="ie-msg">{message}</div>
          {hint ? <div className="ie-hint">{hint}</div> : null}
        </div>
      </div>
      {onRetry && (
        <button className="ie-retry" onClick={onRetry} disabled={retrying} aria-label="Retry">
          {retrying
            ? <><Spinner size={13} tone={tone === 'light' ? 'ink' : 'accent'} /> Retrying…</>
            : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-2.6-6.3" /><path d="M21 3v5h-5" /></svg> Retry</>}
        </button>
      )}
    </div>
  );
}

// small awaitable delay so instant/mock backends still give perceptible feedback
const echoWait = (ms) => new Promise((r) => setTimeout(r, ms));

Object.assign(window, { Spinner, Skeleton, InlineError, echoWait });
