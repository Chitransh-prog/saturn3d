const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.resolve(__dirname, '../data/saturn3d.db');
const db = new DatabaseSync(dbPath);

const premierProducts = [
  {
    id: '1',
    name: 'Micro-Fluidic Centrifugal Impeller',
    title: 'Micro-Fluidic Centrifugal Impeller',
    slug: 'micro-fluidic-centrifugal-impeller',
    description: 'Ultra-precision centrifugal cooling rotor with 8 aerodynamic backward-curved vanes and high-flow inducer hub. Fabricated in translucent engineering SLA photopolymer with micron-level surface smoothness.',
    price: 1450,
    image: '/showcase/sla-turbine-impeller.jpg',
    images: JSON.stringify(['/showcase/sla-turbine-impeller.jpg']),
    category: 'Rapid Prototyping',
    stock: 24,
    specs: JSON.stringify({
      material: 'Precision Tough SLA Resin',
      leadTime: '24–48 Hours',
      tolerances: '±0.04 mm',
      dimensions: '82 × 82 × 38 mm',
      weight: '52 g'
    })
  },
  {
    id: '2',
    name: 'UAS Carbon-X Drone Arm Spar',
    title: 'UAS Carbon-X Drone Arm Spar',
    slug: 'uas-carbon-x-drone-arm-spar',
    description: 'High flexural modulus continuous carbon-fiber composite motor spar engineered for heavy-lift industrial quadcopters. Internal gyroid lattice absorbs high-frequency motor vibration harmonics.',
    price: 2850,
    image: '/showcase/carbon-drone-spar.jpg',
    images: JSON.stringify(['/showcase/carbon-drone-spar.jpg']),
    category: 'Drone & Robotics',
    stock: 18,
    specs: JSON.stringify({
      material: 'Carbon-X PA12-CF Composite',
      leadTime: '24–48 Hours',
      tolerances: '±0.05 mm',
      dimensions: '240 × 38 × 26 mm',
      weight: '74 g'
    })
  },
  {
    id: '3',
    name: 'CoreXY Structural Enclosure Chassis',
    title: 'CoreXY Structural Enclosure Chassis',
    slug: 'corexy-structural-enclosure-chassis',
    description: 'High-rigidity prototype electronic enclosure with integral PCB standoffs, active heat-dissipation ventilation louvers, and dual-axis snap-fit seal lid tolerances.',
    price: 3400,
    image: '/showcase/industrial-chassis.jpg',
    images: JSON.stringify(['/showcase/industrial-chassis.jpg']),
    category: 'Rapid Prototyping',
    stock: 14,
    specs: JSON.stringify({
      material: 'ABS-ESD Flame Retardant',
      leadTime: '48 Hours',
      tolerances: '±0.05 mm',
      dimensions: '185 × 140 × 55 mm',
      weight: '165 g'
    })
  },
  {
    id: '4',
    name: 'High-Torque Planetary Reduction Gearbox',
    title: 'High-Torque Planetary Reduction Gearbox',
    slug: 'high-torque-planetary-reduction-gearbox',
    description: 'Compound epicyclic planetary reduction gear cluster with 14-tooth sun gear and precision involute planet satellites. Delivers verified 4:1 mechanical torque multiplication.',
    price: 1950,
    image: '/showcase/planetary-gears.jpg',
    images: JSON.stringify(['/showcase/planetary-gears.jpg']),
    category: 'Industrial Parts Manufacturing',
    stock: 22,
    specs: JSON.stringify({
      material: 'Nylon PA12 / Carbon Core',
      leadTime: '24–48 Hours',
      tolerances: '±0.06 mm',
      dimensions: '94 × 94 × 42 mm',
      weight: '110 g'
    })
  },
  {
    id: '5',
    name: 'Robotic End-Effector Gripper Finger',
    title: 'Robotic End-Effector Gripper Finger',
    slug: 'robotic-end-effector-gripper-finger',
    description: 'Dual-durometer industrial robotic manipulator finger with compliant elastomeric TPU grip pads and rigid carbon-reinforced structural spine for delicate automated pick-and-place tasks.',
    price: 1650,
    image: '/showcase/robotic-gripper.jpg',
    images: JSON.stringify(['/showcase/robotic-gripper.jpg']),
    category: 'Small Batch Manufacturing',
    stock: 32,
    specs: JSON.stringify({
      material: 'TPU 95A / Carbon-X Composite',
      leadTime: '24 Hours',
      tolerances: '±0.06 mm',
      dimensions: '115 × 34 × 28 mm',
      weight: '48 g'
    })
  },
  {
    id: '6',
    name: 'Biomedical Mandibular Surgical Guide',
    title: 'Biomedical Mandibular Surgical Guide',
    slug: 'biomedical-mandibular-surgical-guide',
    description: 'Patient-specific anatomical surgical placement guide with integrated stainless steel drill sleeve inserts. Autoclavable, biocompatible medical tough photopolymer formulation.',
    price: 2200,
    image: '/showcase/biomedical-guide.jpg',
    images: JSON.stringify(['/showcase/biomedical-guide.jpg']),
    category: 'Medical & Healthcare',
    stock: 16,
    specs: JSON.stringify({
      material: 'Biocompatible Tough SLA Resin',
      leadTime: '24–36 Hours',
      tolerances: '±0.02 mm',
      dimensions: '105 × 85 × 32 mm',
      weight: '36 g'
    })
  }
];

const now = new Date().toISOString();
const upsert = db.prepare(`
  INSERT INTO products (id, name, title, slug, description, price, image, images, category, stock, specs, status, is_active, created_at, updated_at)
  VALUES (@id, @name, @title, @slug, @description, @price, @image, @images, @category, @stock, @specs, 'PUBLISHED', 1, '${now}', '${now}')
  ON CONFLICT(id) DO UPDATE SET
    name = excluded.name,
    title = excluded.title,
    slug = excluded.slug,
    description = excluded.description,
    price = excluded.price,
    image = excluded.image,
    images = excluded.images,
    category = excluded.category,
    stock = excluded.stock,
    specs = excluded.specs,
    status = 'PUBLISHED',
    is_active = 1,
    updated_at = '${now}'
`);

for (const p of premierProducts) {
  upsert.run(p);
  console.log('Successfully upserted:', p.name);
}

const list = db.prepare('SELECT id, name, category, image FROM products').all();
console.log('Total products in database:', list.length);
console.log(list);

