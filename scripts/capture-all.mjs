import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9223;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_vp_' + Date.now());

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

const VIEWPORTS = [
  { name: '1920x870', width: 1920, height: 870, mobile: false },
  { name: '1536x730', width: 1536, height: 730, mobile: false },
  { name: '1440x700', width: 1440, height: 700, mobile: false },
  { name: '1366x657', width: 1366, height: 657, mobile: false },
  { name: '768x1024', width: 768, height: 1024, mobile: true },
  { name: '390x844', width: 390, height: 844, mobile: true },
];

async function run() {
  await waitForCdp();
  console.log('Connected to Chrome for viewport captures');

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
    if (data.method === 'Runtime.consoleAPICalled') {
      console.log('[CONSOLE]', data.params.type, ...data.params.args.map(a => a.value || a.description));
    }
  };

  await send('Runtime.enable');
  await send('Page.enable');

  // Bypass preloader and intro in sessionStorage safely
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      try {
        sessionStorage.setItem('saturn_preloader_seen', 'true');
        sessionStorage.setItem('saturn_hero_intro_seen', 'true');
      } catch (e) {}
    `
  });

  const outDir = path.resolve('docs/screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const vp of VIEWPORTS) {
    console.log(`\nCapturing ${vp.name} (${vp.width}x${vp.height})...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.mobile
    });

    await send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise((r) => setTimeout(r, 4500));

    // Measure visibility of key elements
    const metrics = await send('Runtime.evaluate', {
      expression: `({
        h1: document.querySelector('h1')?.getBoundingClientRect(),
        cta: document.querySelector('button.btn-brutal')?.getBoundingClientRect(),
        copy: document.querySelector('.font-body')?.getBoundingClientRect(),
        viewportHeight: window.innerHeight,
        hasCanvas: !!document.querySelector('canvas')
      })`,
      returnByValue: true
    });
    console.log(`Metrics for ${vp.name}:`, metrics.result?.value);

    const screenshotData = await send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(outDir, `hero-${vp.name}.png`);
    fs.writeFileSync(filePath, Buffer.from(screenshotData.data, 'base64'));
    console.log(`Saved screenshot to: ${filePath}`);
  }

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  chromeProc.kill();
  process.exit(1);
});
