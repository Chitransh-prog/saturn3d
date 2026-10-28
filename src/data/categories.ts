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
    description: 'Transform ideas into physical reality with extreme speed and precision.',
    icon: Zap,
    color: 'bg-blue-500/10 text-blue-500',
    borderColor: 'hover:border-blue-500/50'
  },
  {
    title: 'Corporate / Bulk Gifting',
    slug: 'corporate-bulk-gifting',
    description: 'Exclusive custom-branded solutions for corporate events and team recognition.',
    icon: Gift,
    color: 'bg-purple-500/10 text-purple-500',
    borderColor: 'hover:border-purple-500/50'
  },
  {
    title: 'Marriage Gifts',
    slug: 'marriage-gifts',
    description: 'Bespoke, personalized keepsakes that capture your most precious moments.',
    icon: Heart,
    color: 'bg-rose-500/10 text-rose-500',
    borderColor: 'hover:border-rose-500/50'
  },
  {
    title: 'Architectural Scale Down Models',
    slug: 'architectural-scale-down-models',
    description: 'Stunningly detailed scale-down models for urban planning and real estate.',
    icon: Building2,
    color: 'bg-amber-500/10 text-amber-500',
    borderColor: 'hover:border-amber-500/50'
  },
  {
    title: 'Small Batch Manufacturing',
    slug: 'small-batch-manufacturing',
    description: 'Bridging the gap between prototyping and mass industrial production.',
    icon: Factory,
    color: 'bg-slate-500/10 text-slate-500',
    borderColor: 'hover:border-slate-500/50'
  },
  {
    title: 'Education',
    slug: 'education',
    description: 'Empowering the next generation of engineers with tactile learning tools.',
    icon: BookOpen,
    color: 'bg-emerald-500/10 text-emerald-500',
    borderColor: 'hover:border-emerald-500/50'
  },
  {
    title: 'Interior',
    slug: 'interior',
    description: 'Custom art pieces and functional components for modern living spaces.',
    icon: Layout,
    color: 'bg-cyan-500/10 text-cyan-500',
    borderColor: 'hover:border-cyan-500/50'
  },
  {
    title: 'Industrial Parts Manufacturing',
    slug: 'industrial-parts-manufacturing',
    description: 'Functional, high-strength components for assembly and maintenance.',
    icon: Settings,
    color: 'bg-orange-500/10 text-orange-500',
    borderColor: 'hover:border-orange-500/50'
  },
  {
    title: 'Drone & Robotics',
    slug: 'drone-robotics',
    description: 'Lightweight, durable specialized components for advanced tech platforms.',
    icon: Cpu,
    color: 'bg-indigo-500/10 text-indigo-500',
    borderColor: 'hover:border-indigo-500/50'
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
