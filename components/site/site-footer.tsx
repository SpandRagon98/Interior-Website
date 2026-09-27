import Link from "next/link";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="bg-[#1b100c] px-5 pb-7 pt-20 text-[#eadfd3] sm:px-9 lg:px-12">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid gap-14 border-b border-white/20 pb-16 lg:grid-cols-[1.4fr_.6fr_.6fr]">
          <div>
            <p className="font-display text-[clamp(3.5rem,7vw,7rem)] leading-none tracking-[-0.05em]">House of Veya</p>
            <p className="mt-6 max-w-md text-base leading-7 text-white/60">Bespoke interiors shaped by architecture, craft and the way you live.</p>
          </div>
          <div className="space-y-3 text-sm">
            <p className="mb-5 text-white/45">Visit</p>
            {[...siteConfig.nav, { label: "Estimate", href: "/estimate" }, { label: "Contact", href: "/contact" }].map((item) => <Link className="block" key={item.href} href={item.href}>{item.label}</Link>)}
          </div>
          <div className="space-y-3 text-sm">
            <p className="mb-5 text-white/45">Begin</p>
            <Link className="block" href="/start-project">Start your project</Link>
            <a className="block" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            <a className="block" href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}>{siteConfig.phone}</a>
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} House of Veya. All rights reserved.</p>
          <div className="flex gap-5"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
        </div>
      </div>
    </footer>
  );
}
