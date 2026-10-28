async function verify() {
  const urls = [
    'http://localhost:3000/',
    'http://localhost:3000/product/1',
    'http://localhost:3000/product/3',
    'http://localhost:3000/category/rapid-prototyping',
    'http://localhost:3000/custom-lab',
    'http://localhost:3000/about',
  ];

  for (const url of urls) {
    console.log('\n======================================================');
    console.log('CHECKING URL:', url);
    const res = await fetch(url);
    const html = await res.text();

    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || 'NO TITLE';
    const desc = html.match(/name="description" content="([^"]+)"/)?.[1] || 'NO DESC';
    const geoRegion = html.match(/name="geo\.region" content="([^"]+)"/)?.[1] || 'NO GEO REGION';
    const geoPlace = html.match(/name="geo\.placename" content="([^"]+)"/)?.[1] || 'NO GEO PLACE';

    console.log('STATUS:', res.status);
    console.log('TITLE:', title);
    console.log('DESCRIPTION:', desc.slice(0, 100) + '...');
    console.log('GEO REGION:', geoRegion);
    console.log('GEO PLACE:', geoPlace);

    const schemaMatches = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)];
    console.log('SCHEMAS FOUND:', schemaMatches.length);
    schemaMatches.forEach((m, idx) => {
      try {
        const obj = JSON.parse(m[1]);
        const type = Array.isArray(obj['@type']) ? obj['@type'].join(', ') : obj['@type'];
        console.log(`  [Schema ${idx + 1}] Type: ${type} | Name: ${obj.name || obj.headline || 'N/A'}`);
        if (obj.offers) {
          console.log(`    Offer: ₹${obj.offers.price} ${obj.offers.priceCurrency} | Availability: ${obj.offers.availability}`);
        }
      } catch (e) {
        console.log(`  [Schema ${idx + 1}] Parse error:`, e.message);
      }
    });
  }
}

verify().catch(console.error);

