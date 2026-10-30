import fs from 'node:fs';

const text = fs.readFileSync('scripts/live_bundle.js', 'utf8');

// Find the categories array around "Drone & Robotics"
const droneIdx = text.indexOf('Drone & Robotics');
if (droneIdx !== -1) {
  const start = Math.max(0, droneIdx - 1500);
  const end = Math.min(text.length, droneIdx + 1500);
  console.log('=== CATEGORIES CONTEXT ===');
  console.log(text.substring(start, end));
}

// Find if there is an initial products array or API call for products
const catIdx = text.indexOf('OUR CATEGORIES');
if (catIdx !== -1) {
  const start = Math.max(0, catIdx - 500);
  const end = Math.min(text.length, catIdx + 1500);
  console.log('=== OUR CATEGORIES CONTEXT ===');
  console.log(text.substring(start, end));
}

