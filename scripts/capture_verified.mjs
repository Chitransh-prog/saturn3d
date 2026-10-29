import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9230;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_profile_showcase6_' + Date.now());
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

  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `sessionStorage.setItem('saturn_preloader_seen', 'true');`
  });

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 960,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send('Page.navigate', { url: 'http://localhost:3000' });

  // Poll for #products
  console.log('Waiting for #products to mount in DOM...');
  for (let i = 0; i < 40; i++) {
    const res = await send('Runtime.evaluate', {
      expression: `Boolean(document.querySelector('#products'))`,
    });
    if (res.result?.value === true) {
      console.log('Found #products in DOM!');
      break;
    }
    await new Promise(r => setTimeout(r, 250));
  }

  // Scroll into view
  await send('Runtime.evaluate', {
    expression: `
      const el = document.querySelector('#products');
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    `,
  });
  await new Promise(r => setTimeout(r, 2500));

  const { data } = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'home_3d_products_verified.png'), Buffer.from(data, 'base64'));
  console.log('Saved home_3d_products_verified.png');

  ws.close();
  chromeProc.kill();
}

run().catch(err => {
  console.error(err);
  chromeProc.kill();
  process.exit(1);
});
