import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FastForward } from 'lucide-react';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [percent, setPercent] = useState(0);
  const [visible, setVisible] = useState(true);
  const curtainRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    // Check if previously seen in this session or prefers reduced motion
    const seen = sessionStorage.getItem('saturn_preloader_seen') === 'true';
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (seen || reducedMotion) {
      setVisible(false);
      onComplete?.();
      return;
    }

    const obj = { progress: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        finishPreloader();
      },
    });
    timelineRef.current = tl;

    // Fast loading ramp: 0 to 100% in 1.9 seconds
    tl.to(obj, {
      progress: 100,
      duration: 1.9,
      ease: 'power2.out',
      onUpdate: () => {
        setPercent(Math.round(obj.progress));
      },
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skipPreloader();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      tl.kill();
    };
  }, []);

  const finishPreloader = () => {
    sessionStorage.setItem('saturn_preloader_seen', 'true');
    if (!curtainRef.current) {
      setVisible(false);
      onComplete?.();
      return;
    }

    // Vertical curtain exit: ink pulls upwards to reveal paper
    gsap.to(curtainRef.current, {
      yPercent: -100,
      duration: 0.65,
      ease: 'expo.inOut',
      onComplete: () => {
        setVisible(false);
        onComplete?.();
      },
    });
  };

  const skipPreloader = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    finishPreloader();
  };

  if (!visible) return null;

  return (
    <div
      ref={curtainRef}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0B0B0B] text-[#FAF7F2] select-none"
      role="dialog"
      aria-label="Saturn 3D Loading Screen"
      aria-live="polite"
    >
      {/* Skip button in top corner */}
      <button
        onClick={skipPreloader}
        className="absolute top-6 right-6 z-50 flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#FAF7F2]/70 hover:text-[#FF5A1F] transition-colors border border-white/20 hover:border-[#FF5A1F]"
      >
        <FastForward className="w-3.5 h-3.5" />
        <span>SKIP [ESC]</span>
      </button>

      <div ref={containerRef} className="flex flex-col items-center text-center px-6 max-w-md w-full">
        {/* Mecha Silhouette with Bottom-to-Top Slicing Layer Fill */}
        <div className="relative w-36 h-48 sm:w-44 sm:h-56 mb-8 flex items-center justify-center">
          {/* Background mecha outline (faint) */}
          <svg
            viewBox="0 0 100 130"
            className="w-full h-full stroke-[#333333] fill-transparent stroke-[1.5]"
          >
            {/* Mecha stylized silhouette */}
            <path d="M42 10 L58 10 L62 24 L76 34 L74 60 L66 68 L66 100 L76 122 L62 122 L54 102 L46 102 L38 122 L24 122 L34 100 L34 68 L26 60 L24 34 L38 24 Z" />
            {/* Visor line */}
            <line x1="44" y1="20" x2="56" y2="20" stroke="#555" strokeWidth="2" />
            {/* Saturn ring around torso */}
            <ellipse cx="50" cy="62" rx="46" ry="14" stroke="#444" strokeWidth="1.5" />
          </svg>

          {/* Masked filled mecha layer rising bottom-to-top */}
          <div
            className="absolute inset-0 overflow-hidden flex items-end justify-center transition-all duration-75"
            style={{ height: `${percent}%`, bottom: 0, top: 'auto' }}
          >
            <div className="w-36 h-48 sm:w-44 sm:h-56 relative shrink-0">
              <svg
                viewBox="0 0 100 130"
                className="w-full h-full stroke-[#FF5A1F] fill-[#FF5A1F]/30 stroke-[2]"
              >
                <path d="M42 10 L58 10 L62 24 L76 34 L74 60 L66 68 L66 100 L76 122 L62 122 L54 102 L46 102 L38 122 L24 122 L34 100 L34 68 L26 60 L24 34 L38 24 Z" />
                <line x1="44" y1="20" x2="56" y2="20" stroke="#FFE14D" strokeWidth="2.5" />
                <ellipse cx="50" cy="62" rx="46" ry="14" stroke="#FF5A1F" strokeWidth="2" />
              </svg>
              {/* Laser slicing horizon bar */}
              <div
                className="absolute left-0 right-0 h-[2px] bg-[#FFE14D] shadow-[0_0_8px_#FFE14D]"
                style={{ top: 0 }}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-mono text-xl sm:text-2xl font-black uppercase tracking-wider text-[#FAF7F2] mb-2">
          PRINTING SATURN...
        </h2>

        {/* Subtitle */}
        <p className="font-mono text-xs text-[#FAF7F2]/60 tracking-widest uppercase mb-4">
          Warming the nozzle, slicing layers
        </p>

        {/* Live % and Progress Bar */}
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between font-mono text-xs text-[#FF5A1F] font-bold">
            <span>LAYER {Math.round((percent / 100) * 320)} / 320</span>
            <span>{percent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#222222] rounded-xs overflow-hidden">
            <div
              className="h-full bg-[#FF5A1F] transition-all duration-75"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
