// Usage: node css-dead.cjs <appDir> <port>  — JS off, counts visible cards and the Show more button, with and without the reveal rule.
const { spawn } = require('node:child_process');
const { chromium } = require('/private/tmp/claude-501/u033/ramble/node_modules/@playwright/test');
const [appDir, port] = process.argv.slice(2);
(async () => {
  const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--port', port], {
    cwd: appDir,
    env: { ...process.env, DATABASE_URL_UNPOOLED: process.env.DATABASE_URL },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise((r) => server.stdout.on('data', (d) => String(d).includes('Ready') && r()));
  try {
    for (const neutralise of [false, true]) {
      for (const p of ['/new-york/browse', '/new-york/neighborhoods/williamsburg']) {
        const browser = await chromium.launch({ chromiumSandbox: true, args: ['--single-process', '--no-zygote'] });
        const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
        const page = await context.newPage();
        if (neutralise) {
          await page.route('**/new-york/**', async (route) => {
            const response = await route.fetch();
            const body = (await response.text()).replace(
              '</head>',
              '<style>body > div[hidden] { display: none !important } [data-reveal-without-script] { display: contents !important }</style></head>',
            );
            await route.fulfill({ response, body });
          });
        }
        await page.goto(`http://localhost:${port}${p}`);
        const r = await page.evaluate(() => ({
          visibleCards: [...document.querySelectorAll('article')].filter((c) => c.checkVisibility()).length,
          showMoreVisible: [...document.querySelectorAll('button')].filter((b) => /Show more/.test(b.textContent) && b.checkVisibility()).length,
          showMoreInDom: [...document.querySelectorAll('button')].filter((b) => /Show more/.test(b.textContent)).length,
        }));
        console.log(JSON.stringify({ revealRuleRemoved: neutralise, page: p, ...r }));
        await browser.close();
      }
    }
  } finally {
    server.kill('SIGTERM');
  }
})();
