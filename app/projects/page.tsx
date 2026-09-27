import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { projects } from "@/data/projects";

export const metadata: Metadata = { title: "Projects", description: "Explore completed House of Veya homes across India." };

export default function ProjectsPage() {
  return <main><SiteHeader /><section className="px-5 pb-24 pt-20 sm:px-9 lg:px-12 lg:pb-32 lg:pt-28"><div className="mx-auto max-w-[1500px]"><div className="grid gap-8 border-b border-[#a89380] pb-12 lg:grid-cols-[1fr_.6fr] lg:items-end"><h1 className="font-display text-[clamp(4.5rem,10vw,10rem)] leading-[.82] tracking-[-.06em]">Selected<br />homes.</h1><p className="max-w-lg text-lg leading-8 text-[#66594f]">Distinct lives call for distinct homes. These are spaces built from the inside out — attentive to daily rituals, climate and material.</p></div><div className="mt-14 space-y-24">{projects.map((project, index) => <Link href={`/projects/${project.slug}`} key={project.slug} className={`group grid gap-6 lg:grid-cols-12 ${index % 2 ? "lg:text-right" : ""}`}><div className={`relative aspect-[16/9] overflow-hidden lg:col-span-8 ${index % 2 ? "lg:col-start-5" : ""}`}><Image src={project.cover} alt={project.name} fill sizes="(max-width:1024px) 100vw, 70vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.02]" /></div><div className={`lg:col-span-4 lg:self-end ${index % 2 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-9"}`}><p className="text-sm text-[#7b6c60]">{project.city} · {project.homeType}</p><h2 className="mt-3 font-display text-5xl leading-[.95]">{project.name}</h2><p className="mt-4 leading-7 text-[#66594f]">{project.description}</p><ArrowUpRight className={`mt-7 ${index % 2 ? "lg:ml-auto" : ""}`} strokeWidth={1.2} /></div></Link>)}</div></div></section><SiteFooter /></main>;
}
