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
    <div className={`card-slab p-1 bg-white overflow-x-auto ${className}`}>
      <table className="raw-table">
        <thead>
          <tr>
            <th>PROCESS</th>
            <th>ENGINEERING MATERIAL</th>
            <th>TOLERANCE</th>
            <th>BUILD ENVELOPE</th>
            <th>YIELD STRENGTH</th>
            <th>STARTING RATE</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx}>
              <td className="font-bold text-[#0B0B0B]">{row.process}</td>
              <td className="font-bold text-[#FF5A1F]">{row.material}</td>
              <td className="font-mono-tech">{row.tolerance}</td>
              <td className="font-mono-tech">{row.envelope}</td>
              <td className="font-mono-tech">{row.strength}</td>
              <td className="font-mono-tech font-bold text-[#0B0B0B] bg-[#FFE14D]/30">{row.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
