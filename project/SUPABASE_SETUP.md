# echo.11 — Supabase Setup (go live in ~15 min)

The app already runs on **on-device synthesis** — it plays sound with no backend.
Follow these steps to connect your Supabase, stream real audio files, and enable
accounts. **You provide two values; nothing else changes in the code.**

---

## What I need from you
From **Supabase Dashboard → Project Settings → API**:
1. **Project URL** — e.g. `https://abcdxyz.supabase.co`
2. **anon public key** — the long `eyJ...` key labelled *anon / public*

> ⚠️ Never share or commit the **service_role** key. The app only ever uses the
> anon key, which is safe in a client.

Paste both into **`echo-config.js`**:
```js
window.ECHO_CONFIG = {
  url:     'https://abcdxyz.supabase.co',
  anonKey: 'eyJhbGci...your-anon-key...',
  publicBucket: false,
  redirectTo: undefined,
};
```

---

## Steps

### 1. Create the database
Supabase Dashboard → **SQL Editor** → New query → paste all of
**`supabase/schema.sql`** → **Run**. This creates:
- `frequencies` (the catalog), `profiles` (entitlement), `sessions` (streaks)
- the `frequencies` Storage bucket (private)
- Row-Level Security policies + an auto-profile trigger on signup

### 2. Seed the catalog (optional)
The app falls back to the built-in 21 frequencies, but to drive them from the DB,
insert rows into `frequencies` (id, name, hz, c_l, c_r, type, premium, audio_path…).
Ask me and I'll generate the `INSERT` statements from the current catalog.

### 3. Upload audio (optional)
Storage → `frequencies` bucket → upload files named to match each row's
`audio_path` (e.g. `hz528.mp3`). **No files? No problem** — the app synthesizes
that frequency instead. You can stream some and synthesize the rest.

### 4. Turn on auth providers
Authentication → **Providers**: enable **Apple**, **Google**, **Email** (magic
link), and **Anonymous**. The splash sign-in buttons are already wired to these.

### 5. Add your keys
Fill in `echo-config.js` (above). Reload — the app now reads the catalog from your
DB, streams uploaded audio, and signs users in. `EchoBackend.configured` flips to
`true` automatically.

---

## How the audio engine decides (in `echo-supabase.jsx`)
```
play(freq):
  url = resolveAudioUrl(freq)        // signed URL from Storage, if a file exists
  if url:  stream it (loops, background-friendly)
  else:    synthesize the tone on-device  ← same engine as the web app / Expo
```
This means **the same code path works before and after** you upload files — the
engine is real today, and gains streaming the moment your bucket has audio.

---

## Native (Expo) note
The web app uses `HTMLAudioElement` + Web Audio. The Expo app uses the
`ToneEngine.js` already in `echo11-expo/` (PCM synthesis + `expo-av` background
audio). Point its Supabase client at the **same** project — one backend, two
clients. The `@supabase/supabase-js` package works in Expo too; reuse this schema.
