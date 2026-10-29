import { 
  Zap, 
  Gift, 
  Heart, 
  Building2, 
  Factory, 
  BookOpen, 
  Layout, 
  Settings, 
  Cpu,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Category {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  borderColor: string;
  slug: string;
  image?: string;
  badge?: string;
  leadTime?: string;
}

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

export const unslugify = (slug: string) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const categories: Category[] = [
  {
    title: 'Rapid Prototyping',
    slug: 'rapid-prototyping',
    description: 'Transform CAD concepts into functional, high-precision physical reality with overnight turnaround and micron-level accuracy.',
    icon: Zap,
    color: 'bg-blue-500/10 text-blue-500',
    borderColor: 'hover:border-blue-500/50',
    image: '/products/pen-holder.jpg',
    badge: 'Functional SLA & FDM',
    leadTime: '24–48 Hours',
  },
  {
    title: 'Corporate / Bulk Gifting',
    slug: 'corporate-bulk-gifting',
    description: 'Exclusive custom-branded executive solutions, desk organizers, and trophy keepsakes for corporate conferences and team recognition.',
    icon: Gift,
    color: 'bg-purple-500/10 text-purple-500',
    borderColor: 'hover:border-purple-500/50',
    image: '/products/organizer.jpg',
    badge: 'Custom Logo Engraved',
    leadTime: 'Volume Batch 48h',
  },
  {
    title: 'Marriage Gifts',
    slug: 'marriage-gifts',
    description: 'Bespoke, personalized architectural keepsakes, custom lithophanes, and sculpted bookends that preserve life’s most precious celebrations.',
    icon: Heart,
    color: 'bg-rose-500/10 text-rose-500',
    borderColor: 'hover:border-rose-500/50',
    image: '/products/bookends.jpg',
    badge: 'Personalized Keepsakes',
    leadTime: 'Bespoke 48h',
  },
  {
    title: 'Architectural Scale Down Models',
    slug: 'architectural-scale-down-models',
    description: 'Stunningly detailed scale elevation models, topography reliefs, and massing blocks for urban planning and real estate exhibits.',
    icon: Building2,
    color: 'bg-amber-500/10 text-amber-500',
    borderColor: 'hover:border-amber-500/50',
    image: '/products/wall-hooks.jpg',
    badge: '1:100 / 1:500 Scale',
    leadTime: '48–72 Hours',
  },
  {
    title: 'Small Batch Manufacturing',
    slug: 'small-batch-manufacturing',
    description: 'Bridge manufacturing from 10 to 5,000+ units. Zero injection tooling cost with end-use certified engineering polymers.',
    icon: Factory,
    color: 'bg-slate-500/10 text-slate-500',
    borderColor: 'hover:border-slate-500/50',
    image: '/products/cable-management.jpg',
    badge: 'Zero Tooling MOQ',
    leadTime: '10–5,000 Units',
  },
  {
    title: 'Education',
    slug: 'education',
    description: 'Empowering engineering schools, university labs, and STEM students with tactile mechanical models, gear assemblies, and botanical kits.',
    icon: BookOpen,
    color: 'bg-emerald-500/10 text-emerald-500',
    borderColor: 'hover:border-emerald-500/50',
    image: '/products/plant-pot.jpg',
    badge: 'STEAM & Biology Kits',
    leadTime: '24 Hours',
  },
  {
    title: 'Interior',
    slug: 'interior',
    description: 'Parametric vases, fractal lighting fixtures, and architectural living decor fabricated in sustainable bio-polymers and silk finishes.',
    icon: Layout,
    color: 'bg-cyan-500/10 text-cyan-500',
    borderColor: 'hover:border-cyan-500/50',
    image: '/products/vase.jpg',
    badge: 'Watertight Spiral PLA',
    leadTime: '24 Hours',
  },
  {
    title: 'Industrial Parts Manufacturing',
    slug: 'industrial-parts-manufacturing',
    description: 'Functional, high-strength replacement components, motor mounts, gearbox clusters, and factory assembly jigs.',
    icon: Settings,
    color: 'bg-orange-500/10 text-orange-500',
    borderColor: 'hover:border-orange-500/50',
    image: '/products/phone-stand.jpg',
    badge: 'ABS-ESD Flame Retardant',
    leadTime: '24–48 Hours',
  },
  {
    title: 'Drone & Robotics',
    slug: 'drone-robotics',
    description: 'Lightweight, ultra-durable carbon-fiber drone motor arms, sensor housings, and multi-axis compliant robotic grippers.',
    icon: Cpu,
    color: 'bg-indigo-500/10 text-indigo-500',
    borderColor: 'hover:border-indigo-500/50',
    image: '/products/lamp.jpg',
    badge: 'Carbon-X PA12-CF',
    leadTime: '24–48 Hours',
  }
];

export const getCategoryMetadata = (title: string): Partial<Category> => {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('sensor')) return { icon: Layout, color: 'bg-emerald-500/10 text-emerald-500' };
  if (lowerTitle.includes('power')) return { icon: Zap, color: 'bg-amber-500/10 text-amber-500' };
  if (lowerTitle.includes('motor')) return { icon: Settings, color: 'bg-blue-500/10 text-blue-500' };
  if (lowerTitle.includes('controller')) return { icon: Cpu, color: 'bg-indigo-500/10 text-indigo-500' };
  return { icon: Factory, color: 'bg-slate-500/10 text-slate-500' };
};
