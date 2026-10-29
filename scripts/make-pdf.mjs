// Renders both sheets (the ?print view) into public/RV32GC-Sliderules.pdf, A3 landscape, one sheet after the other.
// Run before `npm run build` whenever the instruction data or the layout change:  npm run pdf
// Uses the Chromium build of playwright-core (npx playwright-core install chromium if it is missing).
import { createServer } from 'vite';
import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../public/RV32GC-Sliderules.pdf', import.meta.url));
const MARGIN_MM = 8;
const A3_LANDSCAPE_PX = (420 - 2 * MARGIN_MM) * 96 / 25.4;

const server = await createServer({ root: fileURLToPath(new URL('..', import.meta.url)), server: { port: 0 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(`${server.resolvedUrls.local[0]}?print`, { waitUntil: 'networkidle' });
  await page.waitForSelector('#encoder tbody tr');
  // Both sheets at the same scale, the wider one filling the page width.
  const width = await page.evaluate(() => Math.max(...[...document.querySelectorAll('table.sliderule:not(.ghost)')].map((t) => t.offsetWidth)));
  const margin = `${MARGIN_MM}mm`;
  await page.pdf({ path: OUT, format: 'A3', landscape: true, printBackground: true, scale: Math.min(1, A3_LANDSCAPE_PX / width),
    margin: { top: margin, right: margin, bottom: margin, left: margin } });
  console.log(`${OUT} (sheet width ${width}px)`);
} finally {
  await browser.close();
  await server.close();
}
