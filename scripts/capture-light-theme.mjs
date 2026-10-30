import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9223;
const ARTIFACT_DIR = "C:\\Users\\Chitransh\\.gemini\\antigravity\\brain\\cd7f3ce9-e0c4-41d4-adc9-1e911349537d";
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_light_theme_' + Date.now());

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

async function capture() {
  await waitForCdp();
  console.log('Connected to Chrome CDP on port', PORT);

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
      console.log('[BROWSER]', data.params.type, ...data.params.args.map(a => a.value || a.description));
    }
    if (data.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]', JSON.stringify(data.params.exceptionDetails, null, 2));
    }
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Network.enable');

  // Bypass preloader in sessionStorage
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      try {
        sessionStorage.setItem('saturn_preloader_seen', 'true');
        sessionStorage.setItem('saturn_hero_intro_seen', 'true');
      } catch (e) {}
    `
  });

  // 1. DESKTOP CAPTURES (1440x900)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  });

  await send('Page.navigate', { url: 'http://localhost:3000' });
  // Wait for preloader animation (1.6s ramp + 0.6s curtain + 0.8s hero reveal)
  await new Promise((r) => setTimeout(r, 4500));

  // Screenshot 1: Desktop Hero & Nav
  const s1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'light_theme_desktop_hero.png'), Buffer.from(s1.data, 'base64'));
  console.log('Saved: light_theme_desktop_hero.png');

  // Scroll to Tech Duo & 3D Products
  await send('Runtime.evaluate', {
    expression: `
      if (window.__lenis) {
        window.__lenis.scrollTo('#products', { immediate: true });
      } else {
        document.getElementById('products')?.scrollIntoView();
      }
    `
  });
  await new Promise((r) => setTimeout(r, 1500));

  const s2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'light_theme_desktop_products.png'), Buffer.from(s2.data, 'base64'));
  console.log('Saved: light_theme_desktop_products.png');

  // Scroll to Materials & Configurator
  await send('Runtime.evaluate', {
    expression: `
      if (window.__lenis) {
        window.__lenis.scrollTo('#specs', { immediate: true });
      } else {
        document.getElementById('specs')?.scrollIntoView();
      }
    `
  });
  await new Promise((r) => setTimeout(r, 1500));

  const s3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'light_theme_desktop_materials.png'), Buffer.from(s3.data, 'base64'));
  console.log('Saved: light_theme_desktop_materials.png');

  // Scroll to CTA and Footer
  await send('Runtime.evaluate', {
    expression: `
      if (window.__lenis) {
        window.__lenis.scrollTo('bottom', { immediate: true });
      } else {
        window.scrollTo(0, document.body.scrollHeight);
      }
    `
  });
  await new Promise((r) => setTimeout(r, 1500));

  const s4 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'light_theme_desktop_footer.png'), Buffer.from(s4.data, 'base64'));
  console.log('Saved: light_theme_desktop_footer.png');

  // 2. MOBILE CAPTURE (390x844 iPhone 14 style)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });

  await send('Runtime.evaluate', {
    expression: `
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    `
  });
  await new Promise((r) => setTimeout(r, 1500));

  const s5 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'light_theme_mobile_hero.png'), Buffer.from(s5.data, 'base64'));
  console.log('Saved: light_theme_mobile_hero.png');

  ws.close();
  chromeProc.kill();
  console.log('All screenshots captured successfully!');
  process.exit(0);
}

capture().catch((err) => {
  console.error(err);
  chromeProc.kill();
  process.exit(1);
});
