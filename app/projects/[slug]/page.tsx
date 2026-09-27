import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { getProject, projects } from "@/data/projects";
import { assetPath } from "@/lib/asset-path";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const project = getProject((await params).slug); if (!project) return {}; return { title: project.name, description: project.description }; }

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug); if (!project) notFound();
  return <main><SiteHeader overlay /><section className="relative flex min-h-[82vh] items-end overflow-hidden bg-[#1b100c] text-white"><Image src={assetPath(project.cover)} alt={project.name} fill priority sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#1b100c]/90 via-transparent to-[#1b100c]/25" /><div className="relative z-10 mx-auto w-full max-w-[1500px] px-5 pb-14 sm:px-9 lg:px-12"><p className="text-sm text-white/70">{project.city} · {project.homeType} · {project.area}</p><h1 className="mt-4 max-w-5xl font-display text-[clamp(4rem,9vw,9rem)] leading-[.84] tracking-[-.055em]">{project.name}</h1></div></section><section className="px-5 py-20 sm:px-9 lg:px-12 lg:py-28"><div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.7fr_1.3fr]"><div className="grid grid-cols-2 gap-y-6 text-sm"><div><p className="text-[#8b7d72]">Home</p><p className="mt-1">{project.bhk} {project.homeType}</p></div><div><p className="text-[#8b7d72]">Style</p><p className="mt-1">{project.style}</p></div><div><p className="text-[#8b7d72]">Rooms</p><p className="mt-1">{project.rooms.join(", ")}</p></div><div><p className="text-[#8b7d72]">Materials</p><p className="mt-1">{project.materials.join(", ")}</p></div></div><div><p className="font-display text-4xl leading-[1.15] sm:text-5xl">{project.description}</p><p className="mt-8 max-w-2xl text-lg leading-8 text-[#65584e]">{project.story}</p></div></div><div className="mx-auto mt-20 grid max-w-[1500px] gap-5 lg:grid-cols-2">{project.gallery.map((image, index) => <div key={`${image}-${index}`} className={`relative overflow-hidden ${index === 0 ? "aspect-[16/8] lg:col-span-2" : "aspect-[4/5]"}`}><Image src={assetPath(image)} alt={`${project.name}, view ${index + 1}`} fill sizes={index === 0 ? "100vw" : "50vw"} className="object-cover" /></div>)}</div><div className="mx-auto mt-16 flex max-w-[1500px] justify-center"><Link href="/start-project" className="bg-[#1b100c] px-7 py-5 text-sm text-white">Start your project</Link></div></section><SiteFooter /></main>;
}
