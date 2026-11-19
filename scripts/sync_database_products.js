const path = require('path');
const fs = require('fs');
const { DatabaseSync } = require('node:sqlite');

const dbPath = path.resolve('saturn-3d-main/data/saturn3d.db');
if (!fs.existsSync(dbPath)) {
  console.log('Database file does not exist yet at:', dbPath);
  process.exit(0);
}

const sqlite = new DatabaseSync(dbPath);
const now = new Date().toISOString();

const defaultProducts = [
  {
    id: '1',
    name: 'Hexagonal Carbon Vase',
    slug: 'hexagonal-carbon-vase',
    description: 'Generative algorithm-designed geometric vase with continuous spiral shell. 3D printed with premium Carbon-Fiber PLA for a matte velvet tactile texture.',
    price: 1299.00,
    image: '/products/vase.webp',
    category: 'Interior',
    stock: 25,
  },
  {
    id: '2',
    name: 'Tech Organizer Elite',
    slug: 'tech-organizer-elite',
    description: 'Precision modular workstation dock engineered with anti-resonant weighting, dedicated wireless device bays, and cable conduits.',
    price: 1499.00,
    image: '/products/organizer.webp',
    category: 'Corporate / Bulk Gifting',
    stock: 40,
  },
  {
    id: '3',
    name: 'Articulated High-Torque Desk Lamp',
    slug: 'articulated-desk-lamp',
    description: 'Adjustable arm desk lamp with embedded LED channel. Industrial cobalt-violet and ink contrast accents. 360° counterbalanced hinge.',
    price: 2100.00,
    image: '/products/lamp.webp',
    category: 'Drone & Robotics',
    stock: 18,
  },
  {
    id: '4',
    name: 'Sculptural Monolithic Bookends',
    slug: 'sculptural-bookends',
    description: 'Abstract sculptural monolithic bookends with mineral texture finish. Supports heavy hardcovers, ideal for corporate executive gifting and bespoke wedding keepsake sets.',
    price: 1850.00,
    image: '/products/bookends.webp',
    category: 'Corporate / Bulk Gifting',
    stock: 20,
  },
  {
    id: '5',
    name: 'Parametric Architectural Wall Hooks',
    slug: 'geometric-wall-hooks',
    description: 'Parametric architectural facade scale study wall mounts. Inspired by brutalist faceted geometry with concealed structural wall anchor points.',
    price: 1250.00,
    image: '/products/wall-hooks.webp',
    category: 'Architectural Scale Down Models',
    stock: 35,
  },
  {
    id: '6',
    name: 'Modular Interlocking Cable Track',
    slug: 'modular-cable-track',
    description: 'Quick snap-together desk cable spine with 14 articulated vertebrae for neat routing from desk grommet to floor power socket.',
    price: 850.00,
    image: '/products/cable-management.webp',
    category: 'Small Batch Manufacturing',
    stock: 60,
  },
  {
    id: '7',
    name: 'Geometric Self-Watering Planter',
    slug: 'geometric-self-watering-planter',
    description: 'Dual-reservoir breathable planter with capillary moisture wick system. Water-tight inner shell with textured outer grip.',
    price: 990.00,
    image: '/products/plant-pot.webp',
    category: 'Education',
    stock: 30,
  },
  {
    id: '8',
    name: 'Bespoke CNC-Fit Phone Stand',
    slug: 'bespoke-cnc-phone-stand',
    description: 'Heavy gauge angled charging cradle compatible with MagSafe cables and all modern smartphones. Solid anti-slip rubber pads.',
    price: 750.00,
    image: '/products/phone-stand.webp',
    category: 'Industrial Parts Manufacturing',
    stock: 45,
  },
  {
    id: '9',
    name: 'Lattice Pen Holder & Caliper Station',
    slug: 'lattice-pen-holder',
    description: 'Intricate gyroid lattice design pen and caliper station. Metallic finish with micron-accurate friction fits for drafters, architects, and prototyping engineers.',
    price: 1150.00,
    image: '/products/pen-holder.webp',
    category: 'Rapid Prototyping',
    stock: 35,
  },
  {
    id: '10',
    name: 'Micro-Fluidic Centrifugal Impeller',
    slug: 'micro-fluidic-centrifugal-impeller',
    description: 'Ultra-precision centrifugal cooling rotor with 8 aerodynamic backward-curved vanes and high-flow inducer hub. Fabricated in engineering SLA photopolymer with micron-level surface smoothness.',
    price: 1450.00,
    image: '/showcase/sla-turbine-impeller.webp',
    category: 'Rapid Prototyping',
    stock: 24,
  },
  {
    id: '11',
    name: 'UAS Carbon-X Drone Arm Spar',
    slug: 'uas-carbon-x-drone-arm-spar',
    description: 'High flexural modulus continuous carbon-fiber composite motor spar engineered for heavy-lift industrial quadcopters. Internal gyroid lattice absorbs high-frequency motor vibration harmonics.',
    price: 2850.00,
    image: '/showcase/carbon-drone-spar.webp',
    category: 'Drone & Robotics',
    stock: 18,
  },
  {
    id: '12',
    name: 'CoreXY Structural Enclosure Chassis',
    slug: 'corexy-structural-enclosure-chassis',
    description: 'High-rigidity prototype electronic enclosure with integral PCB standoffs, active heat-dissipation ventilation louvers, and dual-axis snap-fit seal lid tolerances.',
    price: 3400.00,
    image: '/showcase/industrial-chassis.webp',
    category: 'Rapid Prototyping',
    stock: 14,
  },
  {
    id: '13',
    name: 'High-Torque Planetary Reduction Gearbox',
    slug: 'high-torque-planetary-reduction-gearbox',
    description: 'Compound epicyclic planetary reduction gear cluster with 14-tooth sun gear and precision involute planet satellites. Delivers verified 4:1 mechanical torque multiplication.',
    price: 1950.00,
    image: '/showcase/planetary-gears.webp',
    category: 'Industrial Parts Manufacturing',
    stock: 22,
  },
  {
    id: '14',
    name: 'Robotic End-Effector Gripper Finger',
    slug: 'robotic-end-effector-gripper-finger',
    description: 'Dual-durometer industrial robotic manipulator finger with compliant elastomeric TPU grip pads and rigid carbon-reinforced structural spine for delicate automated pick-and-place tasks.',
    price: 1650.00,
    image: '/showcase/robotic-gripper.webp',
    category: 'Small Batch Manufacturing',
    stock: 32,
  },
];

// Clear old products to avoid unique slug constraint clashes
sqlite.prepare('DELETE FROM products').run();

const insertProd = sqlite.prepare(`
  INSERT INTO products (id, name, title, slug, description, price, image, category, stock, is_active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
`);

for (const p of defaultProducts) {
  insertProd.run(p.id, p.name, p.name, p.slug, p.description, p.price, p.image, p.category, p.stock, now, now);
}

// Add the alias for the exact UUID from the user's live screenshot
const liveUuid = 'a537902f-8c05-4cb1-8154-514f157bc1b7';
const vase = defaultProducts[0];
insertProd.run(liveUuid, vase.name, vase.name, 'hexagonal-carbon-vase-legacy', vase.description, vase.price, vase.image, vase.category, vase.stock, now, now);

console.log('Successfully synced all 14 official products + live legacy UUID into SQLite database!');
const count = sqlite.prepare('SELECT COUNT(*) as c FROM products').get().c;
console.log('Total products in database:', count);
