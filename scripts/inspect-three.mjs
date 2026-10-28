import { spawn } from 'node:child_process';
import path from 'node:path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9225;
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
      console.log('[BROWSER CONSOLE]', data.params.type, ...data.params.args.map(a => a.value || a.description));
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

  // Find canvas and fiber root to get scene
  const res = await send('Runtime.evaluate', {
    expression: `(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return { error: 'No canvas found' };
      
      const key = Object.keys(canvas).find(k => k.startsWith('__reactFiber'));
      let fiber = canvas[key];
      while (fiber && !fiber.stateNode?.scene && !fiber.memoizedProps?.scene) {
        fiber = fiber.return;
      }
      
      // Alternative: search window or React Three Fiber store
      let r3fState = null;
      let curr = canvas[key];
      while (curr) {
        if (curr.memoizedState && curr.memoizedState.store) {
          r3fState = curr.memoizedState.store.getState();
          break;
        }
        if (curr.stateNode && curr.stateNode.store) {
          r3fState = curr.stateNode.store.getState();
          break;
        }
        curr = curr.return;
      }

      if (!r3fState) {
        // Search window
        for (const k of Object.keys(window)) {
          if (window[k] && window[k].scene) {
            r3fState = window[k];
            break;
          }
        }
      }

      return {
        hasR3F: !!r3fState,
        camera: r3fState?.camera ? {
          pos: r3fState.camera.position.toArray(),
          fov: r3fState.camera.fov,
          near: r3fState.camera.near,
          far: r3fState.camera.far
        } : null,
        meshes: r3fState?.scene ? (() => {
          const list = [];
          r3fState.scene.traverse((obj) => {
            if (obj.isMesh) {
              list.push({
                name: obj.name,
                visible: obj.visible,
                pos: obj.position.toArray(),
                scale: obj.scale.toArray(),
                parent: obj.parent?.name || obj.parent?.type,
                matColor: obj.material?.color?.getHexString(),
                matType: obj.material?.type
              });
            }
          });
          return list;
        })() : null
      };
    })()`,
    returnByValue: true
  });

  console.log('R3F Scene Inspection:', JSON.stringify(res.result?.value, null, 2));

  ws.close();
  chromeProc.kill();
}

run().catch((e) => {
  console.error(e);
  chromeProc.kill();
});
