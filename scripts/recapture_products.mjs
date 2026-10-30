import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9252;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_p_' + Date.now());

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
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 3000));

  const scrollInfo = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const el = document.getElementById('products');
        if (el) {
          window.scrollTo({ top: el.offsetTop - 50, behavior: 'instant' });
          return { top: el.offsetTop, height: el.offsetHeight };
        }
        return null;
      })()
    `
  });
  console.log('Scroll info:', scrollInfo);
  await new Promise(r => setTimeout(r, 2000));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('C:\\Users\\Chitransh\\.gemini\\antigravity\\brain\\cd7f3ce9-e0c4-41d4-adc9-1e911349537d\\official_3d_products_desktop.png', Buffer.from(shot.data, 'base64'));

  chromeProc.kill();
  console.log('Saved official_3d_products_desktop.png successfully!');
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  chromeProc.kill();
  process.exit(1);
});

