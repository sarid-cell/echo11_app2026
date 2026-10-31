// Copy the minified stylesheets into index.html so first paint does not wait
// on two extra requests (PageSpeed "render-blocking requests").
// Each one replaces the body of <style data-inline="FILE">…</style>.
// Run by scripts/minify-css.sh; safe to re-run.
import { readFileSync, writeFileSync } from 'node:fs';

const page = 'index.html';
let html = readFileSync(page, 'utf8');

for (const file of ['echo11-app.css', 'echo11-web.css']) {
  const css = readFileSync(file, 'utf8').replace(/^\/\*.*?\*\/\n/, '').trim();
  if (css.includes('</style')) throw new Error(`${file} contains </style`);
  const block = new RegExp(`(<style data-inline="${file.replace('.', '\\.')}">)[\\s\\S]*?(</style>)`);
  if (!block.test(html)) throw new Error(`no <style data-inline="${file}"> in ${page}`);
  html = html.replace(block, (_, open, close) => open + css + close);
}

writeFileSync(page, html);
