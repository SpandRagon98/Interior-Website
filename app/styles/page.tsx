import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { designStyles } from "@/config/styles";
import { assetPath } from "@/lib/asset-path";

export const metadata: Metadata = { title: "Interior Design Styles", description: "Explore eight interior directions and find what feels like home." };
export default function StylesPage() { return <main><SiteHeader /><section className="px-5 pb-24 pt-20 sm:px-9 lg:px-12 lg:pt-28"><div className="mx-auto max-w-[1500px]"><div className="max-w-5xl"><p className="text-sm text-[#7a6a5e]">Find your style</p><h1 className="mt-6 font-display text-[clamp(4.5rem,10vw,10rem)] leading-[.82] tracking-[-.06em]">A feeling before it becomes a room.</h1><p className="mt-9 max-w-2xl text-lg leading-8 text-[#66594f]">Use these directions as a vocabulary, not a rulebook. Most enduring homes are a thoughtful blend shaped around their owners.</p></div><div className="mt-20 grid gap-x-6 gap-y-20 md:grid-cols-2 lg:grid-cols-12">{designStyles.map((style, index) => <article id={style.name.toLowerCase().replaceAll(" ", "-")} key={style.name} className={`${index % 3 === 0 ? "lg:col-span-7" : "lg:col-span-5"}`}><div className={`relative overflow-hidden ${index % 3 === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}`}><Image src={assetPath(style.image)} alt={`${style.name} interior`} fill sizes="(max-width:1024px) 100vw, 55vw" className="object-cover" /></div><p className="mt-4 text-xs text-[#8e7f73]">0{index + 1}</p><h2 className="mt-1 font-display text-4xl">{style.name}</h2><p className="mt-3 max-w-lg leading-7 text-[#66594f]">{style.copy}</p></article>)}</div><div className="mt-20 text-center"><Link href="/start-project" className="inline-block bg-[#1b100c] px-7 py-5 text-sm text-white">Find your design direction</Link></div></div></section><SiteFooter /></main>; }
