import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9260;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_profile_cat_' + Date.now());
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
  await send('DOM.enable');
  await send('Runtime.enable');

  // Skip preloader
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      sessionStorage.setItem('saturn_preloader_seen', 'true');
      localStorage.setItem('saturn_intro_seen', 'true');
    `
  });

  // 1. Desktop Viewport 1440x1200
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:3000/ ...');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise((r) => setTimeout(r, 3500));

  // Scroll directly to #categories element
  console.log('Scrolling directly to #categories...');
  const scrollResult = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('categories');
        if (!el) return 'NOT_FOUND';
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.pageYOffset - 80;
        if (window.__lenis) {
          window.__lenis.scrollTo(top, { immediate: true });
        }
        window.scrollTo(0, top);
        return { top, rectTop: rect.top, height: rect.height };
      })()
    `,
    returnByValue: true
  });
  console.log('Scroll result:', scrollResult.result?.value);
  await new Promise((r) => setTimeout(r, 2000));

  const desktopShot = await send('Page.captureScreenshot', { format: 'png' });
  const desktopPath = path.join(ARTIFACT_DIR, 'categories_cards_uncut_desktop.png');
  fs.writeFileSync(desktopPath, Buffer.from(desktopShot.data, 'base64'));
  console.log(`Saved: ${desktopPath}`);

  // 2. Mobile Viewport (390x844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise((r) => setTimeout(r, 1000));

  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('categories');
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.pageYOffset - 60;
        if (window.__lenis) {
          window.__lenis.scrollTo(top, { immediate: true });
        }
        window.scrollTo(0, top);
      })()
    `
  });
  await new Promise((r) => setTimeout(r, 2000));

  const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
  const mobilePath = path.join(ARTIFACT_DIR, 'categories_cards_uncut_mobile.png');
  fs.writeFileSync(mobilePath, Buffer.from(mobileShot.data, 'base64'));
  console.log(`Saved: ${mobilePath}`);

  ws.close();
  chromeProc.kill();
  console.log('✅ Done capturing uncut category cards!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Error during capture:', err);
  try { chromeProc.kill(); } catch (e) {}
  process.exit(1);
});
