"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { siteConfig } from "@/config/site";

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header className={`${overlay ? "absolute text-white border-white/30" : "relative text-[#1b100c] border-[#cbb9a6]"} inset-x-0 top-0 z-40 border-b`}>
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-9 lg:px-12">
        <Link href="/" className="font-display text-[1.65rem] tracking-[-0.035em]">House of Veya</Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-8 text-[0.76rem] tracking-[0.1em] lg:flex">
          {siteConfig.nav.map((item) => <Link key={item.href} href={item.href} className="transition-opacity hover:opacity-60">{item.label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/account" className="hidden text-[0.76rem] sm:block">Account</Link>
          <Link href="/start-project" className={`hidden border px-5 py-3 text-[0.7rem] tracking-[0.1em] sm:block ${overlay ? "border-white/70" : "border-[#1b100c]"}`}>Start your project</Link>
          <button type="button" aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)} className={`grid size-11 place-items-center border lg:hidden ${overlay ? "border-white/50" : "border-[#1b100c]"}`}>{open ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile navigation" className="absolute inset-x-0 top-20 border-b border-[#cbb9a6] bg-[#f3ece2] px-5 py-7 text-[#1b100c] shadow-xl lg:hidden">
          <div className="flex flex-col gap-5 font-display text-3xl">
            {siteConfig.nav.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
            <Link href="/estimate" onClick={() => setOpen(false)}>Estimate</Link>
            <Link href="/start-project" onClick={() => setOpen(false)}>Start your project</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
