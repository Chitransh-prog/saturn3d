import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light' | 'white' | 'orange';
  showText?: boolean;
}

export default function Logo({ className = '', variant = 'dark' }: LogoProps) {
  // If the consumer passes custom sizing classes (e.g. h-9, h-6), adapt smoothly
  const hasHeight = /\bh-\w+/.test(className);

  const src =
    variant === 'light' || variant === 'white'
      ? '/logo-white.png'
      : variant === 'orange'
      ? '/logo-orange.png'
      : '/logo.png';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={src}
        alt="Saturn 3D Printing Company"
        className={`${hasHeight ? 'h-full' : 'h-8 sm:h-9'} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
      />
    </div>
  );
}
