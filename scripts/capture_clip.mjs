import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9274;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_clip_' + Date.now());

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
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false });

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 3500));

  const bounds = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const el = document.getElementById('categories');
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return {
          x: rect.x + window.scrollX,
          y: rect.y + window.scrollY,
          width: rect.width,
          height: rect.height
        };
      })()
    `
  });
  console.log('Categories bounds:', bounds);

  if (bounds.result.value) {
    const { x, y, width, height } = bounds.result.value;
    const clipHeight = Math.min(height, 1200);
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x, y, width, height: clipHeight, scale: 1 },
      captureBeyondViewport: true
    });
    fs.writeFileSync('C:\\Users\\Chitransh\\.gemini\\antigravity\\brain\\cd7f3ce9-e0c4-41d4-adc9-1e911349537d\\categories_populated_desktop.png', Buffer.from(shot.data, 'base64'));
    console.log('Successfully captured clipped element screenshot of categories!');
  }

  chromeProc.kill();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  chromeProc.kill();
  process.exit(1);
});

