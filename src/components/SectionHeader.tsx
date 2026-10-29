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
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div className={`space-y-3 mb-10 sm:mb-12 ${isCenter ? 'text-center mx-auto max-w-3xl' : ''} ${className}`}>
      {/* Numbered Tag & Stamp */}
      <div className={`flex flex-wrap items-center gap-2.5 ${isCenter ? 'justify-center' : 'justify-start'}`}>
        <span className="inline-flex items-center gap-2 px-3 py-1 bg-black/[0.04] text-muted-dark border hairline rounded-full font-mono text-[11px] font-medium uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-saturn-orange" />
          <span>{number} // {tag}</span>
        </span>
        {badgeText && (
          <span className="precision-badge font-mono text-[10px] text-saturn-orange bg-saturn-orange/10 border border-saturn-orange/20 px-2.5 py-0.5 rounded-full">
            {badgeText}
          </span>
        )}
      </div>

      {/* Primary Display Title */}
      <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-graphite leading-tight">
        {highlightWord && title.toLowerCase().includes(highlightWord.toLowerCase()) ? (
          <>
            {title.slice(0, title.toLowerCase().indexOf(highlightWord.toLowerCase()))}
            <span className="text-saturn-orange">
              {title.slice(
                title.toLowerCase().indexOf(highlightWord.toLowerCase()),
                title.toLowerCase().indexOf(highlightWord.toLowerCase()) + highlightWord.length
              )}
            </span>
            {title.slice(title.toLowerCase().indexOf(highlightWord.toLowerCase()) + highlightWord.length)}
          </>
        ) : (
          title
        )}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="font-body text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
