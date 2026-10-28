import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_profile_' + Date.now());

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

// Wait for Chrome to listen
async function waitForCdp() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error('Chrome CDP did not start in time');
}

async function run() {
  const version = await waitForCdp();
  console.log('Connected to Chrome:', version.Browser);

  // Get target
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
      console.log('[BROWSER CONSOLE]', data.params.type, ...data.params.args.map(a => a.value || a.description));
    }
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]', data.params.exceptionDetails);
    }
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1920,
    height: 870,
    deviceScaleFactor: 1,
    mobile: false
  });

  // Bypass preloader in sessionStorage
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `sessionStorage.setItem('saturn_preloader_seen', 'true');`
  });

  // Wait for load and DOM
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise((r) => setTimeout(r, 6000));

  const evalRes = await send('Runtime.evaluate', {
    expression: `({
      h1: document.querySelector('h1')?.innerText,
      canvas: !!document.querySelector('canvas'),
      bodyText: document.body.innerText.slice(0, 300)
    })`,
    returnByValue: true
  });
  console.log('Page state:', evalRes.result?.value);

  // Take screenshot
  const screenshotData = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = path.resolve('docs/hero-live-diagnose.png');
  fs.writeFileSync(outPath, Buffer.from(screenshotData.data, 'base64'));
  console.log('Saved screenshot to:', outPath);

  ws.close();
  chromeProc.kill();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  chromeProc.kill();
  process.exit(1);
});
