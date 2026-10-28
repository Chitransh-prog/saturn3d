import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve('saturn-3d-main/src/sections/MakeItYours.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace fade-right and fade-left with fade-up
content = content.replaceAll('data-aos="fade-right"', 'data-aos="fade-up"');
content = content.replaceAll('data-aos="fade-left"', 'data-aos="fade-up"');

// Update section padding
content = content.replace(
  'section-padding px-6 sm:px-10 lg:px-16 overflow-hidden',
  'py-14 sm:py-24 px-4 sm:px-10 lg:px-16 overflow-hidden'
);

// Update dropzone padding and responsive styling
content = content.replace(
  'p-8 sm:p-10 border-2 border-dashed border-[#0B0B0B]',
  'p-4 sm:p-8 border-2 border-dashed border-[#0B0B0B] w-full max-w-full overflow-hidden'
);

// Update dropzone title text
content = content.replace(
  'font-display text-base font-bold uppercase tracking-tight text-[#0B0B0B] block',
  'font-display text-sm sm:text-base font-bold uppercase tracking-tight text-[#0B0B0B] block break-words max-w-full px-1'
);

// Update material buttons truncate & styling
content = content.replace(
  '<span className="block truncate">{item.label}</span>',
  '<span className="block truncate text-[11px] sm:text-xs leading-tight">{item.label}</span>'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated MakeItYours.tsx for mobile!');

