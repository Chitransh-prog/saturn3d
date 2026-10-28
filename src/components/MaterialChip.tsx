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
      className={`border-3 border-ink px-4 py-2.5 rounded-xs font-mono-tech text-xs sm:text-sm font-bold uppercase transition-all flex items-center justify-between gap-3 cursor-pointer text-left ${
        isActive
          ? 'bg-[#FF5A1F] text-[#0B0B0B] shadow-brutal translate-x-[-2px] translate-y-[-2px]'
          : 'bg-white text-[#0B0B0B] hover:bg-[#FFE14D]/40 shadow-brutal-sm hover:shadow-brutal hover:translate-x-[-1px] hover:translate-y-[-1px]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="w-3.5 h-3.5 rounded-none border-2 border-ink shrink-0 inline-block"
          style={{ backgroundColor: colorHex }}
        />
        <div>
          <div className="leading-tight">{name}</div>
          {type && <div className="text-[10px] opacity-75 font-normal">{type}</div>}
        </div>
      </div>
      <div className={`px-1.5 py-0.5 border border-ink text-xs font-bold shrink-0 ${isActive ? 'bg-[#0B0B0B] text-white' : 'bg-[#FFF4E0] text-[#0B0B0B]'}`}>
        {price}
      </div>
    </button>
  );
}
