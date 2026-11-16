/* echo·11 — service worker: lets the app open and play without a network.

   The tones are generated in the browser (Web Audio), so once the page, its
   CSS/JS and fonts are on the device, the whole listening experience works
   offline. This file does not need editing on each deploy:

   - Pages (navigations): network first, so a new deploy shows up right away;
     the cached copy is used only when the network fails.
   - Same-origin files: versioned URLs (?v=<hash>) are immutable, so a cached
     copy is served as-is; when a new hash arrives, older copies of the same
     file are dropped. Offline, a missing version falls back to any cached
     version of that file.
   - Fonts (jsdelivr @fontsource, Google Fonts): cached on first use.
   - Not intercepted: /api/*, analytics, video/PDF (range requests), POSTs. */

const CACHE = 'echo11-v1';
const SHELL = '/';
const FONT_HOSTS = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];
const SKIP_EXT = /\.(mp4|webm|mov|pdf)$/i;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const res = await fetch(SHELL, { cache: 'reload' });
    if (!res.ok) throw new Error('shell ' + res.status);
    await cache.put(SHELL, res.clone());
    // Precache the CSS, JS, manifest and icons the page links (not images:
    // srcset lists several sizes and only the one the screen uses is needed).
    const html = await res.text();
    const urls = new Set();
    const re = /(?:href|src)="(\/?[\w./-]+\.(?:css|js|webmanifest|png|ico)(?:\?v=[0-9a-f]+)?)"/g;
    let m;
    while ((m = re.exec(html))) {
      const u = new URL(m[1], self.location.origin);
      if (u.origin === self.location.origin && !u.pathname.startsWith('/img/')) urls.add(u.href);
    }
    await Promise.all([...urls].map((u) => addOne(cache, u)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k.startsWith('echo11-') && k !== CACHE).map((k) => caches.delete(k)));
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

// The page sends the files it loaded before this worker took control.
self.addEventListener('message', (event) => {
  const d = event.data;
  if (!d || d.type !== 'warm' || !Array.isArray(d.urls)) return;
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const href of d.urls.slice(0, 200)) {
      let u;
      try { u = new URL(href); } catch (e) { continue; }
      if (!cacheable(u)) continue;
      if (await cache.match(u.href)) continue;
      await addOne(cache, u.href);
    }
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);

  if (req.mode === 'navigate' && url.origin === self.location.origin) {
    event.respondWith(page(event, url));
    return;
  }
  if (!cacheable(url)) return;
  event.respondWith(asset(req, url));
});

function cacheable(url) {
  if (url.origin === self.location.origin) {
    if (url.pathname.startsWith('/api/') || url.pathname === '/sw.js') return false;
    return !SKIP_EXT.test(url.pathname);
  }
  return FONT_HOSTS.includes(url.hostname) &&
    (url.hostname !== 'cdn.jsdelivr.net' || url.pathname.startsWith('/npm/@fontsource'));
}

async function page(event, url) {
  const cache = await caches.open(CACHE);
  try {
    const res = (await event.preloadResponse) || (await fetch(event.request));
    if (res.ok) {
      // "/" with any query (utm, ?paywall=…) is the same app shell.
      const key = url.pathname === '/' || url.pathname === '/index.html' ? SHELL : url.pathname;
      cache.put(key, res.clone());
    }
    return res;
  } catch (err) {
    return (await cache.match(url.pathname)) || (await cache.match(SHELL)) || Response.error();
  }
}

async function asset(req, url) {
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  const versioned = url.searchParams.has('v') || url.hostname !== self.location.hostname;
  if (hit && versioned) return hit;

  const net = fetch(req).then(async (res) => {
    if (res.ok || res.type === 'opaque') {
      await cache.put(req, res.clone());
      if (url.origin === self.location.origin) await prune(cache, url);
    }
    return res;
  });

  if (hit) { // unversioned same-origin file: answer now, refresh behind
    net.catch(() => {});
    return hit;
  }
  try {
    return await net;
  } catch (err) {
    const any = url.origin === self.location.origin && (await cache.match(req, { ignoreSearch: true }));
    return any || Response.error();
  }
}

async function addOne(cache, href) {
  try {
    const u = new URL(href);
    // Font hosts send CORS headers; a CORS copy also serves the page's
    // no-cors <link> requests, while an opaque copy would break @font-face.
    const res = await fetch(href, u.origin === self.location.origin ? {} : { mode: 'cors' });
    if (res.ok || res.type === 'opaque') {
      await cache.put(href, res);
      if (u.origin === self.location.origin) await prune(cache, u);
    }
  } catch (e) { /* offline or blocked — fine, it gets cached on next use */ }
}

// Keep only the newest version of a file: drop same path, different ?v=.
async function prune(cache, url) {
  const base = url.origin + url.pathname;
  const keys = await cache.keys(base, { ignoreSearch: true });
  await Promise.all(keys.filter((k) => k.url !== url.href).map((k) => cache.delete(k)));
}
