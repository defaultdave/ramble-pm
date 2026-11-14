// U-129 measurement. Node ESM; needs playwright from a ramble checkout.
//
//   RAMBLE_DIR=<checkout> node measure.mjs <label> <origin> <homePath> <experiencePath> [--reps 5] [--throttle]
//
// Per device (phone 390x844 @3x, desktop 1440x900 @2x) and flow, a fresh browser context each rep:
//   cold        straight to the experience page, nothing cached
//   warm-hard   home page first, then a full navigation to the experience page
//   warm-click  home page first, then a click on the card (the real client-side navigation)
// Writes results/<label>.json. Screenshots with --shots (warm-click and cold, throttled).
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(process.env.RAMBLE_DIR, 'package.json'));
const { chromium } = require('@playwright/test');

const [label, origin, homePath, experiencePath, ...flags] = process.argv.slice(2);
const reps = Number(flags[flags.indexOf('--reps') + 1] || 5);
const throttle = flags.includes('--throttle');
const shots = flags.includes('--shots');

const devices = {
  phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true },
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 },
};
const flows = ['cold', 'warm-hard', 'warm-click'];

// Slower than the office wifi this runs on, so a request that is not cached takes visible time.
const slow = { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 };

const instrument = () => {
  const m = (window.__m = { clickAt: null, sharpAt: null, sharpLayer: null, sharpSrc: null, mainAt: null, opaqueAt: null, lcp: [], srcLog: [] });
  document.addEventListener('click', () => { m.clickAt ??= performance.now(); }, { capture: true });
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      m.lcp.push({ t: e.startTime, size: e.size, url: e.url, urlLen: e.url?.length ?? 0, tag: e.element?.tagName ?? null, alt: e.element?.getAttribute?.('alt') ?? null, loadTime: e.loadTime, renderTime: e.renderTime });
    }
  }).observe({ type: 'largest-contentful-paint', buffered: true });
  const frame = (now) => {
    const li = document.querySelector('ul[data-layout] > li');
    const layers = li ? [...li.querySelectorAll('img')] : [];
    const ready = (img) => img.complete && img.naturalWidth > 0;
    if (layers.length) {
      const srcs = layers.map((img) => img.currentSrc).join('|');
      const widths = layers.map((img) => new URL(img.currentSrc || 'http://x/?w=0').searchParams.get('w')).join('|');
      const done = layers.map((img) => img.complete && img.naturalWidth > 0).join('|');
      if (m.srcLog.at(-1)?.srcs !== widths || m.srcLog.at(-1)?.done !== done) m.srcLog.push({ t: Math.round(now), srcs: widths, done });
      const main = layers[layers.length - 1];
      if (m.sharpAt === null) {
        const i = layers.findIndex(ready);
        if (i >= 0) { m.sharpAt = now; m.sharpLayer = layers.length === 1 ? 'main' : i === layers.length - 1 ? 'main' : 'underlay'; m.sharpSrc = layers[i].currentSrc; }
      }
      if (m.mainAt === null && ready(main)) m.mainAt = now;
      if (m.opaqueAt === null && ready(main) && Number(getComputedStyle(main).opacity) > 0.99) m.opaqueAt = now;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
};

function watchNetwork(cdp) {
  const reqs = new Map();
  const state = { reqs, reset: () => reqs.clear() };
  cdp.on('Network.requestWillBeSent', (e) => {
    if (e.type === 'Image') reqs.set(e.requestId, { url: e.request.url, wall: e.wallTime, ts: e.timestamp, bytes: null, status: null, disk: false, memory: false, edge: null });
  });
  cdp.on('Network.responseReceived', (e) => {
    const r = reqs.get(e.requestId);
    if (!r) return;
    r.status = e.response.status;
    r.disk = !!e.response.fromDiskCache;
    r.edge = e.response.headers['x-vercel-cache'] ?? e.response.headers['x-nextjs-cache'] ?? null;
    r.type = e.response.mimeType;
  });
  cdp.on('Network.requestServedFromCache', (e) => { const r = reqs.get(e.requestId); if (r) r.memory = true; });
  cdp.on('Network.loadingFinished', (e) => { const r = reqs.get(e.requestId); if (r) r.bytes = e.encodedDataLength; });
  return state;
}

const widthOf = (url) => Number(new URL(url, 'http://x').searchParams.get('w')) || null;

async function runOne(browser, deviceName, flow, rep) {
  const context = await browser.newContext(devices[deviceName]);
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  const net = watchNetwork(cdp);
  await page.addInitScript(instrument);
  const experienceUrl = origin + experiencePath;

  if (flow !== 'cold') {
    await page.goto(origin + homePath, { waitUntil: 'load' });
    const link = page.locator(`a[href="${experiencePath}"]`).first();
    await link.scrollIntoViewIfNeeded();
    const card = page.locator(`article:has(a[href="${experiencePath}"]) img`).first();
    await card.evaluate((img) => (img.complete && img.naturalWidth > 0 ? null : new Promise((r) => img.addEventListener('load', r, { once: true }))));
    await page.waitForLoadState('networkidle');
    var cardSrc = await card.evaluate((img) => img.currentSrc);
    var cardBox = await card.evaluate((img) => { const r = img.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; });
    if (shots && flow === 'warm-click') await page.screenshot({ path: join(here, '..', 'shots', `${label}-${deviceName}-home.png`) });
  }
  if (throttle) await cdp.send('Network.emulateNetworkConditions', slow);
  net.reset();
  const t0 = Date.now();
  const homeEntryCount = await page.evaluate(() => performance.getEntriesByType('resource').length);

  if (flow === 'warm-click') await link_click(page, experiencePath);
  else await page.goto(experienceUrl, { waitUntil: 'commit' });

  const shot = async (name) => shots && page.screenshot({ path: join(here, '..', 'shots', `${label}-${deviceName}-${flow}-${name}.png`) });
  await page.waitForSelector('ul[data-layout] > li img', { timeout: 30000 });
  if (shots) { await page.waitForTimeout(120); await shot('midload'); }
  await page.waitForFunction(() => window.__m?.mainAt != null, null, { timeout: 60000 });
  await page.waitForTimeout(1500);
  if (shots) await shot('loaded');
  await page.waitForLoadState('networkidle');

  const data = await page.evaluate((homeEntryCount) => {
    const li = document.querySelector('ul[data-layout] > li');
    const layers = [...li.querySelectorAll('img')].map((img) => {
      const r = img.getBoundingClientRect();
      const s = getComputedStyle(img);
      return { alt: img.alt.slice(0, 20), currentSrc: img.currentSrc, natural: [img.naturalWidth, img.naturalHeight], box: [Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10, Math.round(r.left * 10) / 10, Math.round(r.top * 10) / 10], fit: s.objectFit, pos: s.objectPosition, opacity: s.opacity };
    });
    const res = performance.getEntriesByType('resource').slice(0).filter((e) => e.name.includes('/_next/image')).map((e) => ({ url: e.name, start: e.startTime, end: e.responseEnd, transfer: e.transferSize, enc: e.encodedBodySize, dec: e.decodedBodySize }));
    return { m: window.__m, layers, res, nav: performance.getEntriesByType('navigation')[0].toJSON() };
  }, homeEntryCount);
  await context.close();

  const m = data.m;
  const base = flow === 'warm-click' ? m.clickAt : 0;
  const lcp = m.lcp.at(-1) ?? null;
  const images = [...net.reqs.values()];
  const layerReqs = data.layers.map((l) => {
    const r = images.find((x) => new URL(x.url, origin).href === new URL(l.currentSrc).href);
    // No request at all for a URL the card already loaded in this same page: Blink's memory cache served it.
    const cacheHit = r ? (r.memory ? 'memory' : r.disk || r.bytes === 0 ? 'disk' : false) : l.currentSrc === cardSrc ? 'memory, no request' : false;
    return { ...l, requested: !!r, cacheHit, bytes: r?.bytes ?? null, edge: r?.edge ?? null };
  });
  return {
    device: deviceName, flow, rep, throttle,
    cardSrc: cardSrc ?? null, cardBox: cardBox ?? null,
    layers: layerReqs.map(({ alt, currentSrc, natural, box, fit, pos, requested, cacheHit, bytes, edge }) => ({ alt, w: widthOf(currentSrc), natural, box, fit, pos, requested, cacheHit, bytes, edge })),
    firstSharpMs: m.sharpAt === null ? null : Math.round(m.sharpAt - base),
    firstSharpLayer: m.sharpLayer,
    firstSharpW: m.sharpSrc ? widthOf(m.sharpSrc) : null,
    mainCompleteMs: m.mainAt === null ? null : Math.round(m.mainAt - base),
    mainOpaqueMs: m.opaqueAt === null ? null : Math.round(m.opaqueAt - base),
    lcp: flow === 'warm-click' ? null : lcp && { ms: Math.round(lcp.t), size: lcp.size, tag: lcp.tag, w: lcp.url ? widthOf(lcp.url) : null, url: lcp.url?.slice(-60) },
    srcLog: m.srcLog,
    lcpCandidates: flow === 'warm-click' ? null : m.lcp.map((e) => ({ ms: Math.round(e.t), size: e.size, tag: e.tag, w: e.url ? widthOf(e.url) : null, urlLen: e.urlLen })),
    imageRequests: images.map((r) => ({ w: widthOf(r.url), file: new URL(r.url, origin).searchParams.get('url')?.slice(-12), status: r.status, hit: r.disk || r.memory, disk: r.disk, memory: r.memory, bytes: r.bytes, edge: r.edge })),
    imageBytes: images.reduce((s, r) => s + (r.bytes ?? 0), 0),
    ttfbMs: Math.round(data.nav.responseStart),
    elapsedMs: Date.now() - t0,
  };
}

async function link_click(page, path) {
  await page.locator(`a[href="${path}"]`).first().click();
}

const browser = await chromium.launch();
const out = [];
// One throwaway pass per device so the server's own image cache is warm, as it is for every real visitor after the first.
for (const device of Object.keys(devices)) await runOne(browser, device, 'warm-hard', -1);
for (const device of Object.keys(devices)) {
  for (const flow of flows) {
    for (let rep = 0; rep < reps; rep++) {
      try { out.push(await runOne(browser, device, flow, rep)); } catch (e) { out.push({ device, flow, rep, error: String(e).slice(0, 300) }); }
    }
  }
}
await browser.close();
mkdirSync(join(here, '..', 'results'), { recursive: true });
mkdirSync(join(here, '..', 'shots'), { recursive: true });
writeFileSync(join(here, '..', 'results', `${label}.json`), JSON.stringify(out, null, 1));
console.log(`${label}: ${out.length} runs, ${out.filter((r) => r.error).length} errors`);
