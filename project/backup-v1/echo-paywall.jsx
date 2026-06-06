// ECHO.11 — Premium Paywall
// Dark obsidian (#0B0B0B), Cormorant Garamond serif hooks, technical sans UI,
// single signal-blue (#82A9FF) accent for selection. Interactive tier cards.

function PulseSignal() {
  // brand mark: two thin parallel bars (||) above thin-weight "echo.11"
  return (
    <div style={pwStyles.logoWrap} aria-label="echo.11">
      <span style={pwStyles.logoMark} aria-hidden="true">
        <i style={pwStyles.logoBar} />
        <i style={pwStyles.logoBar} />
      </span>
      <span style={pwStyles.logoText}>echo.11</span>
    </div>
  );
}

function CheckDot({ on }) {
  return (
    <div style={{ ...pwStyles.radio, ...(on ? pwStyles.radioOn : null) }}>
      {on ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.2L5 8.6L9.6 3.6" stroke="#0B0B0B" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : null}
    </div>
  );
}

function TierCard({ plan, selected, onSelect }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        ...pwStyles.card,
        ...(selected ? pwStyles.cardSel : null),
        ...(hover && !selected ? pwStyles.cardHover : null),
      }}
    >
      {plan.badge ? <span style={pwStyles.badge}>{plan.badge}</span> : null}
      <div style={pwStyles.cardRow}>
        <CheckDot on={selected} />
        <div style={pwStyles.cardText}>
          <div style={pwStyles.cardTitle}>{plan.title}</div>
          <div style={pwStyles.cardPrice}>
            <span style={pwStyles.priceMain}>{plan.price}</span>
            {plan.sub ? <span style={pwStyles.priceSub}>{plan.sub}</span> : null}
          </div>
        </div>
      </div>
    </button>
  );
}

function Paywall({ onClose, onStart, sheet }) {
  const [selected, setSelected] = React.useState('yearly');

  const plans = {
    yearly: { id: 'yearly', title: 'The Optimal Protocol', price: '$69.99 / year', sub: '$5.83 / mo', badge: '7-DAY FREE TRIAL' },
    monthly: { id: 'monthly', title: 'The Flexible Protocol', price: '$11.99 / month', sub: null, badge: null },
  };

  const cta = selected === 'yearly' ? 'Start Your 7-Day Free Trial' : 'Unlock Full Access';
  const micro = selected === 'yearly' ? 'No commitment. Cancel anytime before Day 7.' : 'Billed monthly. Cancel anytime.';

  return (
    <div style={{ ...pwStyles.screen, ...(sheet ? pwStyles.screenSheet : null) }}>
      {sheet ? <div style={pwStyles.grabber} /> : null}
      {/* close */}
      <button onClick={onClose} style={pwStyles.close} aria-label="Dismiss">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      {/* brand pulse */}
      <PulseSignal />

      {/* main hook */}
      <h1 style={pwStyles.hook}>Access the Full Spectrum of Neural Architecture.</h1>

      {/* sub-headline */}
      <p style={pwStyles.dek}>
        Unlock all 21 sound-based frequencies, extended session lengths,
        and the full protocol library.
      </p>

      {/* tiers */}
      <div style={pwStyles.tiers}>
        <TierCard plan={plans.yearly} selected={selected === 'yearly'} onSelect={() => setSelected('yearly')} />
        <TierCard plan={plans.monthly} selected={selected === 'monthly'} onSelect={() => setSelected('monthly')} />
      </div>

      {/* primary action */}
      <button style={pwStyles.primary} onClick={() => onStart && onStart(selected)}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.985)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'none')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
        {cta}
      </button>
      <p style={pwStyles.micro}>{micro}</p>

      {/* Auto-renewable subscription disclosure (App Store Guideline 3.1.2) */}
      <p style={pwStyles.legal}>
        Payment is charged to your Apple ID at purchase confirmation. Subscriptions
        renew automatically unless turned off at least 24 hours before the period ends.
        Manage or cancel in your App Store account settings. Any unused portion of a
        free trial is forfeited when you buy a subscription.
      </p>

      {/* footer */}
      <div style={pwStyles.footer}>
        <a style={pwStyles.flink} href="#restore" onClick={(e) => { e.preventDefault(); onStart && onStart('restore'); }}>Restore Purchases</a>
        <span style={pwStyles.fdot}>•</span>
        <a style={pwStyles.flink} href="https://echo-11-site.vercel.app/terms" target="_blank" rel="noreferrer">Terms (EULA)</a>
        <span style={pwStyles.fdot}>•</span>
        <a style={pwStyles.flink} href="https://echo-11-site.vercel.app/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>
      </div>
    </div>
  );
}

