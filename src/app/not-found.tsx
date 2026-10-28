'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full bg-paper border-4 border-ink p-8 shadow-brutal text-center">
        <div className="w-16 h-16 bg-saturn-orange border-3 border-ink flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_#0B0B0B]">
          <Compass className="w-8 h-8 text-ink animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div className="font-mono text-xs uppercase tracking-wider text-ink/60 mb-2">Error 404 // Orbit Lost</div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-ink uppercase mb-4 tracking-tight">
          Sector Not Found
        </h1>
        <p className="text-ink/80 text-sm mb-6 font-mono leading-relaxed">
          The coordinate or component model you are looking for does not exist in the current Saturn 3D matrix.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-saturn-yellow border-3 border-ink font-mono text-sm uppercase font-bold tracking-wider hover:bg-saturn-orange transition-colors shadow-[4px_4px_0px_#0B0B0B] active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Base
        </Link>
      </div>
    </div>
  );
}
