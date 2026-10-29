import React from 'react';

export interface SpecRow {
  process: string;
  material: string;
  tolerance: string;
  envelope: string;
  strength: string;
  rate: string;
}

interface SpecTableProps {
  rows?: SpecRow[];
  className?: string;
}

const defaultRows: SpecRow[] = [
  {
    process: 'Industrial FDM',
    material: 'PLA / PETG (Matte Engineering)',
    tolerance: '±0.08 mm',
    envelope: '350 × 350 × 400 mm',
    strength: '55 MPa',
    rate: '₹3.50 – ₹5.00 / g',
  },
  {
    process: 'FDM Composite',
    material: 'Carbon-X PA12 (Chopped Carbon Fiber)',
    tolerance: '±0.05 mm',
    envelope: '300 × 300 × 350 mm',
    strength: '115 MPa',
    rate: '₹25.00 / g',
  },
  {
    process: 'Ultra SLA Resin',
    material: 'Engineering Tough / Clear High-Def',
    tolerance: '±0.02 mm',
    envelope: '218 × 123 × 250 mm',
    strength: '68 MPa',
    rate: '₹18.00 / ml',
  },
  {
    process: 'Flame Retardant FDM',
    material: 'ABS-ESD (Static Dissipative)',
    tolerance: '±0.05 mm',
    envelope: '300 × 300 × 300 mm',
    strength: '45 MPa',
    rate: '₹8.00 / g',
  },
  {
    process: 'Elastomer FDM',
    material: 'TPU 95A Industrial Flexible',
    tolerance: '±0.10 mm',
    envelope: '250 × 250 × 250 mm',
    strength: 'Shore 95A',
    rate: '₹8.50 / g',
  },
];

export default function SpecTable({ rows = defaultRows, className = '' }: SpecTableProps) {
  return (
    <div className={`card-precision bg-white p-0 overflow-x-auto border hairline ${className}`}>
      <table className="w-full text-left font-mono text-xs">
        <thead className="bg-studio-light/60 border-b hairline">
          <tr>
            <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-muted">Process</th>
            <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-muted">Engineering Material</th>
            <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-muted">Tolerance</th>
            <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-muted">Build Envelope</th>
            <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-muted">Yield Strength</th>
            <th className="px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-muted">Starting Rate</th>
          </tr>
        </thead>
        <tbody className="divide-y hairline">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-studio-light/30 transition-colors">
              <td className="px-5 py-3.5 font-medium text-graphite">{row.process}</td>
              <td className="px-5 py-3.5 font-medium text-saturn-orange">{row.material}</td>
              <td className="px-5 py-3.5 text-muted">{row.tolerance}</td>
              <td className="px-5 py-3.5 text-muted">{row.envelope}</td>
              <td className="px-5 py-3.5 text-muted">{row.strength}</td>
              <td className="px-5 py-3.5 font-semibold text-graphite bg-black/[0.02]">{row.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
