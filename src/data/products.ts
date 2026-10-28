export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  is_active?: boolean;
  rating?: number;
  reviewsCount?: number;
  leadTime?: string;
  tolerances?: string;
  material?: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Hexagonal Carbon Vase',
    description: 'Generative algorithm-designed geometric vase with continuous spiral shell. 3D printed with premium Carbon-Fiber PLA for a matte velvet tactile texture.',
    price: 49.00,
    image: '/products/vase.jpg',
    category: 'Interior',
    stock: 18,
    rating: 4.9,
    reviewsCount: 34,
    leadTime: '24-48 Hours',
    tolerances: '±0.08 mm',
    material: 'Carbon-Fiber PLA'
  },
  {
    id: '2',
    name: 'Tech Organizer Elite',
    description: 'Precision modular workstation dock engineered with anti-resonant weighting, dedicated wireless device bays, and cable conduits.',
    price: 42.00,
    image: '/products/organizer.jpg',
    category: 'Corporate / Bulk Gifting',
    stock: 25,
    rating: 5.0,
    reviewsCount: 48,
    leadTime: '24 Hours',
    tolerances: '±0.1 mm',
    material: 'Matte Industrial PETG'
  },
  {
    id: '3',
    name: 'Industrial Chassis V1',
    description: 'High-rigidity prototype electronic enclosure with built-in standoff mounts, passive ventilation louvers, and snap-fit lid tolerances.',
    price: 119.00,
    image: '/products/lamp.jpg',
    category: 'Rapid Prototyping',
    stock: 12,
    rating: 4.8,
    reviewsCount: 19,
    leadTime: '48 Hours',
    tolerances: '±0.05 mm',
    material: 'ABS-ESD Flame Retardant'
  },
  {
    id: '4',
    name: 'Monolithic Heavy Bookends',
    description: 'Sculptural architectural bookends featuring hollow infill balanced for high-density ballast fill, engineered for executive suites and design studios.',
    price: 58.00,
    image: '/products/bookends.jpg',
    category: 'Corporate / Bulk Gifting',
    stock: 14,
    rating: 4.9,
    reviewsCount: 27,
    leadTime: '24-48 Hours',
    tolerances: '±0.1 mm',
    material: 'Stone-Filled PLA'
  },
  {
    id: '5',
    name: 'Urban Planning Facade Scale',
    description: 'Micro-detail architectural scale model showcasing micro-mullions, organic canopy curves, and true-to-cad urban elevation detailing.',
    price: 165.00,
    image: '/products/wall-hooks.jpg',
    category: 'Architectural Scale Down Models',
    stock: 7,
    rating: 5.0,
    reviewsCount: 15,
    leadTime: '3-4 Days',
    tolerances: '±0.04 mm',
    material: 'Engineering SLA Tough Resin'
  },
  {
    id: '6',
    name: 'Precision Flexible Couplings',
    description: 'Functional torsion-damping drive coupling set with high shore-hardness elastomer body, tested under cyclic motor vibration up to 4000 RPM.',
    price: 24.00,
    image: '/products/cable-management.jpg',
    category: 'Small Batch Manufacturing',
    stock: 45,
    rating: 4.9,
    reviewsCount: 62,
    leadTime: '24 Hours',
    tolerances: '±0.05 mm',
    material: 'TPU 95A Industrial'
  },
  {
    id: '7',
    name: 'Planetary Gear Reducer Kit',
    description: 'High-torque compound epicyclic gearbox assembly kit. Demonstrates real 4:1 torque amplification with silent-running involute gear teeth.',
    price: 68.00,
    image: '/products/phone-stand.jpg',
    category: 'Education',
    stock: 22,
    rating: 5.0,
    reviewsCount: 41,
    leadTime: '24-48 Hours',
    tolerances: '±0.08 mm',
    material: 'Nylon PA12 / Carbon'
  },
  {
    id: '8',
    name: 'Parametric Fractal Planter',
    description: 'Dual-wall self-aerating botanical vessel based on Voronoi algorithmic geometry. 100% watertight barrier with internal drainage basin.',
    price: 36.00,
    image: '/products/plant-pot.jpg',
    category: 'Interior',
    stock: 30,
    rating: 4.8,
    reviewsCount: 53,
    leadTime: '24 Hours',
    tolerances: '±0.1 mm',
    material: 'Bio-Polymer Matte PLA'
  },
  {
    id: '9',
    name: 'Modular Pen & Caliper Station',
    description: 'Desk instrumentation station designed for engineers and drafters, featuring precision-machined friction fit holes for digital calipers and stylus pens.',
    price: 32.00,
    image: '/products/pen-holder.jpg',
    category: 'Corporate / Bulk Gifting',
    stock: 28,
    rating: 4.9,
    reviewsCount: 39,
    leadTime: '24 Hours',
    tolerances: '±0.1 mm',
    material: 'Recycled Stealth Matte Black PETG'
  },
];

export const categories = [
  'All',
  'Rapid Prototyping',
  'Corporate / Bulk Gifting',
  'Architectural Scale Down Models',
  'Small Batch Manufacturing',
  'Education',
  'Interior',
  'Industrial Parts Manufacturing',
  'Drone & Robotics'
];

export const testimonials = [
  {
    id: 1,
    name: 'Amit Verma',
    role: 'VP Manufacturing, Precision Dynamics',
    avatar: '/avatar1.jpg',
    content: 'The micron tolerances on the functional housings from Saturn3D are exceptional. They eliminated three rounds of CNC re-tooling and sped up our hardware validation by 4 weeks.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Neha Kapoor',
    role: 'Lead Architect, Studio Form',
    avatar: '/avatar2.jpg',
    content: 'We utilized their high-resolution SLA prints for a 1:200 scale urban canopy project. The surface uniformity and sharp edge fidelity blew our client presentation away.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Siddharth Reddy',
    role: 'Robotics Lead, AeroNest',
    avatar: '/avatar3.jpg',
    content: 'Saturn3D is our go-to partner for drone airframes and vibration mounts. Their lightweight Carbon-Fiber reinforced parts deliver aerospace-grade stiffness without the turnaround penalty.',
    rating: 5,
  },
];

export const features = [
  {
    id: 1,
    title: 'Micron-Level Precision',
    description: 'Industrial-grade SLA and high-speed coreXY systems deliver layer resolutions down to 25 microns for flawless mechanical tolerances.',
    icon: 'Award',
  },
  {
    id: 2,
    title: 'Rapid 24-48h Dispatch',
    description: 'Automated slicing and continuous farm production ensure your rapid prototypes ship within hours of file validation.',
    icon: 'Zap',
  },
  {
    id: 3,
    title: 'Aerospace Polymers',
    description: 'Formulated with Carbon Fiber PLA, ESD-safe ABS, engineering Nylon, and optical-clarity resins built for real-world stress.',
    icon: 'Leaf',
  },
];
