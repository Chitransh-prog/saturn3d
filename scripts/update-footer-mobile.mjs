import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve('saturn-3d-main/src/sections/Footer.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Update Mobile Sticky Bar: offset left text so it avoids Netlify badge
const oldSticky = `      {/* Mobile Sticky Bar: "GET A QUOTE" */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2] hairline-t p-3 flex items-center justify-between gap-3 shadow-lg"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="font-mono text-xs font-bold text-[#0B0B0B] pl-2">
          <span>&plusmn;0.04 MM</span> &bull; <span>24H DISPATCH</span>
        </div>
        <button
          onClick={() => navigate('/custom-lab')}
          className="btn-brutal btn-brutal-orange text-xs py-2 px-5 flex items-center gap-1.5 shadow-[2px_2px_0px_#0B0B0B]"
        >
          <span>GET A QUOTE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>`;

const newSticky = `      {/* Mobile Sticky Bar: "GET A QUOTE" */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2] hairline-t py-2 px-3 flex items-center justify-between gap-2 shadow-lg"
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {/* Left specs text: pl-24 gives clearance for Netlify badge injected at bottom-left */}
        <div className="font-mono text-[10px] sm:text-xs font-bold text-[#0B0B0B] pl-28 truncate">
          <span>&plusmn;0.04 MM</span> &bull; <span>24H DISPATCH</span>
        </div>
        <button
          onClick={() => navigate('/custom-lab')}
          className="btn-brutal btn-brutal-orange text-xs py-2 px-4 shrink-0 flex items-center gap-1.5 shadow-[2px_2px_0px_#0B0B0B]"
        >
          <span>GET A QUOTE</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>`;

content = content.replace(oldSticky.replace(/\r?\n/g, '\n'), newSticky);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated Footer.tsx for mobile sticky bar!');

