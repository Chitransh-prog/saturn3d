'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-20 font-body">
      <div className="max-w-md w-full card-precision-dark p-8 sm:p-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 text-[#FF5A1F]">
          <Compass className="w-7 h-7 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <div className="type-mono-eyebrow text-white/50 mb-2">Error 404 // Coordinate Out of Bounds</div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white mb-3">
          Coordinate Not Found
        </h1>
        <p className="text-[#A3A9B3] text-xs sm:text-sm mb-6 leading-relaxed">
          The component specification or route you requested does not exist in the active Saturn 3D manufacturing database.
        </p>
        <Link
          href="/"
          className="btn-precision-primary text-xs py-2.5 px-5 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Main Lab
        </Link>
      </div>
    </div>
  );
}
