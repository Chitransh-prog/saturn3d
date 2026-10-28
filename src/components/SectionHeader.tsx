import React from 'react';

interface SectionHeaderProps {
  number: string;
  tag: string;
  title: string;
  subtitle?: string;
  highlightWord?: string;
  align?: 'left' | 'center';
  badgeText?: string;
  badgeColor?: string;
  className?: string;
}

export default function SectionHeader({
  number,
  tag,
  title,
  subtitle,
  highlightWord,
  align = 'left',
  badgeText,
  badgeColor = '#FFE14D',
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div className={`space-y-4 mb-10 sm:mb-14 ${isCenter ? 'text-center mx-auto max-w-3xl' : ''} ${className}`}>
      {/* Numbered Tag & Stamp */}
      <div className={`flex flex-wrap items-center gap-3 ${isCenter ? 'justify-center' : 'justify-start'}`}>
        <span className="section-tag">
          {number} // {tag}
        </span>
        {badgeText && (
          <span
            className="badge-sticker"
            style={{ backgroundColor: badgeColor }}
          >
            {badgeText}
          </span>
        )}
      </div>

      {/* Primary Display Title */}
      <h2 className="text-3xl sm:text-5xl lg:text-6xl font-display font-black uppercase tracking-tight text-[#0B0B0B] leading-[0.95]">
        {highlightWord && title.includes(highlightWord) ? (
          <>
            {title.split(highlightWord)[0]}
            <span className="text-[#FF5A1F] inline-block px-1 bg-[#0B0B0B] text-white mx-1 transform -rotate-1">
              {highlightWord}
            </span>
            {title.split(highlightWord)[1]}
          </>
        ) : (
          title
        )}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className={`font-body text-base sm:text-lg text-[#222222] font-medium leading-relaxed max-w-2xl ${isCenter ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
