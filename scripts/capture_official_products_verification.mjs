import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9245;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_profile_verif_' + Date.now());

const chromeProc = spawn(CHROME_PATH, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${tempProfile}`,
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
  await send('DOM.enable');
  await send('Runtime.enable');

  const artifactDir = "C:\\Users\\Chitransh\\.gemini\\antigravity\\brain\\cd7f3ce9-e0c4-41d4-adc9-1e911349537d";

  // 1. Desktop - 3D Products Workstation
  console.log('1. Capturing Desktop 3D Products Workstation...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Page.navigate', { url: 'http://localhost:3000/#products' });
  await new Promise(r => setTimeout(r, 4000));

  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 2000));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'official_3d_products_desktop.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved official_3d_products_desktop.png');

  // 2. Desktop - Our Categories (Solutions at Scale)
  console.log('2. Capturing Desktop Categories Section...');
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('categories');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise(r => setTimeout(r, 2000));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'official_categories_8sectors_desktop.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved official_categories_8sectors_desktop.png');

  // 3. Desktop - Product Detail Page with 3D Viewer (/product/1)
  console.log('3. Capturing Product Detail Page (/product/1)...');
  await send('Page.navigate', { url: 'http://localhost:3000/product/1' });
  await new Promise(r => setTimeout(r, 3500));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'product_1_detail_vase_3d.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved product_1_detail_vase_3d.png');

  // 4. Mobile 390px - Products & Categories
  console.log('4. Capturing Mobile 390px...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Page.navigate', { url: 'http://localhost:3000/#categories' });
  await new Promise(r => setTimeout(r, 3500));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'mobile_390_categories.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved mobile_390_categories.png');

  chromeProc.kill();
  console.log('Finished capturing all verification screenshots!');
  process.exit(0);
}

run().catch((err) => {
  console.error('CDP capture error:', err);
  chromeProc.kill();
  process.exit(1);
});

