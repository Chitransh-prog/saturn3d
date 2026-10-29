import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9225;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_profile_showcase_' + Date.now());
const ARTIFACT_DIR = 'C:/Users/Chitransh/.gemini/antigravity/brain/cd7f3ce9-e0c4-41d4-adc9-1e911349537d';

const chromeProc = spawn(CHROME_PATH, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${tempProfile}`,
  '--use-gl=angle',
  '--use-angle=d3d11',
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank'
]);

async function waitForCdp() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return await res.json();
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('Chrome CDP did not start in time');
}

async function run() {
  await waitForCdp();
  console.log('Connected to Chrome');

  const listRes = await fetch(`http://127.0.0.1:${PORT}/json`);
  const targets = await listRes.json();
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let id = 1;
  const callbacks = new Map();
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      const { resolve, reject } = callbacks.get(data.id);
      callbacks.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  // Helper to set viewport & capture
  async function capturePage(url, filename, width = 1440, height = 900, scrollSelector = null, delay = 2500) {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });

    console.log(`Navigating to ${url}...`);
    await send('Page.navigate', { url });
    await new Promise(r => setTimeout(r, delay));

    if (scrollSelector) {
      await send('Runtime.evaluate', {
        expression: `
          const el = document.querySelector('${scrollSelector}');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        `,
      });
      await new Promise(r => setTimeout(r, 1200));
    }

    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(outPath, Buffer.from(data, 'base64'));
    console.log(`Saved screenshot: ${filename}`);
  }

  // 1. Home page scrolled to 3D products section
  await capturePage('http://localhost:3000', 'home_3d_products_station.png', 1440, 900, '#products', 3000);

  // 2. Product Detail 1 (Turbine Impeller)
  await capturePage('http://localhost:3000/product/1', 'product_1_detail_3d.png', 1440, 900, null, 2500);

  // 3. Product Detail 2 (Drone Spar)
  await capturePage('http://localhost:3000/product/2', 'product_2_detail_3d.png', 1440, 900, null, 2500);

  // 4. Mobile 390px 3D products section
  await capturePage('http://localhost:3000', 'mobile_390_products_station.png', 390, 844, '#products', 3000);

  ws.close();
  chromeProc.kill();
  console.log('All screenshots completed successfully!');
}

run().catch(err => {
  console.error(err);
  chromeProc.kill();
  process.exit(1);
});

