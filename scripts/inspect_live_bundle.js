import fs from 'node:fs';

async function inspectHtml() {
  const res = await fetch('https://www.saturn3d.in/');
  const html = await res.text();
  const scriptMatches = [...html.matchAll(/src=["']([^"']+\.js)["']/g)].map(m => m[1]);
  console.log('Scripts found:', scriptMatches);
  for (const src of scriptMatches) {
    const fullUrl = src.startsWith('http') ? src : 'https://www.saturn3d.in/' + src.replace(/^\//, '');
    const sRes = await fetch(fullUrl);
    const text = await sRes.text();
    console.log('Script:', fullUrl, 'length:', text.length);
    
    // Check for hardcoded products, categories, or API URLs
    const matches = text.match(/\/api\/[a-zA-Z0-9_\-\/]+/g) || [];
    console.log('API routes mentioned:', [...new Set(matches)]);

    // Check for product names
    const searchTerms = ['Vase', 'Planter', 'Impeller', 'Drone', 'Chassis', 'Gearbox', 'Organizer', 'Bookends', 'Lamp', 'Phone Stand'];
    for (const term of searchTerms) {
      if (text.includes(term)) {
        console.log(`Found term "${term}" in bundle!`);
      }
    }
  }
}
inspectHtml();

