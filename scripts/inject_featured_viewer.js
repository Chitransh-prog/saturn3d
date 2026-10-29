const fs = require('fs');
const path = require('path');

const homePath = path.resolve(__dirname, '../src/views/Home.tsx');
let content = fs.readFileSync(homePath, 'utf8');

// 1. Add import for FeaturedProductsViewer
if (!content.includes('FeaturedProductsViewer')) {
  content = content.replace(
    "import TechResultsDuo from '@/sections/TechResultsDuo';",
    "import TechResultsDuo from '@/sections/TechResultsDuo';\r\nimport FeaturedProductsViewer from '@/sections/FeaturedProductsViewer';"
  );
  if (!content.includes('FeaturedProductsViewer')) {
    content = content.replace(
      "import TechResultsDuo from '@/sections/TechResultsDuo';",
      "import TechResultsDuo from '@/sections/TechResultsDuo';\nimport FeaturedProductsViewer from '@/sections/FeaturedProductsViewer';"
    );
  }
}

// 2. Add 'products' to subNavItems
if (!content.includes("{ id: 'products'")) {
  content = content.replace(
    "const subNavItems = [",
    "const subNavItems = [\r\n    { id: 'products', label: '3D Products' },"
  );
  if (!content.includes("{ id: 'products'")) {
    content = content.replace(
      "const subNavItems = [",
      "const subNavItems = [\n    { id: 'products', label: '3D Products' },"
    );
  }
}

// 3. Mount FeaturedProductsViewer
if (!content.includes('<FeaturedProductsViewer />')) {
  const target = '<TechResultsDuo />';
  content = content.replace(
    target,
    `${target}\r\n\r\n      {/* 03.5 3D Component Inspection Workstation */}\r\n      <div id="products">\r\n        <FeaturedProductsViewer />\r\n      </div>`
  );
  if (!content.includes('<FeaturedProductsViewer />')) {
    content = content.replace(
      target,
      `${target}\n\n      {/* 03.5 3D Component Inspection Workstation */}\n      <div id="products">\n        <FeaturedProductsViewer />\n      </div>`
    );
  }
}

fs.writeFileSync(homePath, content, 'utf8');
console.log('Successfully updated Home.tsx with FeaturedProductsViewer!');
