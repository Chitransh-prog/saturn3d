import fs from 'node:fs';
const text = fs.readFileSync('scripts/live_bundle.js', 'utf8');

const matches = text.match(/\/products\/[a-zA-Z0-9_\-\.]+/g) || [];
console.log('Product image paths in bundle:', [...new Set(matches)]);

const galleryMatches = text.match(/\/gallery\/[^"']+/g) || [];
console.log('Gallery image paths in bundle count:', galleryMatches.length);

// Look for product names
const prodNames = [
  'Geometric Vase', 'Tech Organizer', 'Articulated Desk Lamp', 
  'Self-Watering Plant Pot', 'Adjustable Phone Stand', 'Cable Management System',
  'Lattice Pen Holder', 'Geometric Wall Hooks', 'Sculptural Bookends'
];
for (const p of prodNames) {
  console.log(`Product "${p}":`, text.includes(p));
}

