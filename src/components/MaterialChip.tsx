import React from 'react';

interface MaterialChipProps {
  id: string;
  name: string;
  price: string;
  type?: string;
  colorHex?: string;
  isActive: boolean;
  onClick: () => void;
}

export default function MaterialChip({
  name,
  price,
  type,
  colorHex = '#FF5A1F',
  isActive,
  onClick,
}: MaterialChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer text-left select-none ${
        isActive
          ? 'bg-graphite text-white border-graphite shadow-precision-xs'
          : 'bg-white text-graphite border hairline hover:border-black/25 hover:bg-studio-light/40'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="w-3 h-3 rounded-full border hairline shrink-0 inline-block"
          style={{ backgroundColor: colorHex }}
        />
        <div>
          <div className="leading-tight font-display font-medium">{name}</div>
          {type && <div className="text-[10px] text-muted font-normal mt-0.5">{type}</div>}
        </div>
      </div>
      <div className={`px-2 py-0.5 rounded-md text-[11px] font-mono shrink-0 border ${
        isActive ? 'bg-white/10 text-white border-white/20' : 'bg-studio-light text-muted-dark border hairline'
      }`}>
        {price}
      </div>
    </button>
  );
}
