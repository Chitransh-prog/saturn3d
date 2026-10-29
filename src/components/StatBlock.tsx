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
  className = '',
}: StatBlockProps) {
  return (
    <div
      className={`card-precision bg-white p-6 relative overflow-hidden flex flex-col justify-between border hairline shadow-precision-sm ${className}`}
    >
      {badge && (
        <span className="precision-badge absolute top-3.5 right-3.5 text-[10px] py-0.5 px-2 bg-studio-light text-muted-dark border hairline rounded-full font-mono">
          {badge}
        </span>
      )}

      <div>
        <div className="font-display font-semibold text-3xl sm:text-4xl text-graphite tracking-tight leading-none">
          {value}
        </div>
        <div className="font-mono text-xs font-medium uppercase tracking-wider text-muted mt-2">
          {label}
        </div>
      </div>

      {sublabel && (
        <div className="mt-4 pt-3 border-t hairline text-xs font-body text-muted leading-relaxed">
          {sublabel}
        </div>
      )}
    </div>
  );
}
