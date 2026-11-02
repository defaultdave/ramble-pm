// Usage: node measure.cjs <label> <appDir> <port> <outDir> <runs>
// Starts `next start` fresh for each JS-off run, loads the pages with scripting off, counts cards.
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');
const { chromium } = require('/private/tmp/claude-501/u033/ramble/node_modules/@playwright/test');

const [label, appDir, portArg, outDir, runsArg] = process.argv.slice(2);
const port = Number(portArg);
const runs = Number(runsArg);
fs.mkdirSync(outDir, { recursive: true });

const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL,
  DATABASE_URL_UNPOOLED: process.env.DATABASE_URL,
  NEON_HTTP_ENDPOINT: process.env.NEON_HTTP_ENDPOINT,
};

const pages = [
  { name: 'browse', path: '/new-york/browse' },
  { name: 'landing', path: process.env.LANDING_PATH || '/new-york/neighborhoods/williamsburg' },
];

function startServer() {
  const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', String(port)], {
    cwd: appDir,
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.pid_ = child.pid;
  return new Promise((resolve, reject) => {
    let out = '';
    const t = setTimeout(() => reject(new Error('server start timeout: ' + out)), 30000);
    child.stdout.on('data', (d) => {
      out += d;
      if (out.includes('Ready')) {
        clearTimeout(t);
        resolve(child);
      }
    });
    child.stderr.on('data', (d) => (out += d));
  });
}

async function stopServer(child) {
  child.kill('SIGTERM');
  await new Promise((r) => child.once('exit', r));
}

async function launch() {
  return chromium.launch({
    chromiumSandbox: true,
    args: ['--single-process', '--no-zygote'],
  });
}

const jsOffProbe = () => {
  const cards = [...document.querySelectorAll('article')];
  const inHiddenSegment = cards.filter((c) => c.closest('div[hidden][id^="S:"]') && !c.closest('[data-reveal-without-script]')).length;
  const visible = cards.filter((c) => {
    if (!c.checkVisibility()) return false;
    const r = c.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }).length;
  const controls = [...document.querySelectorAll('button, a')].filter((e) => /^(Show more|Back to the first results)$/.test(e.textContent.trim()));
  const chips = [...document.querySelectorAll('a[href^="/new-york/browse?category="]')].filter((a) => a.closest('fieldset')?.querySelector('legend')?.textContent === 'Category');
  return {
    controlsInDom: controls.length,
    controlsVisible: controls.filter((e) => e.checkVisibility()).length,
    controlsStranded: controls.filter((e) => e.closest('div[hidden][id^="S:"]') && !e.closest('[data-reveal-without-script]')).length,
    categoryChipsInDom: chips.length,
    categoryChipsVisible: chips.filter((e) => e.checkVisibility()).length,
    inDom: cards.length,
    visible,
    strandedInHiddenSegment: inHiddenSegment,
    segments: document.querySelectorAll('div[hidden][id^="S:"]').length,
    skeletonVisible: [...document.querySelectorAll('[aria-busy="true"], [data-skeleton]')].filter((e) => e.checkVisibility()).length,
    docWidth: document.documentElement.scrollWidth,
    viewport: window.innerWidth,
  };
};

async function jsOffRun(run) {
  const server = await startServer();
  const result = { run, pages: {} };
  try {
    for (const pg of pages) {
      const browser = await launch();
      try {
        const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
        const page = await context.newPage();
        const response = await page.goto(`http://localhost:${port}${pg.path}`, { waitUntil: 'load' });
        const html = await response.text();
        const sent = (html.match(/<article/g) || []).length;
        const probe = await page.evaluate(jsOffProbe);
        // Raw HTML check: a card inside a hidden streamed segment, by walking the markup text.
        let hiddenRaw = 0;
        const segRe = /<div hidden id="S:\d+">/g;
        let m;
        while ((m = segRe.exec(html))) {
          const next = html.indexOf('<div hidden id="S:', m.index + 1);
          const slice = html.slice(m.index, next < 0 ? html.length : next);
          // a segment holds cards if an <article sits before the first </script>-free close of its own content
          if (!slice.includes('data-reveal-without-script')) hiddenRaw += (slice.match(/<article/g) || []).length;
        }
        const chipsSent = (html.match(/href="\/new-york\/browse\?category=[a-z-]+"/g) || []).length;
        const moreSent = (html.match(/>Show more<|>Back to the first results</g) || []).length;
        result.pages[pg.name] = { categoryChipsSentInHtml: chipsSent, controlsSentInHtml: moreSent, sentInHtml: sent, ...probe, articlesInHiddenSegmentsRaw: hiddenRaw, htmlBytes: html.length };
        if (run === 1) {
          await page.screenshot({ path: path.join(outDir, `${label}-${pg.name}-jsoff-1280-run1.png`), fullPage: true });
          fs.writeFileSync(path.join(outDir, `${label}-${pg.name}-run1.html`), html);
        }
      } finally {
        await browser.close();
      }
    }
  } finally {
    await stopServer(server);
  }
  return result;
}

