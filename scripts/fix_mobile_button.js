const fs = require('fs');
const path = require('path');

const navPath = path.resolve(__dirname, '../src/components/Navigation.tsx');
let content = fs.readFileSync(navPath, 'utf8');

const target = `<span className="whitespace-nowrap">Instant CAD Quote</span>`;
const replacement = `<span className="hidden sm:inline whitespace-nowrap">Instant CAD Quote</span>\r\n            <span className="sm:hidden whitespace-nowrap text-[11px]">Quote</span>`;

content = content.replace(target, replacement);

fs.writeFileSync(navPath, content, 'utf8');
console.log('Successfully optimized mobile quote button!');
