# echo.|| — Legal & Web Pages

Static, dependency-free pages for the echo.|| marketing/legal site. Built to be
served at the exact clean URLs the app links to:

| Page              | URL          | File             |
|-------------------|--------------|------------------|
| Privacy Policy    | `/privacy`   | `privacy.html`   |
| Terms of Use/EULA | `/terms`     | `terms.html`     |
| Medical Disclaimer| `/disclaimer`| `disclaimer.html`|

`legal.css` is the shared stylesheet (Premium Editorial — Cloud Dancer / Obsidian).

## Deploy to Vercel

**Option A — drag & drop:** zip this folder and drop it on vercel.com/new.

**Option B — GitHub (recommended):**
1. Commit this folder to a repo (it can be the root, or a `/public` / `/site` dir).
2. Import the repo at vercel.com/new.
3. Framework preset: **Other**. No build command. Output dir: this folder.
4. `vercel.json` enables **clean URLs**, so `privacy.html` is served at `/privacy`.

> If these pages live alongside your existing `echo-11-site` deployment, just copy
> `privacy.html`, `terms.html`, `disclaimer.html`, and `legal.css` into that
> project's static/public root and keep (or merge) `vercel.json`. The app already
> points at `https://echo-11-site.vercel.app/{terms,privacy,disclaimer}`.

## Before you publish
The documents are **drafts** — search for `[Replace ...]` / `[Confirm ...]` notes,
fill in your legal entity + jurisdiction, and have counsel review.
