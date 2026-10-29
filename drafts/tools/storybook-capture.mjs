// usage: node capture.mjs <storybook-static dir> <out dir> <suffix> <name=storyId@width@scheme> ...
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { createRequire } from 'node:module';

const [root, out, suffix, ...shots] = process.argv.slice(2);
const require = createRequire(join(process.env.PW_FROM, 'package.json'));
const { chromium } = require('@playwright/test');

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  try {
    const body = await readFile(join(root, path === '/' ? 'index.html' : path));
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();
for (const shot of shots) {
  const [name, spec] = shot.split('=');
  const [id, width, scheme] = spec.split('@');
  const page = await browser.newPage({ viewport: { width: Number(width), height: 900 }, colorScheme: scheme });
  await page.goto(`${base}/iframe.html?id=${id}&viewMode=story`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const file = join(out, `${name}-${width}-${scheme}-${suffix}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(file);
  await page.close();
}
await browser.close();
server.close();
