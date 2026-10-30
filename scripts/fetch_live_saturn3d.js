const https = require('https');

fetch('https://www.saturn3d.in/')
  .then(res => res.text())
  .then(html => {
    console.log('Fetched successfully, length:', html.length);
    // Extract title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'none');
    
    // Extract headings
    const headings = [...html.matchAll(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
    console.log('Headings:', headings);

    // Look for product names, categories, cards
    const matches = [...html.matchAll(/<a[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi)]
      .map(m => ({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() }))
      .filter(m => m.text.length > 2 && m.text.length < 50);
    console.log('Links:', matches.slice(0, 40));
  })
  .catch(err => {
    console.error('Fetch error:', err.message);
  });

