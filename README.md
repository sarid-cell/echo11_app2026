# echo.|| — Frequency Wellness App

echo.|| (echo11) is a frequency/binaural-beats wellness app — a React SPA (JSX
transformed in-browser via Babel, no build step) that plays focus, sleep,
healing, and abundance audio frequencies, with Supabase for auth and
entitlements.

Live at [echo11.space](https://www.echo11.space/).

## Running locally

There is no build step — the app loads React, ReactDOM, and Babel from CDN
and transforms JSX in the browser. Serve the repo root with any static file
server and open `/echo11-app.html` (routing matches `vercel.json`):

```bash
npx serve .
```

## Project structure

- `echo11-app.html` — app entry point, loads modules from `project/` in order
- `project/echo-*.jsx` — app screens/components (data, UI, home, player, paywall, settings, Supabase integration)
- `project/echo-*.css` — styles
- `project/echo-config.js` — Supabase URL/anon key (see `project/SUPABASE_SETUP.md`)
- `project/img/`, `project/media/` — image and audio assets
- `project/legal/` — privacy, terms, disclaimer pages (routed via `vercel.json`)
- `project/supabase/` — database schema
- `vercel.json` — routing for the deployed site

## Deployment

Deployed on Vercel. `vercel.json` routes `/` to `echo11-app.html` and the
legal pages to `project/legal/`.

**Note:** the site currently ships `robots.txt` (disallow all) and
`noindex` meta tags while the app is still being finished, to keep it out
of Google search results. Remove these once the app is ready to be
discovered publicly.

## Background

This repo originated as a design handoff from Claude Design
(claude.ai/design) — see `chats/` for the original design conversations if
you need context on past design decisions.
