// echo.|| — Settings sub-screen (Task 4)
// Replaces the floating Tweaks dev panel with a native in-app Settings surface:
// Appearance controls (accent · theme · typeface · text size · density) +
// Account Info. State persists to localStorage (no host/Tweaks dependency).

const SETTINGS_DEFAULTS = { accent: '#82A9FF', theme: 'light', fontScale: 100, density: 'regular', typeface: 'brand' };

// Single source of truth for appearance — mirrors the old useTweaks shape
// ([values, set(key,val)]) so App's root styling code is unchanged.
function useSettings() {
  const [s, setS] = React.useState(() => {
    try { return { ...SETTINGS_DEFAULTS, ...(JSON.parse(localStorage.getItem('echo:settings') || '{}')) }; }
    catch (e) { return { ...SETTINGS_DEFAULTS }; }
  });
  const setSetting = React.useCallback((k, v) => {
    setS(prev => {
      const next = { ...prev, [k]: v };
      try { localStorage.setItem('echo:settings', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }, []);
  return [s, setSetting];
}

const TYPEFACES = [
  { id: 'brand', label: 'Geist' },
  { id: 'apple', label: 'Apple' },
  { id: 'original', label: 'Editorial' },
];
const METHOD_LABEL = { apple: 'Apple', google: 'Google', email: 'Email', guest: 'Guest' };

// Full-width segmented control.
function Seg({ value, options, onChange, ariaLabel }) {
  return (
    <div className="seg" role="group" aria-label={ariaLabel}>
      {options.map(o => (
        <button key={o.id} className={'seg-btn' + (value === o.id ? ' on' : '')} aria-pressed={value === o.id} onClick={() => onChange(o.id)}>{o.label}</button>
      ))}
    </div>
  );
}

function SettingsScreen({ t, setTweak, accents = [], method, unlocked, onUnlock, onLogout, onBack }) {
  const clampFont = (v) => Math.max(88, Math.min(118, v));
  const isGuest = !method || method === 'guest';
  return (
    <div className="settings-screen">
      <div className="settings-head">
        <button className="lib-back" onClick={onBack} aria-label="Back to About"><Icon name="back" size={15} /> About</button>
        <h1 className="settings-title">Settings</h1>
      </div>

      <div className="settings-body">
        {/* ── Account ── */}
        <div className="set-group">
          <div className="kicker">Account</div>
          <div className="set-card">
            <div className="set-row">
              <div className="set-row-l">
                <div className="set-label">Signed in with</div>
                <div className="set-sub">{isGuest ? 'Guest session · saved on this device' : 'Cross-device sync enabled'}</div>
              </div>
              <span className="set-value">{METHOD_LABEL[method] || 'Guest'}</span>
            </div>
            <div className="set-row">
              <div className="set-row-l">
                <div className="set-label">Membership</div>
                <div className="set-sub">{unlocked ? 'All 21 frequencies unlocked' : 'Free · core frequencies'}</div>
              </div>
              {unlocked
                ? <span className="set-value" style={{ color: 'var(--accent-strong)' }}>Premium</span>
                : <button className="set-mini-btn" onClick={onUnlock} aria-label="Upgrade to premium">Upgrade</button>}
            </div>
          </div>
        </div>

        {/* ── Appearance ── */}
        <div className="set-group">
          <div className="kicker">Appearance</div>
          <div className="set-card">
            <div className="set-row">
              <div className="set-label">Accent</div>
              <div className="swatches">
                {accents.map(c => (
                  <button key={c} className={'swatch' + (t.accent === c ? ' on' : '')} style={{ background: c }} onClick={() => setTweak('accent', c)} aria-label={`Accent colour ${c}`} aria-pressed={t.accent === c} />
                ))}
              </div>
            </div>
            <div className="set-stack">
              <div className="set-label">Theme</div>
              <Seg ariaLabel="Theme" value={t.theme} onChange={(v) => setTweak('theme', v)} options={[{ id: 'dark', label: 'Dark' }, { id: 'light', label: 'Light' }]} />
            </div>
            <div className="set-stack">
              <div className="set-label">Typeface</div>
              <Seg ariaLabel="Typeface" value={t.typeface} onChange={(v) => setTweak('typeface', v)} options={TYPEFACES} />
            </div>
            <div className="set-row">
              <div className="set-label">Text size</div>
              <div className="stepper">
                <button onClick={() => setTweak('fontScale', clampFont(t.fontScale - 2))} aria-label="Decrease text size" disabled={t.fontScale <= 88}>A−</button>
                <span className="val">{t.fontScale}%</span>
                <button onClick={() => setTweak('fontScale', clampFont(t.fontScale + 2))} aria-label="Increase text size" disabled={t.fontScale >= 118}>A+</button>
              </div>
            </div>
            <div className="set-stack">
              <div className="set-label">Density</div>
              <Seg ariaLabel="Density" value={t.density} onChange={(v) => setTweak('density', v)} options={[{ id: 'compact', label: 'Compact' }, { id: 'regular', label: 'Regular' }, { id: 'comfy', label: 'Comfy' }]} />
            </div>
          </div>
          <p className="set-foot-note">Appearance changes apply instantly and are saved on this device.</p>
        </div>

        {/* ── Sign out ── */}
        <div className="set-group">
          <button className="btn ghost logout-btn" onClick={onLogout} aria-label="Log out of your account">Log Out</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { useSettings, SettingsScreen, SETTINGS_DEFAULTS });
