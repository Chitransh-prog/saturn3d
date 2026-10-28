import React from 'react';

interface StatBlockProps {
  value: string;
  label: string;
  sublabel?: string;
  badge?: string;
  color?: string;
  className?: string;
}

export default function StatBlock({
  value,
  label,
  sublabel,
  badge,
  color = '#FFFFFF',
  className = '',
}: StatBlockProps) {
  return (
    <div
      className={`card-slab p-6 relative overflow-hidden flex flex-col justify-between ${className}`}
      style={{ backgroundColor: color }}
    >
      {badge && (
        <span className="badge-sticker absolute top-3 right-3 text-[10px] py-0.5 px-2 bg-[#FFE14D]">
          {badge}
        </span>
      )}

      <div>
        <div className="font-display font-black text-4xl sm:text-6xl text-[#0B0B0B] tracking-tight leading-none">
          {value}
        </div>
        <div className="font-mono-tech text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0B0B0B] mt-2">
          {label}
        </div>
      </div>

      {sublabel && (
        <div className="mt-4 pt-3 border-t-2 border-ink text-xs font-mono-tech text-[#555555]">
          {sublabel}
        </div>
      )}
    </div>
  );
}
