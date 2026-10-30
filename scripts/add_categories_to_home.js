import fs from 'node:fs';

let content = fs.readFileSync('src/views/Home.tsx', 'utf8');
const search = '<div id="products">';
const idx = content.indexOf(search);
if (idx !== -1) {
  const closeDiv = content.indexOf('</div>', idx);
  const endOfDiv = closeDiv + 6;
  const insertion = '\n\n      {/* 03.8 Our Categories - Solutions at Scale (8 Sectors from saturn3d.in) */}\n      <div id="categories">\n        <IndustryCategories />\n      </div>';
  content = content.slice(0, endOfDiv) + insertion + content.slice(endOfDiv);
  fs.writeFileSync('src/views/Home.tsx', content, 'utf8');
  console.log('Successfully updated Home.tsx with IndustryCategories');
} else {
  console.error('Could not find <div id="products"> in Home.tsx');
}

