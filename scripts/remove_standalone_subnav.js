const fs = require('fs');
const path = require('path');

const homePath = path.resolve(__dirname, '../src/views/Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');

// Remove import
content = content.replace(/import StickySubNav from '@\/components\/StickySubNav';\r?\n?/, '');

// Remove StickySubNav element
content = content.replace(/\{\/\* Sticky Sub-Navigation Bar.*?<\/div>\r?\n\r?\n\s*<StickySubNav[^>]*\/>/s, (match) => {
  return match.replace(/\s*\{\/\* Sticky Sub-Navigation Bar.*?<StickySubNav[^>]*\/>/s, '');
});

// Also fallback direct replacement
content = content.replace(
  /<StickySubNav items=\{subNavItems\} quoteCtaHref="\/custom-lab" quoteCtaLabel="Instant CAD Quote" \/>\r?\n?/,
  ''
);

// Clean any leftover comments
content = content.replace(/\{\/\* Sticky Sub-Navigation Bar \(Creality-Style\) \*\/\r?\n?/, '');

fs.writeFileSync(homePath, content, 'utf8');
console.log('Successfully removed standalone StickySubNav from Home.tsx!');
