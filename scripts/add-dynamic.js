import fs from 'node:fs';
import path from 'node:path';

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (f === 'route.ts' || f === 'route.js') {
      let content = fs.readFileSync(full, 'utf8');
      if (!content.includes('export const dynamic')) {
        content = "export const dynamic = 'force-dynamic';\n\n" + content;
        fs.writeFileSync(full, content, 'utf8');
        console.log('Added force-dynamic to:', full);
      }
    }
  }
}

walk('src/app/api');
console.log('All API routes verified!');
