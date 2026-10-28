import fs from 'node:fs';

// 1. Clean Testimonials.tsx
if (fs.existsSync('src/sections/Testimonials.tsx')) {
  let code = fs.readFileSync('src/sections/Testimonials.tsx', 'utf8');
  code = code.replaceAll('shadow-[4px_4px_0px_#000] hover:shadow-[7px_7px_0px_#000]', 'shadow-brutal-sm hover:shadow-brutal');
  let cardCount = 0;
  code = code.replace(/className="group relative bg-white border-2 border-black rounded-2xl/g, () => {
    const delay = (cardCount % 3) * 100;
    cardCount++;
    return `data-aos="fade-up" data-aos-delay="${delay}" className="group relative bg-white border-2 border-black rounded-2xl`;
  });
  fs.writeFileSync('src/sections/Testimonials.tsx', code, 'utf8');
  console.log(`Updated Testimonials.tsx: ${cardCount} cards updated.`);
}

// 2. Scan and replace harsh ugly shadows across src/
// (e.g. shadow-[8px_8px_0px_#0B0B0B], shadow-[12px_12px_0px_#0B0B0B], shadow-brutal-xl)
function walkAndClean(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = `${dir}/${f}`;
    if (fs.statSync(full).isDirectory()) {
      walkAndClean(full);
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      let content = fs.readFileSync(full, 'utf8');
      let changed = false;

      // Replace 8px / 12px raw brutal shadows
      if (content.includes('shadow-[8px_8px_0px_#0B0B0B]')) {
        content = content.replaceAll('shadow-[8px_8px_0px_#0B0B0B]', 'shadow-brutal');
        changed = true;
      }
      if (content.includes('shadow-[12px_12px_0px_#0B0B0B]')) {
        content = content.replaceAll('shadow-[12px_12px_0px_#0B0B0B]', 'shadow-brutal-lg');
        changed = true;
      }
      if (content.includes('shadow-[7px_7px_0px_#0B0B0B]')) {
        content = content.replaceAll('shadow-[7px_7px_0px_#0B0B0B]', 'shadow-brutal');
        changed = true;
      }
      if (content.includes('shadow-[8px_8px_0px_#000]')) {
        content = content.replaceAll('shadow-[8px_8px_0px_#000]', 'shadow-brutal');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(full, content, 'utf8');
        console.log('Cleaned shadows in:', full);
      }
    }
  }
}

walkAndClean('src');
console.log('Finished shadow cleanup!');
