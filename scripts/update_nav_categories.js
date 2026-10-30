import fs from 'node:fs';

let content = fs.readFileSync('src/components/Navigation.tsx', 'utf8');

// Update HOME_SECTIONS
content = content.replace(
  `const HOME_SECTIONS = [
  { id: 'products', label: '3D Products' },
  { id: 'hardware', label: 'Hardware Fleet' },`,
  `const HOME_SECTIONS = [
  { id: 'products', label: '3D Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'hardware', label: 'Hardware Fleet' },`
);

// Update sectionIds
content = content.replace(
  `const sectionIds = ['overview', 'products', 'hardware',`,
  `const sectionIds = ['overview', 'products', 'categories', 'hardware',`
);

fs.writeFileSync('src/components/Navigation.tsx', content, 'utf8');
console.log('Successfully updated Navigation.tsx with Categories pill');

