import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve('saturn-3d-main/src/components/FloatingWhatsApp.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update positioning on mobile
content = content.replace(
  'right-[20px] bottom-[calc(20px+env(safe-area-inset-bottom,0px))] max-sm:bottom-[calc(84px+env(safe-area-inset-bottom,0px))]',
  'right-3 sm:right-[20px] bottom-[calc(20px+env(safe-area-inset-bottom,0px))] max-sm:bottom-[calc(68px+env(safe-area-inset-bottom,0px))]'
);

// Update button size on mobile
content = content.replace(
  'relative w-13 h-13 sm:w-14 sm:h-14',
  'relative w-11 h-11 sm:w-14 sm:h-14'
);

// Update SVG size on mobile
content = content.replace(
  'w-7 h-7 fill-current',
  'w-5.5 h-5.5 sm:w-7 sm:h-7 fill-current'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated FloatingWhatsApp.tsx for mobile!');

