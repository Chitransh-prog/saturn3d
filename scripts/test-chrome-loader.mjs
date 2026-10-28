import { spawn } from 'node:child_process';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9229;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_diag_' + Date.now());

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
    if (data.method === 'Runtime.consoleAPICalled') {
      console.log('[BROWSER LOG]', data.params.type, ...data.params.args.map(a => a.value || a.description));
    }
  };

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Network.enable');

  const requests = [];
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && callbacks.has(data.id)) {
      const { resolve } = callbacks.get(data.id);
      callbacks.delete(data.id);
      resolve(data.result);
    }
    if (data.method === 'Network.requestWillBeSent') {
      if (data.params.request.url.includes('saturn-mecha.glb') || data.params.request.url.includes('meshopt') || data.params.request.url.includes('wasm')) {
        console.log('[NETWORK REQUEST]', data.params.request.url);
      }
    }
    if (data.method === 'Network.responseReceived') {
      if (data.params.response.url.includes('saturn-mecha.glb') || data.params.response.url.includes('meshopt') || data.params.response.url.includes('wasm')) {
        console.log('[NETWORK RESPONSE]', data.params.response.url, data.params.response.status);
      }
    }
    if (data.method === 'Network.loadingFailed') {
      console.log('[NETWORK FAILED]', data.params);
    }
    if (data.method === 'Runtime.consoleAPICalled') {
      console.log('[BROWSER LOG]', data.params.type, ...data.params.args.map(a => a.value || a.description));
    }
  };

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise((r) => setTimeout(r, 5000));

  ws.close();
  chromeProc.kill();
}

run().catch((e) => {
  console.error(e);
  chromeProc.kill();
});
