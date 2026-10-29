import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9231;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_profile_merged_' + Date.now());
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

  // Skip preloader
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `sessionStorage.setItem('saturn_preloader_seen', 'true');`
  });

  // 1. Desktop Merged Navbar (1440x300 crop focusing on top nav)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 2500));

  let shot = await send('Page.captureScreenshot', { 
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 160, scale: 1 }
  });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'merged_navbar_desktop_top.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved merged_navbar_desktop_top.png');

  // 2. Desktop Scrolled to #hardware (Showing active orange pill on [Hardware Fleet])
  await send('Runtime.evaluate', {
    expression: `
      const el = document.querySelector('#hardware');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `,
  });
  await new Promise(r => setTimeout(r, 1500));

  shot = await send('Page.captureScreenshot', { 
    format: 'png',
    clip: { x: 0, y: 0, width: 1440, height: 160, scale: 1 }
  });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'merged_navbar_scrolled_hardware.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved merged_navbar_scrolled_hardware.png');

  // 3. Mobile Header (390x844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 2500));

  shot = await send('Page.captureScreenshot', { 
    format: 'png',
    clip: { x: 0, y: 0, width: 390, height: 140, scale: 1 }
  });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'merged_navbar_mobile.png'), Buffer.from(shot.data, 'base64'));
  console.log('Saved merged_navbar_mobile.png');

  ws.close();
  chromeProc.kill();
  console.log('Finished capturing all merged navbar screenshots!');
}

run().catch(err => {
  console.error(err);
  chromeProc.kill();
  process.exit(1);
});
