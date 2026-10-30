import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9235;
const tempProfile = path.join(process.env.TEMP || 'C:\\temp', 'cdp_profile_live_' + Date.now());

const chromeProc = spawn(CHROME_PATH, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${tempProfile}`,
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

  console.log('Navigating to https://www.saturn3d.in/ ...');
  await send('Page.navigate', { url: 'https://www.saturn3d.in/' });
  await new Promise(r => setTimeout(r, 5000));

  const pageData = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `
      (() => {
        // Find all headings
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => h.innerText.trim());
        
        // Find all product or card elements
        const cards = Array.from(document.querySelectorAll('a, button, div')).map(el => {
          const text = el.innerText?.trim();
          if (text && text.length > 3 && text.length < 80 && (text.includes('₹') || el.className?.includes('product') || el.className?.includes('card'))) {
            return text;
          }
          return null;
        }).filter(Boolean);

        // Find all images
        const images = Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt
        }));

        // Find navigation links
        const nav = Array.from(document.querySelectorAll('nav a, header a')).map(a => ({
          text: a.innerText.trim(),
          href: a.href
        }));

        return {
          title: document.title,
          headings: [...new Set(headings)],
          images,
          nav: [...new Set(nav.map(n => JSON.stringify(n)))].map(s => JSON.parse(s)),
          bodyTextSnippet: document.body.innerText.slice(0, 3000)
        };
      })()
    `,
  });

  console.log('Extracted Live Site Data:');
  console.log(JSON.stringify(pageData.result?.value, null, 2));

  ws.close();
  chromeProc.kill();
}

run().catch(err => {
  console.error(err);
  chromeProc.kill();
  process.exit(1);
});

