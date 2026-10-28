const fs = require('fs');
let file = fs.readFileSync('saturn-3d-main/src/sections/Footer.tsx', 'utf8');
const oldLine = '<div className="font-mono text-xs font-bold text-[#0B0B0B] pl-2">';
const newLine = '<div className="font-mono text-[10px] sm:text-xs font-bold text-[#0B0B0B] pl-24 truncate">';

if (file.includes(oldLine)) {
  file = file.replace(oldLine, newLine);
  fs.writeFileSync('saturn-3d-main/src/sections/Footer.tsx', file, 'utf8');
  console.log('Successfully updated Footer pl-2 to pl-24!');
} else {
  console.log('Line not found');
}
