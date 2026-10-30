import fs from 'node:fs';

async function parseBundle() {
  const url = 'https://www.saturn3d.in/assets/index-bQaSQBNp.js';
  const res = await fetch(url);
  const text = await res.text();
  fs.writeFileSync('scripts/live_bundle.js', text);
  console.log('Saved live_bundle.js, length:', text.length);

  // Search for products array or objects
  // Let's find occurrences of "Vase"
  let idx = 0;
  while ((idx = text.indexOf('Vase', idx)) !== -1) {
    const start = Math.max(0, idx - 150);
    const end = Math.min(text.length, idx + 250);
    console.log('--- FOUND VASE CONTEXT ---');
    console.log(text.substring(start, end));
    idx += 4;
  }

  // Let's find occurrences of "Drone"
  idx = 0;
  while ((idx = text.indexOf('Drone', idx)) !== -1) {
    const start = Math.max(0, idx - 100);
    const end = Math.min(text.length, idx + 200);
    console.log('--- FOUND DRONE CONTEXT ---');
    console.log(text.substring(start, end));
    idx += 5;
  }
}
parseBundle();

