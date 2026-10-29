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

    // Fast ramp 0 to 100% in 1.6s
    tl.to(obj, {
      progress: 100,
      duration: 1.6,
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

    gsap.to(curtainRef.current, {
      yPercent: -100,
      duration: 0.6,
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
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0B0D10] text-[#F5F6F8] select-none font-body"
      role="dialog"
      aria-label="Saturn 3D Precision Lab Initialization"
      aria-live="polite"
    >
      {/* Skip button in top corner */}
      <button
        onClick={skipPreloader}
        className="absolute top-6 right-6 z-50 flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-white/60 hover:text-white transition-colors border border-white/10 hover:border-white/30 rounded-lg cursor-pointer"
      >
        <FastForward className="w-3.5 h-3.5 text-[#FF5A1F]" />
        <span>Skip [Esc]</span>
      </button>

      <div ref={containerRef} className="flex flex-col items-center text-center px-6 max-w-md w-full">
        {/* Silhouette Slicing Preview */}
        <div className="relative w-32 h-44 sm:w-36 sm:h-50 mb-8 flex items-center justify-center">
          <svg
            viewBox="0 0 100 130"
            className="w-full h-full stroke-white/10 fill-transparent stroke-[1.5]"
          >
            <path d="M42 10 L58 10 L62 24 L76 34 L74 60 L66 68 L66 100 L76 122 L62 122 L54 102 L46 102 L38 122 L24 122 L34 100 L34 68 L26 60 L24 34 L38 24 Z" />
            <line x1="44" y1="20" x2="56" y2="20" stroke="#333" strokeWidth="1.5" />
            <ellipse cx="50" cy="62" rx="46" ry="14" stroke="#333" strokeWidth="1" />
          </svg>

          {/* Sliced Layer Rising */}
          <div
            className="absolute inset-0 overflow-hidden flex items-end justify-center transition-all duration-75"
            style={{ height: `${percent}%`, bottom: 0, top: 'auto' }}
          >
            <div className="w-32 h-44 sm:w-36 sm:h-50 relative shrink-0">
              <svg
                viewBox="0 0 100 130"
                className="w-full h-full stroke-[#FF5A1F] fill-[#FF5A1F]/20 stroke-[1.8]"
              >
                <path d="M42 10 L58 10 L62 24 L76 34 L74 60 L66 68 L66 100 L76 122 L62 122 L54 102 L46 102 L38 122 L24 122 L34 100 L34 68 L26 60 L24 34 L38 24 Z" />
                <line x1="44" y1="20" x2="56" y2="20" stroke="#FF5A1F" strokeWidth="2" />
                <ellipse cx="50" cy="62" rx="46" ry="14" stroke="#FF5A1F" strokeWidth="1.5" />
              </svg>
              <div
                className="absolute left-0 right-0 h-[2px] bg-[#FF5A1F] shadow-[0_0_10px_#FF5A1F]"
                style={{ top: 0 }}
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="font-display text-lg sm:text-xl font-semibold text-white mb-1 tracking-tight">
          Saturn 3D Precision Lab
        </h2>

        {/* Subtitle */}
        <p className="font-mono text-xs text-white/50 tracking-wider mb-5">
          Initializing telemetry & slicing engine...
        </p>

        {/* Live % and Progress Bar */}
        <div className="w-full max-w-xs space-y-2">
          <div className="flex justify-between font-mono text-xs text-white/70">
            <span>Layer {Math.round((percent / 100) * 320)} / 320</span>
            <span className="text-[#FF5A1F] font-semibold">{percent}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
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
