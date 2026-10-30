import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9246;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_profile_seo_' + Date.now());
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

  // Set desktop viewport 1440x900
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  console.log('Navigating to http://localhost:3000/ ...');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise((r) => setTimeout(r, 4000));

  // 1. Capture Hero Section
  console.log('Capturing Hero Section...');
  const heroShot = await send('Page.captureScreenshot', { format: 'png' });
  const heroPath = path.join(ARTIFACT_DIR, 'hero_indore_bhopal.png');
  fs.writeFileSync(heroPath, Buffer.from(heroShot.data, 'base64'));
  console.log(`Saved: ${heroPath}`);

  // 2. Scroll to FAQ Section
  console.log('Navigating & scrolling to FAQ Section...');
  await send('Runtime.evaluate', {
    expression: `
      const el = document.getElementById('faq');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    `
  });
  await new Promise((r) => setTimeout(r, 2000));

  const faqShot = await send('Page.captureScreenshot', { format: 'png' });
  const faqPath = path.join(ARTIFACT_DIR, 'faq_indore_bhopal.png');
  fs.writeFileSync(faqPath, Buffer.from(faqShot.data, 'base64'));
  console.log(`Saved: ${faqPath}`);

  // 3. Scroll to Footer Section
  console.log('Scrolling to Footer...');
  await send('Runtime.evaluate', {
    expression: `
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
    `
  });
  await new Promise((r) => setTimeout(r, 2000));

  const footerShot = await send('Page.captureScreenshot', { format: 'png' });
  const footerPath = path.join(ARTIFACT_DIR, 'footer_indore_bhopal.png');
  fs.writeFileSync(footerPath, Buffer.from(footerShot.data, 'base64'));
  console.log(`Saved: ${footerPath}`);

  ws.close();
  chromeProc.kill();
  console.log('✅ All SEO verification screenshots captured successfully!');
  process.exit(0);
}

run().catch((err) => {
  console.error('Error during capture:', err);
  try { chromeProc.kill(); } catch (e) {}
  process.exit(1);
});
