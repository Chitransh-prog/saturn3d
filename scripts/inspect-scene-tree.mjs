import { spawn } from 'node:child_process';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9230;
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
  };

  await send('Runtime.enable');
  await send('Page.enable');

  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      sessionStorage.setItem('saturn_preloader_seen', 'true');
      sessionStorage.setItem('saturn_hero_intro_seen', 'true');
    `
  });

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise((r) => setTimeout(r, 4000));

  const sceneEval = await send('Runtime.evaluate', {
    expression: `(() => {
      try {
        const scene = window.__SCENE;
        if (!scene) return { error: 'No __SCENE on window' };
        
        const meshes = [];
        scene.traverse((obj) => {
          if (obj.isMesh) {
            meshes.push({
              name: obj.name,
              visible: obj.visible,
              type: obj.type,
              pos: obj.position.toArray(),
              scale: obj.scale.toArray(),
              parentName: obj.parent?.name,
              parentType: obj.parent?.type,
              parentVisible: obj.parent?.visible,
              materialType: obj.material?.type,
              clippingPlanesCount: obj.material?.clippingPlanes?.length
            });
          }
        });
        return { meshesCount: meshes.length, meshes };
      } catch (e) {
        return { error: e.message, stack: e.stack };
      }
    })()`,
    returnByValue: true
  });
  console.log('Scene Inspection Result:\n', JSON.stringify(sceneEval.result?.value, null, 2));

  ws.close();
  chromeProc.kill();
}

run().catch((e) => {
  console.error(e);
  chromeProc.kill();
});
