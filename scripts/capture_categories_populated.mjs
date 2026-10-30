import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9270;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_catpop_' + Date.now());

const chromeProc = spawn(CHROME_PATH, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${tempProfile}`,
  'about:blank'
]);

async function run() {
  await new Promise(r => setTimeout(r, 1200));
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

  // 1. Desktop - 1440 x 1080 to show header + cards in one clean view
  console.log('Capturing Desktop Categories...');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1080, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 3000));

  await send('Runtime.evaluate', {
    expression: `
      if (window.__lenis) {
        window.__lenis.scrollTo('#categories', { immediate: true });
      } else {
        const el = document.getElementById('categories');
        if (el) el.scrollIntoView({ behavior: 'instant' });
      }
    `
  });
  await new Promise(r => setTimeout(r, 2000));

  let shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'categories_populated_desktop.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved categories_populated_desktop.png');

  // 2. Mobile 390 x 844
  console.log('Capturing Mobile 390px Categories...');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
  await new Promise(r => setTimeout(r, 1500));

  shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'categories_populated_mobile.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved categories_populated_mobile.png');

  chromeProc.kill();
  console.log('Finished!');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  chromeProc.kill();
  process.exit(1);
});

