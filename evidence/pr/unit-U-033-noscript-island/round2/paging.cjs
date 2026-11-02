// Usage: node paging.cjs <label> <appDir> <port> <outDir> <page2Path|->
// JS off: load browse, click Show more, count cards on page 2, click Back to the first results.
// JS on: screenshots + rects of page 2 at four widths.
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('/private/tmp/claude-501/u033/ramble/node_modules/@playwright/test');
const [label, appDir, port, outDir, page2Arg] = process.argv.slice(2);
const launch = () => chromium.launch({ chromiumSandbox: true, args: ['--single-process', '--no-zygote'] });

(async () => {
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', port], {
    cwd: appDir,
    env: { ...process.env, DATABASE_URL_UNPOOLED: process.env.DATABASE_URL },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise((r) => server.stdout.on('data', (d) => String(d).includes('Ready') && r()));
  const out = {};
  try {
    const base = `http://localhost:${port}`;
    // JS off paging
    {
      const browser = await launch();
      const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
      const page = await context.newPage();
      await page.goto(`${base}/new-york/browse`);
      const hrefs1 = await page.$$eval('article a[href]', (as) => as.map((a) => a.getAttribute('href')).filter((h) => !h.startsWith('http')));
      const more = page.getByRole('button', { name: 'Show more' });
      out.showMoreVisibleOnFirstLoad = await more.isVisible();
      if (out.showMoreVisibleOnFirstLoad) {
        await more.click();
        await page.waitForLoadState('load');
      } else {
        await page.goto(`${base}${page2Arg}`);
      }
      out.page2Url = page.url().replace(base, '');
      const hrefs2 = await page.$$eval('article a[href]', (as) => as.map((a) => a.getAttribute('href')).filter((h) => !h.startsWith('http')));
      out.page2Cards = await page.locator('article').evaluateAll((els) => els.filter((e) => e.checkVisibility()).length);
      out.page2Overlap = hrefs2.filter((h) => hrefs1.includes(h)).length;
      const back = page.getByRole('link', { name: 'Back to the first results' });
      out.backVisibleOnPage2 = await back.isVisible();
      out.showMoreVisibleOnPage2 = await page.getByRole('button', { name: 'Show more' }).isVisible();
      await page.screenshot({ path: path.join(outDir, `${label}-browse-page2-jsoff-1280.png`), fullPage: true });
      if (out.backVisibleOnPage2) {
        await back.click();
        await page.waitForLoadState('load');
        out.afterBackUrl = page.url().replace(base, '');
        out.afterBackCards = await page.locator('article').evaluateAll((els) => els.filter((e) => e.checkVisibility()).length);
      }
      await browser.close();
    }
    const page2 = page2Arg === '-' ? out.page2Url : page2Arg;
    out.jsOnPage2 = {};
    for (const [w, h] of [[320, 800], [390, 844], [768, 1024], [1280, 800]]) {
      const browser = await launch();
      const context = await browser.newContext({ viewport: { width: w, height: h } });
      const page = await context.newPage();
      const logs = [];
      page.on('console', (m) => ['warning', 'error'].includes(m.type()) && logs.push(m.text().slice(0, 120)));
      await page.goto(`${base}${page2}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(outDir, `${label}-browse-page2-json-${w}.png`), fullPage: true });
      const rects = await page.evaluate(() =>
        [...document.querySelectorAll('article, form[action="/new-york/browse"] button, a')].filter((e) => /Show more|Back to the first/.test(e.textContent) || e.tagName === 'ARTICLE').map((e) => {
          const r = e.getBoundingClientRect();
          return [e.tagName, Math.round(r.x * 10) / 10, Math.round((r.y + scrollY) * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10];
        }),
      );
      out.jsOnPage2[w] = { rects, logs: [...new Set(logs)] };
      await browser.close();
    }
  } finally {
    server.kill('SIGTERM');
  }
  fs.writeFileSync(path.join(outDir, `${label}-paging.json`), JSON.stringify(out, null, 1));
  console.log(JSON.stringify({ ...out, jsOnPage2: Object.keys(out.jsOnPage2) }));
})();
