import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');

// 1. Build multi-resolution ICO generator
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(count, 4); // count of images

  const dirSize = 16 * count;
  let offset = 6 + dirSize;
  const dirEntries = [];

  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.width >= 256 ? 0 : item.width, 0);
    entry.writeUInt8(item.height >= 256 ? 0 : item.height, 1);
    entry.writeUInt8(0, 2); // color palette count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    dirEntries.push(entry);
    offset += item.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...pngBuffers.map((p) => p.buffer)]);
}

async function run() {
  console.log('[Favicon Generator] Generating Saturn 3D favicon assets...');

  const size = 512;
  const radius = 96;

  // Mask for squircle
  const maskSvg = Buffer.from(`
    <svg width="${size}" height="${size}">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#412f91" />
    </svg>
  `);

  // Extract S and 3D from logo-white.png
  // In logo-white.png: S is at left: 13, top: 60, width: 134, height: 120
  // 3D mark is at left: 750, top: 15, width: 500, height: 164
  const sImg = await sharp(path.join(publicDir, 'logo-white.png'))
    .extract({ left: 13, top: 60, width: 134, height: 120 })
    .resize(220, 197)
    .toBuffer();

  const dImg = await sharp(path.join(publicDir, 'logo-white.png'))
    .extract({ left: 750, top: 15, width: 500, height: 164 })
    .resize(360, 118)
    .toBuffer();

  // Master 512x512 rounded squircle canvas in brand purple (#412f91)
  const masterBase = await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 65, g: 47, b: 145, alpha: 1 },
    },
  })
    .composite([
      { input: sImg, top: 76, left: Math.round((size - 220) / 2) },
      { input: dImg, top: 298, left: Math.round((size - 360) / 2) },
    ])
    .png()
    .toBuffer();

  const masterSquircle = await sharp(masterBase)
    .composite([{ input: maskSvg, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Also create a transparent version for tiny 16x16 / 32x32 if needed,
  // but a high-contrast purple squircle looks crisp on both dark and light browser tabs!
  // Let's generate standard sizes:
  const sizes = [
    { name: 'favicon-16x16', size: 16 },
    { name: 'favicon-32x32', size: 32 },
    { name: 'favicon-48x48', size: 48 },
    { name: 'apple-touch-icon', size: 180 },
    { name: 'android-chrome-192x192', size: 192 },
    { name: 'android-chrome-512x512', size: 512 },
  ];

  const icoBuffers = [];

  for (const item of sizes) {
    const pngBuf = await sharp(masterSquircle)
      .resize(item.size, item.size)
      .png()
      .toBuffer();

    const webpBuf = await sharp(masterSquircle)
      .resize(item.size, item.size)
      .webp({ quality: 95 })
      .toBuffer();

    fs.writeFileSync(path.join(publicDir, `${item.name}.png`), pngBuf);
    fs.writeFileSync(path.join(publicDir, `${item.name}.webp`), webpBuf);
    console.log(`✓ Generated ${item.name}.png & .webp (${item.size}x${item.size})`);

    if ([16, 32, 48].includes(item.size)) {
      icoBuffers.push({ width: item.size, height: item.size, buffer: pngBuf });
    }
  }

  // Generate multi-resolution favicon.ico
  const icoData = createIco(icoBuffers);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoData);
  console.log(`✓ Generated multi-resolution favicon.ico (${icoData.length} bytes, 16/32/48px)`);

  // Generate SVG favicon for modern browsers
  // Using an embedded vector representation with #412f91 squircle
  const masterBase64 = masterSquircle.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image width="512" height="512" href="data:image/png;base64,${masterBase64}"/>
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent, 'utf-8');
  console.log(`✓ Generated modern vector favicon.svg`);

  // Generate site.webmanifest
  const manifest = {
    name: 'Saturn 3D Precision Manufacturing',
    short_name: 'Saturn 3D',
    description: 'Central India premier industrial 3D printing and rapid prototyping hub',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#412f91',
    icons: [
      {
        src: '/android-chrome-192x192.webp',
        sizes: '192x192',
        type: 'image/webp',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-touch-icon.webp',
        sizes: '180x180',
        type: 'image/webp',
      },
    ],
  };
  fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`✓ Generated site.webmanifest`);
}

run().catch((err) => {
  console.error('[Favicon Generator Error]', err);
  process.exit(1);
});
