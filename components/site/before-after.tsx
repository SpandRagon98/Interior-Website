"use client";

import Image from "next/image";
import { useState } from "react";

export function BeforeAfter() {
  const [position, setPosition] = useState(54);
  return (
    <div className="relative aspect-[16/9] min-h-[390px] overflow-hidden bg-[#cbb9a6]">
      <Image src="/images/hero-living.png" alt="Completed warm contemporary living room" fill sizes="(max-width: 1024px) 100vw, 80vw" className="object-cover" />
      <div className="absolute inset-0 overflow-hidden grayscale" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <Image src="/images/hero-living.png" alt="Living room before material and colour styling" fill sizes="(max-width: 1024px) 100vw, 80vw" className="object-cover brightness-[.7] contrast-[.72]" />
        <div className="absolute inset-0 bg-[#70675f]/35" />
      </div>
      <div className="absolute inset-y-0 w-px bg-white" style={{ left: `${position}%` }} />
      <span className="absolute left-4 top-4 bg-[#1b100c]/80 px-3 py-2 text-xs text-white">Before</span>
      <span className="absolute right-4 top-4 bg-[#1b100c]/80 px-3 py-2 text-xs text-white">After</span>
      <label className="sr-only" htmlFor="transformation">Compare before and after</label>
      <input id="transformation" type="range" min="10" max="90" value={position} onChange={(e) => setPosition(Number(e.target.value))} className="absolute inset-x-4 bottom-5 z-10 accent-[#a44928]" />
    </div>
  );
}
