// ─────────────────────────────────────────────────────────────
// echo.11 · backend config  (Auth + Database only)
//
// Audio is generated 100% on-device (Web Audio synthesis) — there is NO audio
// storage and NO bucket. Supabase here is used only for user accounts (Auth)
// and user preferences (Database: favorites + listening history).
//
// Find these in: Supabase Dashboard → Project Settings → API
//   • Project URL   (e.g. https://abcdxyz.supabase.co)
//   • anon / publishable key  ← SAFE to ship in a client. NEVER the service_role key.
// ─────────────────────────────────────────────────────────────
window.ECHO_CONFIG = {
  // ── PASTE YOUR KEYS HERE ──────────────────────────────────
  // Project URL — the BASE url only (no /rest/v1/ at the end). If you paste the
  // long REST url by mistake, the app trims it automatically.
  url:     'https://hhzpuefkujevzflnoclb.supabase.co',
  // Publishable / anon key — safe to ship in a client. NEVER the service_role key.
  anonKey: 'sb_publishable_1_7-5kneJq_uZBsn0DQArQ_ACIrZUVa',
  // ──────────────────────────────────────────────────────────

  // OAuth redirect (web). On native this is your app scheme, e.g. echo11://auth
  redirectTo: undefined,
};
