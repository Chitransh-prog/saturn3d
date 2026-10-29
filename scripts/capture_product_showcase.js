const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Chitransh/.gemini/antigravity/brain/cd7f3ce9-e0c4-41d4-adc9-1e911349537d';

async function main() {
  const browser = await chromium.launch();
  
  // 1. Desktop Home Page Scrolled to #products
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await desktop.waitForTimeout(2000);
  
  const productsSection = await desktop.$('#products');
  if (productsSection) {
    await productsSection.scrollIntoViewIfNeeded();
    await desktop.waitForTimeout(1500);
    await desktop.screenshot({
      path: path.join(ARTIFACT_DIR, 'home_3d_products_station.png'),
    });
    console.log('Saved home_3d_products_station.png');
  }

  // 2. Product Detail 1 (Turbine Impeller)
  const prod1 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await prod1.goto('http://localhost:3000/product/1', { waitUntil: 'networkidle' });
  await prod1.waitForTimeout(2000);
  await prod1.screenshot({
    path: path.join(ARTIFACT_DIR, 'product_1_detail_3d.png'),
  });
  console.log('Saved product_1_detail_3d.png');

  // 3. Product Detail 2 (Drone Spar)
  const prod2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await prod2.goto('http://localhost:3000/product/2', { waitUntil: 'networkidle' });
  await prod2.waitForTimeout(2000);
  await prod2.screenshot({
    path: path.join(ARTIFACT_DIR, 'product_2_detail_3d.png'),
  });
  console.log('Saved product_2_detail_3d.png');

  // 4. Mobile Viewport 390px of 3D Products Workstation
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobile.waitForTimeout(2000);
  const mobileProducts = await mobile.$('#products');
  if (mobileProducts) {
    await mobileProducts.scrollIntoViewIfNeeded();
    await mobile.waitForTimeout(1500);
    await mobile.screenshot({
      path: path.join(ARTIFACT_DIR, 'mobile_390_products_station.png'),
    });
    console.log('Saved mobile_390_products_station.png');
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

