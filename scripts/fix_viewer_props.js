const fs = require('fs');
const path = require('path');

const viewerPath = path.resolve(__dirname, '../src/components/Product3DViewer.tsx');
let content = fs.readFileSync(viewerPath, 'utf8');

const target = 'export default function Product3DViewer';
const replacement = `export interface Product3DViewerProps {
  product: Product;
  selectedMaterial?: string;
}

export default function Product3DViewer`;

if (content.includes(target) && !content.includes('interface Product3DViewerProps')) {
  content = content.replace(target, replacement);
  fs.writeFileSync(viewerPath, content, 'utf8');
  console.log('Successfully added Product3DViewerProps interface!');
} else {
  console.log('Already present or target not found');
}

