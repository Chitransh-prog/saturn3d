import { spawn } from 'node:child_process';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9262;
const tempProfile = 'C:\\temp\\cdp_dbg_' + Date.now();
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
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 3500));

  const res = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        const el = document.getElementById('categories');
        if (!el) return { error: 'No #categories found' };
        const cards = el.querySelectorAll('a, .grid > *');
        const cardInfos = Array.from(cards).map(c => ({
          text: c.innerText?.slice(0, 50),
          opacity: window.getComputedStyle(c).opacity,
          visibility: window.getComputedStyle(c).visibility,
          display: window.getComputedStyle(c).display,
          transform: window.getComputedStyle(c).transform,
          rect: c.getBoundingClientRect()
        }));
        return {
          totalCards: cards.length,
          cardInfos,
          innerText: el.innerText
        };
      })()
    `
  });
  console.log('DOM Evaluation Result:', JSON.stringify(res.result.value, null, 2));
  chromeProc.kill();
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  chromeProc.kill();
  process.exit(1);
});