async function sizes() {
  const server = await startServer();
  const out = {};
  try {
    for (const pg of pages) {
      const url = `http://localhost:${port}${pg.path}`;
      const res = await fetch(url);
      const html = await res.text();
      const scripts = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+\.js[^"]*)"/g)].map((x) => x[1]))];
      let raw = 0;
      let gz = 0;
      for (const s of scripts) {
        const buf = Buffer.from(await (await fetch(new URL(s, url))).arrayBuffer());
        raw += buf.length;
        gz += zlib.gzipSync(buf, { level: 9 }).length;
      }
      const flight = [...html.matchAll(/self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g)].reduce((n, x) => n + x[1].length, 0);
      const rscRes = await fetch(url, { headers: { RSC: '1' } });
      const rsc = Buffer.from(await rscRes.arrayBuffer());
      out[pg.name] = {
        scripts: scripts.length,
        jsRawBytes: raw,
        jsGzipBytes: gz,
        htmlBytes: Buffer.byteLength(html),
        htmlGzipBytes: zlib.gzipSync(html, { level: 9 }).length,
        inlineFlightChars: flight,
        rscRequestBytes: rsc.length,
        rscRequestGzipBytes: zlib.gzipSync(rsc, { level: 9 }).length,
      };
    }
  } finally {
    await stopServer(server);
  }
  return out;
}

async function jsOnRun() {
  const server = await startServer();
  const out = {};
  try {
    for (const pg of pages) {
      for (const [w, h] of [[320, 800], [390, 844], [768, 1024], [1280, 800]]) {
        const browser = await launch();
        try {
          const context = await browser.newContext({ viewport: { width: w, height: h } });
          const page = await context.newPage();
          const logs = [];
          page.on('console', (m) => ['warning', 'error'].includes(m.type()) && logs.push(`${m.type()}: ${m.text().slice(0, 300)}`));
          page.on('pageerror', (e) => logs.push('pageerror: ' + e.message.slice(0, 300)));
          await page.goto(`http://localhost:${port}${pg.path}`, { waitUntil: 'networkidle' });
          await page.waitForTimeout(500);
          await page.screenshot({ path: path.join(outDir, `${label}-${pg.name}-json-${w}.png`), fullPage: true });
          const geo = await page.evaluate(() => {
            const rects = (sel) => [...document.querySelectorAll(sel)].map((e) => {
              const r = e.getBoundingClientRect();
              return [Math.round(r.x * 10) / 10, Math.round((r.y + scrollY) * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10];
            });
            return {
              docWidth: document.documentElement.scrollWidth,
              docHeight: document.documentElement.scrollHeight,
              articles: rects('article'),
              h1: rects('h1'),
              h2: rects('h2'),
              images: rects('article img'),
              footer: rects('footer'),
              lis: rects('ul > li'),
              firstImgPriority: [...document.querySelectorAll('article img')].slice(0, 2).map((i) => [i.getAttribute('fetchpriority'), i.getAttribute('loading')]),
              preloads: [...document.querySelectorAll('link[rel="preload"][as="image"]')].map((l) => [l.getAttribute('fetchpriority'), (l.getAttribute('imagesrcset') || '').length]),
              hiddenSegments: document.querySelectorAll('div[hidden][id^="S:"]').length,
            };
          });
          out[`${pg.name}-${w}`] = { geo, logs };
        } finally {
          await browser.close();
        }
      }
    }
  } finally {
    await stopServer(server);
  }
  return out;
}

(async () => {
  const mode = process.env.MODE || 'all';
  const report = { label };
  if (mode === 'all' || mode === 'jsoff') {
    report.jsOff = [];
    for (let i = 1; i <= runs; i++) {
      const r = await jsOffRun(i);
      console.log(JSON.stringify(r));
      report.jsOff.push(r);
    }
  }
  if (mode === 'all' || mode === 'sizes') report.sizes = await sizes();
  if (mode === 'all' || mode === 'json') report.jsOn = await jsOnRun();
  fs.writeFileSync(path.join(outDir, `${label}-report.json`), JSON.stringify(report, null, 1));
  console.log('written');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
