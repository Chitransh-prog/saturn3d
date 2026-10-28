import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9223;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_profile_mobile_' + Date.now());

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

  await new Promise((resolve) => ws.onopen = resolve);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      const { resolve } = callbacks.get(data.id);
      callbacks.delete(data.id);
      resolve(data.result);
    }
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  // Bypass preloader and intro in sessionStorage
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      try {
        sessionStorage.setItem('saturn_preloader_seen', 'true');
        sessionStorage.setItem('saturn_hero_intro_seen', 'true');
      } catch (e) {}
    `
  });

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise((r) => setTimeout(r, 4500));

  // 1. Screenshot of Mobile Hero
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/mobile-hero.png', Buffer.from(shot1.data, 'base64'));
  console.log('Saved docs/mobile-hero.png');

  // 2. Scroll to #configurator (MakeItYours section)
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('configurator');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`
  });
  await new Promise((r) => setTimeout(r, 1500));

  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('docs/mobile-configurator.png', Buffer.from(shot2.data, 'base64'));
  console.log('Saved docs/mobile-configurator.png');

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  try { chromeProc.kill(); } catch (e) {}
  process.exit(1);
});

