const fs = require('fs');
const path = require('path');

const viewerPath = path.resolve(__dirname, '../src/components/Product3DViewer.tsx');
let content = fs.readFileSync(viewerPath, 'utf8');

content = content.replace(
  'export default function Product3DViewer({ product, selectedMaterial }: Product3DViewerProps)',
  'export default function Product3DViewer({ product, selectedMaterial = "PLA" }: Product3DViewerProps)'
);

content = content.replace(
  'materialType: selectedMaterial,',
  'materialType: selectedMaterial || "PLA",'
);

fs.writeFileSync(viewerPath, content, 'utf8');
console.log('Successfully added default parameter for selectedMaterial!');

