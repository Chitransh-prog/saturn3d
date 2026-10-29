import React from 'react';
import { Star, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  city: string;
  rating: number;
  quote: string;
  project: string;
  turnaround: string;
}

const testimonials: TestimonialItem[] = [
  {
    id: '1',
    name: 'Aditya Vardhan',
    role: 'Lead Aerodynamics Engineer',
    company: 'SkyDrive Robotics (UAS R&D)',
    city: 'Bengaluru',
    rating: 5,
    quote: 'The Carbon-X PA12 motor arms delivered within 36 hours. Dimensional deviation on our CMM bench was below 0.03 mm across all 8 mounting points. Replaced machined 6061 aluminium with zero structural resonance.',
    project: 'Carbon-X Drone Spars',
    turnaround: '36h Dispatch',
  },
  {
    id: '2',
    name: 'Dr. Neha Sharma',
    role: 'Biomedical Prototyping Fellow',
    company: 'AIIMS Bhopal Dental & Orthotics Cell',
    city: 'Bhopal',
    rating: 5,
    quote: 'Saturn 3D 12K optical SLA resin parts had flawless sub-surface clarity with zero post-processing layer artifacts. Ideal for anatomical study guides and patient-specific surgical verification.',
    project: 'Optical Surgical Guides',
    turnaround: '24h Dispatch',
  },
  {
    id: '3',
    name: 'Rohit Kulkarni',
    role: 'Automation Assembly Manager',
    company: 'Indore Precision Conveyors',
    city: 'Indore',
    rating: 5,
    quote: 'Our automated packaging lines needed 80 custom PETG positioning blocks. Saturn 3D delivered the pilot batch in 48 hours without expensive tooling lead times. Repeatability was exceptional.',
    project: 'PETG Assembly Jigs',
    turnaround: '48h Dispatch',
  },
];

export default function Testimonials() {
  return (
    <div className="space-y-8 font-body">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-black/10">
        <div>
          <span className="type-mono-eyebrow text-[#5B616B]">
            Client Verification
          </span>
          <h3 className="type-h3 text-[#0B0D10] mt-1">
            Engineered trust across manufacturing hubs.
          </h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-[#5B616B]">
          <span className="flex text-[#FF5A1F]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </span>
          <span className="font-semibold text-[#0B0D10]">5.0 / 5.0</span>
          <span>&bull; Verified Engineering Reviews</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="card-precision p-6 flex flex-col justify-between hover:border-[#FF5A1F]/30"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex text-[#FF5A1F]">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="precision-badge text-[10px]">
                  {t.turnaround}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#5B616B] leading-relaxed italic">
                &ldquo;{t.quote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-black/5 mt-5">
              <div className="font-semibold text-xs text-[#0B0D10]">
                {t.name}
              </div>
              <div className="text-[11px] text-[#5B616B]">
                {t.role} &bull; {t.company}
              </div>
              <div className="font-mono text-[10px] text-[#FF5A1F] mt-1">
                Project: {t.project}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