const pwStyles = {
  screen: {
    position: 'relative',
    background: 'var(--obsidian)',
    borderRadius: 30,
    padding: '54px 28px 26px',
    border: '1px solid var(--line)',
    boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
    overflow: 'hidden',
    color: 'var(--ink)',
  },
  screenSheet: {
    borderRadius: '26px 26px 0 0',
    border: 'none',
    borderTop: '1px solid var(--line)',
    paddingTop: 40,
    width: '100%',
    maxHeight: '94%',
    overflowY: 'auto',
  },
  grabber: {
    position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
    width: 38, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.22)',
  },
  close: {
    position: 'absolute', top: 18, right: 18,
    width: 34, height: 34, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'transparent', border: 'none', cursor: 'pointer',
    color: 'var(--grey-2)', transition: 'color .2s',
  },

  // brand logo (|| over thin echo.11)
  logoWrap: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9, margin: '0 auto 28px' },
  logoMark: { display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6 },
  logoBar: { display: 'block', width: 2.5, height: 30, borderRadius: 2, background: 'var(--ink)' },
  logoText: { fontFamily: 'var(--sans)', fontWeight: 200, fontSize: 22, letterSpacing: '0.5px', color: 'var(--ink)' },

  hook: {
    fontFamily: 'var(--serif)', fontWeight: 500, fontSize: 38, lineHeight: 1.06,
    letterSpacing: '0.1px', textAlign: 'center', textWrap: 'balance',
    margin: '0 auto', maxWidth: '15ch',
  },
  dek: {
    fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.55, color: 'var(--grey-1)',
    textAlign: 'center', margin: '18px auto 0', maxWidth: '34ch', textWrap: 'pretty',
  },

  tiers: { display: 'flex', flexDirection: 'column', gap: 12, margin: '34px 0 0' },
  card: {
    position: 'relative', width: '100%', textAlign: 'left',
    background: 'var(--card)',
    borderWidth: '1px', borderStyle: 'solid', borderColor: 'var(--line)',
    borderRadius: 18,
    padding: '20px 20px', cursor: 'pointer',
    transition: 'border-color .25s, background .25s, box-shadow .25s',
  },
  cardHover: { borderColor: 'rgba(255,255,255,0.2)' },
  cardSel: {
    background: 'var(--card-sel)',
    borderColor: 'var(--signal)',
    boxShadow: '0 8px 30px rgba(130,169,255,0.10)',
  },
  cardRow: { display: 'flex', alignItems: 'center', gap: 15 },
  cardText: { flex: 1, minWidth: 0 },
  cardTitle: { fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 16, letterSpacing: '-0.1px' },
  cardPrice: { display: 'flex', alignItems: 'baseline', gap: 9, marginTop: 5 },
  priceMain: { fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--grey-1)' },
  priceSub: { fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--grey-2)', letterSpacing: '0.5px' },

  radio: {
    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
    border: '1.5px solid var(--grey-3)', display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all .2s',
  },
  radioOn: { background: 'var(--signal)', borderColor: 'var(--signal)' },

  badge: {
    position: 'absolute', top: -9, right: 16,
    fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 700, letterSpacing: '1.3px',
    color: '#0B0B0B', background: 'var(--signal)', borderRadius: 99, padding: '4px 10px',
  },

  primary: {
    width: '100%', marginTop: 26, border: 'none', cursor: 'pointer',
    background: 'var(--ink)', color: '#0B0B0B', borderRadius: 99,
    padding: '17px 20px', fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 15,
    letterSpacing: '0.1px', transition: 'transform .12s ease',
  },
  micro: { fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--grey-2)', textAlign: 'center', marginTop: 13 },
  legal: { fontFamily: 'var(--sans)', fontSize: 10.5, lineHeight: 1.5, color: 'var(--grey-2)', textAlign: 'center', margin: '16px auto 0', maxWidth: '38ch' },

  footer: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 24, flexWrap: 'wrap' },
  flink: { fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--grey-2)', textDecoration: 'none' },
  fdot: { color: 'var(--grey-3)', fontSize: 10 },
};

// keyframes (injected once)
(function injectPwKeyframes() {
  if (document.getElementById('pw-keyframes')) return;
  const s = document.createElement('style');
  s.id = 'pw-keyframes';
  s.textContent = `
    @keyframes pwPulse {
      0%   { transform: scale(0.35); opacity: 0.0; }
      30%  { opacity: 0.55; }
      100% { transform: scale(1.0); opacity: 0; }
    }
    @keyframes pwGlow {
      0%,100% { opacity: 0.55; transform: scale(0.9); }
      50%     { opacity: 1; transform: scale(1.1); }
    }
    a:hover { color: rgba(255,255,255,0.7) !important; }
  `;
  document.head.appendChild(s);
})();

window.Paywall = Paywall;
