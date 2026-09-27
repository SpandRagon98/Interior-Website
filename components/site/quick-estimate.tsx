"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { calculateEstimate, formatInr, type FinishLevel } from "@/config/pricing";

export function QuickEstimate() {
  const [area, setArea] = useState(1500);
  const [finish, setFinish] = useState<FinishLevel>("Premium");
  const result = useMemo(() => calculateEstimate({ city: "Kolkata", propertyType: "Apartment", bhk: "3 BHK", carpetArea: area, rooms: ["Full Home"], kitchen: true, wardrobes: 3, furniture: true, falseCeiling: true, flooring: false, finishLevel: finish }), [area, finish]);
  return (
    <div className="grid overflow-hidden bg-[#23140f] text-[#f5eee5] lg:grid-cols-[1fr_1fr]">
      <div className="p-7 sm:p-12 lg:p-16">
        <h3 className="font-display text-5xl leading-[.95] tracking-[-.04em] sm:text-6xl">A first sense<br />of your investment.</h3>
        <p className="mt-6 max-w-md leading-7 text-white/60">Adjust the essentials for an indicative full-home range. Your design consultation refines it.</p>
      </div>
      <div className="border-t border-white/15 p-7 sm:p-12 lg:border-l lg:border-t-0 lg:p-16">
        <label className="block text-sm text-white/65" htmlFor="quick-area">Carpet area — {area.toLocaleString("en-IN")} sq ft</label>
        <input id="quick-area" className="mt-4 w-full accent-[#bd6745]" type="range" min="600" max="5000" step="100" value={area} onChange={(e) => setArea(Number(e.target.value))} />
        <div className="mt-9 flex flex-wrap gap-2" role="group" aria-label="Finish level">
          {(["Essential", "Premium", "Luxury"] as FinishLevel[]).map((item) => <button type="button" key={item} onClick={() => setFinish(item)} className={`border px-4 py-3 text-sm ${finish === item ? "border-[#bd6745] bg-[#bd6745]" : "border-white/25"}`}>{item}</button>)}
        </div>
        <p className="mt-10 text-sm text-white/45">Indicative interior range</p>
        <p className="mt-2 font-display text-[clamp(2.25rem,4.2vw,4rem)] leading-none">{formatInr(result.low)}–{formatInr(result.high)}</p>
        <Link className="mt-8 inline-block border-b border-white/70 pb-1 text-sm" href="/estimate">Build a detailed estimate</Link>
      </div>
    </div>
  );
}
