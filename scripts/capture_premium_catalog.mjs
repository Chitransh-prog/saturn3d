import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9282;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_catprem_' + Date.now());

const chromeProc = spawn(CHROME_PATH, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${tempProfile}`,
  'about:blank'
]);

async function waitForCdp() {
  for (let i = 0; i < 40; i++) {
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
  await send('Runtime.enable');

  const artifactDir = "C:\\Users\\Chitransh\\.gemini\\antigravity\\brain\\cd7f3ce9-e0c4-41d4-adc9-1e911349537d";

  // 1. Desktop - 1440 x 950 Top View
  console.log('1. Capturing Desktop Catalog Header & Cards...');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 950, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:3000/categories' });
  await new Promise(r => setTimeout(r, 3500));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'catalog_premium_desktop_top.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved catalog_premium_desktop_top.png');

  // 2. Desktop - Scrolled down to see cards in detail
  console.log('2. Capturing Scrolled Cards...');
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo(0, 500);'
  });
  await new Promise(r => setTimeout(r, 1200));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'catalog_premium_desktop_cards.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved catalog_premium_desktop_cards.png');

  // 3. Desktop - Scrolled to CTA & Footer
  console.log('3. Capturing Scrolled CTA...');
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo(0, 1800);'
  });
  await new Promise(r => setTimeout(r, 1500));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'catalog_premium_desktop_cta.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved catalog_premium_desktop_cta.png');

  // 4. Mobile 390 x 844
  console.log('4. Capturing Mobile 390px Catalog...');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url: 'http://localhost:3000/categories' });
  await new Promise(r => setTimeout(r, 3000));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'catalog_premium_mobile_390.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved catalog_premium_mobile_390.png');

  chromeProc.kill();
  console.log('Finished capturing all verification shots!');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  chromeProc.kill();
  process.exit(1);
});
