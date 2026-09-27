import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/site/reveal";
import { QuickEstimate } from "@/components/site/quick-estimate";
import { BeforeAfter } from "@/components/site/before-after";
import { homeCategories } from "@/config/site";
import { designStyles } from "@/config/styles";
import { services } from "@/config/services";
import { processSteps } from "@/config/process";
import { projects } from "@/data/projects";
import { testimonials } from "@/data/testimonials";
import { faqs } from "@/data/faqs";
import { assetPath } from "@/lib/asset-path";

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#f3ece2] text-[#1b100c]">
      <SiteHeader overlay />
      <section className="relative min-h-[760px] overflow-hidden bg-[#1b100c] text-white lg:min-h-screen">
        <Image src={assetPath("/images/hero-living.png")} alt="Warm contemporary living room with carved timber and Kolkata skyline" fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,8,4,.83)_0%,rgba(18,8,4,.28)_55%,rgba(18,8,4,.08)_100%)]" />
        <div className="absolute inset-y-0 left-[7.5%] hidden w-px bg-white/30 lg:block" />
        <div className="relative z-10 mx-auto flex min-h-[760px] max-w-[1600px] items-end px-5 pb-12 pt-32 sm:px-9 lg:min-h-screen lg:px-12 lg:pb-14">
          <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
            <div className="max-w-[880px] lg:pl-[7%]">
              <p className="mb-7 text-sm tracking-[0.08em] text-[#eadbca]">Interiors for the life within</p>
              <h1 className="font-display text-[clamp(4.1rem,8.2vw,9.4rem)] font-normal leading-[0.83] tracking-[-0.055em]">Your home,<br />composed.</h1>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Link href="/start-project" className="inline-flex min-h-14 items-center gap-10 bg-[#a44928] px-6 text-sm text-white transition-colors hover:bg-[#8f3d22]">Start your project <ArrowDownRight size={18} strokeWidth={1.4} /></Link>
                <Link href="/projects" className="border-b border-white/70 py-2 text-sm">Explore interiors</Link>
              </div>
            </div>
            <p className="max-w-[28rem] border-l border-white/40 pl-5 leading-7 text-white/80 lg:max-w-none">Thoughtful homes across India, shaped by architecture, craft and the way each family lives.</p>
          </div>
        </div>
        <div className="absolute right-0 top-20 hidden w-16 border-b border-l border-white/30 py-8 text-center text-[0.68rem] tracking-[0.18em] [writing-mode:vertical-rl] lg:block">Kolkata · Bengaluru · Mumbai</div>
      </section>

      <section aria-label="Studio credentials" className="border-b border-[#cbb9a6]">
        <div className="mx-auto grid max-w-[1500px] grid-cols-2 lg:grid-cols-4">
          {[["84", "homes delivered"], ["12", "months warranty"], ["46", "craft partners"], ["4.9/5", "client rating"]].map(([value, label], index) => <div key={label} className={`px-5 py-8 sm:px-9 ${index > 0 ? "border-l border-[#cbb9a6]" : ""}`}><p className="font-display text-4xl">{value}</p><p className="mt-1 text-sm text-[#6f6258]">{label}</p></div>)}
        </div>
      </section>

      <section className="px-5 py-24 sm:px-9 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
            <div className="lg:sticky lg:top-10 lg:self-start"><p className="text-sm text-[#7a6a5e]">Begin with a room</p><h2 className="mt-5 max-w-sm font-display text-5xl leading-[.95] tracking-[-.04em] sm:text-6xl">Every space deserves its own rhythm.</h2></div>
            <div className="border-t border-[#8f7f70]">
              {homeCategories.map((category, index) => <Link href={`/styles?room=${encodeURIComponent(category)}`} key={category} className="group grid grid-cols-[48px_1fr_auto] items-center border-b border-[#cbb9a6] py-6 sm:grid-cols-[80px_1fr_auto]"><span className="text-xs text-[#8b7c70]">{String(index + 1).padStart(2, "0")}</span><span className="font-display text-3xl sm:text-4xl">{category}</span><ArrowUpRight className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" strokeWidth={1.2} /></Link>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#d7c6b3] px-5 py-24 sm:px-9 lg:px-12 lg:py-32">
        <Reveal className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div className="relative aspect-[4/5] max-h-[760px] overflow-hidden"><Image src={assetPath("/images/kitchen.png")} alt="Natural stone and dark timber kitchen" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" /></div>
          <div className="lg:px-[8%]"><p className="text-sm text-[#6d5d51]">Our point of view</p><h2 className="mt-6 font-display text-[clamp(3.5rem,6.8vw,7.6rem)] leading-[.87] tracking-[-.055em]">Beauty should make life easier.</h2><p className="mt-9 max-w-xl text-lg leading-8 text-[#51443b]">We begin with how a home needs to work: the morning rush, long dinners, a quiet place to read. Architecture and craft follow that truth, creating rooms that feel inevitable rather than decorated.</p><Link href="/about" className="mt-9 inline-block border-b border-[#1b100c] pb-1 text-sm">Our studio</Link></div>
        </Reveal>
      </section>

      <section className="px-5 py-24 sm:px-9 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="flex flex-col gap-6 border-b border-[#a89380] pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm text-[#7a6a5e]">Selected work</p><h2 className="mt-4 font-display text-6xl tracking-[-.045em] sm:text-7xl">Homes with a point of view.</h2></div><Link href="/projects" className="text-sm underline underline-offset-8">View all projects</Link></div>
          <div className="mt-12 grid gap-8 lg:grid-cols-12">
            {projects.map((project, index) => <Link href={`/projects/${project.slug}`} key={project.slug} className={`group ${index === 0 ? "lg:col-span-7" : "lg:col-span-5"} ${index === 2 ? "lg:col-start-5 lg:col-span-8" : ""}`}><div className={`relative overflow-hidden ${index === 1 ? "aspect-[4/5]" : "aspect-[16/10]"}`}><Image src={assetPath(project.cover)} alt={project.name} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" /></div><div className="mt-4 flex items-start justify-between gap-4"><div><h3 className="font-display text-3xl">{project.name}</h3><p className="mt-1 text-sm text-[#76685d]">{project.city} · {project.style} · {project.area}</p></div><ArrowUpRight strokeWidth={1.2} /></div></Link>)}
          </div>
        </div>
      </section>

      <section className="bg-[#1b100c] px-5 py-24 text-white sm:px-9 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1500px]"><div className="grid gap-8 lg:grid-cols-[.65fr_1.35fr]"><div><p className="text-sm text-white/50">Find your style</p><h2 className="mt-5 font-display text-5xl leading-[.95] tracking-[-.04em]">Not a label.<br />A starting point.</h2><Link href="/styles" className="mt-8 inline-block border-b border-white/60 pb-1 text-sm">Explore all styles</Link></div><div className="grid grid-cols-2 gap-px bg-white/20 sm:grid-cols-4">{designStyles.map((style, index) => <Link href={`/styles#${style.name.toLowerCase().replaceAll(" ", "-")}`} key={style.name} className="group relative aspect-[3/5] overflow-hidden bg-[#2b1a14]"><Image src={assetPath(style.image)} alt="" fill sizes="25vw" className="object-cover opacity-55 transition duration-700 group-hover:scale-105 group-hover:opacity-80" /><span className="absolute inset-x-3 bottom-4 font-display text-xl sm:text-2xl">{style.name}</span><span className="absolute left-3 top-3 text-xs text-white/55">0{index + 1}</span></Link>)}</div></div></div>
      </section>

      <section className="px-5 py-24 sm:px-9 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1500px]"><div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm text-[#7a6a5e]">From plan to last detail</p><h2 className="mt-5 font-display text-6xl leading-[.93] tracking-[-.04em]">One studio.<br />A complete home.</h2><p className="mt-7 max-w-md leading-7 text-[#6e6055]">A single accountable team aligns space, materials and execution so the idea survives the journey to site.</p></div><div className="grid border-t border-[#8f7f70] sm:grid-cols-2">{services.map((service) => <div key={service.name} className="border-b border-[#cbb9a6] py-6 pr-6 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(even)]:pl-6"><div className="flex gap-4"><span className="text-xs text-[#9a897b]">{service.number}</span><div><h3 className="font-display text-2xl">{service.name}</h3><p className="mt-2 text-sm leading-6 text-[#76685d]">{service.copy}</p></div></div></div>)}</div></div></div>
      </section>

      <section className="px-5 pb-24 sm:px-9 lg:px-12 lg:pb-32"><div className="mx-auto max-w-[1500px]"><QuickEstimate /></div></section>

      <section className="bg-[#d7c6b3] px-5 py-24 sm:px-9 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1500px]"><div className="mb-10 grid gap-6 lg:grid-cols-2 lg:items-end"><h2 className="font-display text-6xl tracking-[-.045em] sm:text-7xl">Transformation, without theatre.</h2><p className="max-w-lg leading-7 text-[#5f5147] lg:justify-self-end">Move the slider to see how material, light and proportion change the feeling of a room without changing its bones.</p></div><BeforeAfter /></div>
      </section>

      <section className="px-5 py-24 sm:px-9 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-[1500px]"><div className="grid gap-12 lg:grid-cols-[.65fr_1.35fr]"><div><p className="text-sm text-[#7a6a5e]">How it works</p><h2 className="mt-5 font-display text-6xl tracking-[-.04em]">Clear from the first conversation.</h2><Link href="/how-it-works" className="mt-8 inline-block border-b border-[#1b100c] pb-1 text-sm">See the full process</Link></div><ol className="border-t border-[#8f7f70]">{processSteps.map((step, index) => <li key={step.title} className="grid gap-4 border-b border-[#cbb9a6] py-7 sm:grid-cols-[64px_1fr_1.2fr]"><span className="text-sm text-[#8c7d71]">0{index + 1}</span><h3 className="font-display text-3xl">{step.title}</h3><p className="leading-7 text-[#6e6055]">{step.copy}</p></li>)}</ol></div></div>
      </section>

      <section className="bg-[#a44928] px-5 py-20 text-white sm:px-9 lg:px-12">
        <div className="mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[1fr_1fr]"><h2 className="font-display text-[clamp(3.5rem,7vw,7rem)] leading-[.9] tracking-[-.05em]">Designed once.<br />Made to last.</h2><div className="grid gap-7 sm:grid-cols-2 lg:self-end">{[["Material honesty", "Every finish is sampled in your light and specified for how it will wear."], ["One accountable team", "Design, procurement and site decisions stay connected."], ["Documented quality", "Milestone checks and a complete handover pack protect the result."], ["12-month warranty", "Our workmanship is covered after handover, with product warranties recorded."]].map(([title, copy]) => <div key={title} className="border-t border-white/50 pt-4"><h3 className="font-display text-2xl">{title}</h3><p className="mt-2 text-sm leading-6 text-white/75">{copy}</p></div>)}</div></div>
      </section>

      <section className="px-5 py-24 sm:px-9 lg:px-12 lg:py-32"><div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center"><div className="relative aspect-[4/5] overflow-hidden"><Image src={assetPath("/images/bedroom.png")} alt="Bedroom with carved timber screen and hand-finished plaster" fill sizes="50vw" className="object-cover" /></div><div className="lg:px-[8%]"><p className="text-sm text-[#7a6a5e]">Materials and making</p><h2 className="mt-6 font-display text-6xl leading-[.93] tracking-[-.045em]">Craft you can feel, not just see.</h2><p className="mt-7 text-lg leading-8 text-[#64574d]">We work with natural stone yards, joinery workshops, metal artisans and textile makers across India. Every junction is drawn; every sample is judged in the room where it will live.</p><ul className="mt-9 grid gap-4 sm:grid-cols-2">{["Full-scale finish samples", "Documented material provenance", "Factory-stage joinery checks", "Low-VOC finish options"].map((item) => <li key={item} className="flex items-center gap-3 border-b border-[#cbb9a6] pb-4"><Check size={16} strokeWidth={1.4} />{item}</li>)}</ul></div></div></section>

      <section className="border-y border-[#cbb9a6] px-5 py-20 sm:px-9 lg:px-12"><div className="mx-auto grid max-w-[1500px] gap-8 md:grid-cols-3">{[[ShieldCheck, "12-month workmanship warranty", "A clear aftercare path from the team who delivered your home."], [Check, "Milestone quality reviews", "Design and site leads review concealed and visible work before sign-off."], [ArrowDownRight, "Transparent handover", "Drawings, finishes, warranties and care notes stay with you."]].map(([Icon, title, copy]) => { const Mark = Icon as typeof Check; return <div key={String(title)} className="border-t border-[#7f6f62] pt-6"><Mark strokeWidth={1.3} /><h3 className="mt-7 font-display text-3xl">{String(title)}</h3><p className="mt-3 leading-7 text-[#6e6055]">{String(copy)}</p></div>; })}</div></section>

      <section className="px-5 py-24 sm:px-9 lg:px-12 lg:py-32"><div className="mx-auto max-w-[1500px]"><div className="mb-12 flex items-end justify-between"><h2 className="font-display text-6xl tracking-[-.045em] sm:text-7xl">What it feels like to work together.</h2></div><div className="grid gap-8 lg:grid-cols-3">{testimonials.map((item, index) => <blockquote key={item.name} className={`${index ? "border-t lg:border-l lg:border-t-0" : "border-t lg:border-t-0"} border-[#cbb9a6] pt-7 lg:px-8 lg:pt-0 first:pl-0`}><p className="font-display text-3xl leading-[1.18]">“{item.quote}”</p><footer className="mt-8 text-sm text-[#74665b]">{item.name}<span className="block mt-1">{item.project}</span></footer></blockquote>)}</div></div></section>

      <section className="bg-[#e6d9cc] px-5 py-24 sm:px-9 lg:px-12 lg:py-32"><div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[.6fr_1.4fr]"><h2 className="font-display text-6xl tracking-[-.045em]">Questions, answered.</h2><div className="border-t border-[#8f7f70]">{faqs.map((item) => <details key={item.question} className="group border-b border-[#bca896] py-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-2xl"><span>{item.question}</span><span className="text-3xl font-light transition-transform group-open:rotate-45">+</span></summary><p className="max-w-2xl pt-5 leading-7 text-[#66584e]">{item.answer}</p></details>)}</div></div></section>

      <section className="relative min-h-[680px] overflow-hidden bg-[#1b100c] text-white"><Image src={assetPath("/images/hero-living.png")} alt="" fill sizes="100vw" className="object-cover opacity-35" /><div className="absolute inset-0 bg-[#1b100c]/35" /><div className="relative z-10 mx-auto flex min-h-[680px] max-w-[1500px] flex-col items-start justify-center px-5 py-24 sm:px-9 lg:px-12"><p className="text-sm text-white/65">A home begins with a conversation</p><h2 className="mt-6 max-w-5xl font-display text-[clamp(4.2rem,9vw,9rem)] leading-[.84] tracking-[-.055em]">Let’s make it feel like yours.</h2><div className="mt-10 flex flex-wrap gap-4"><Link href="/start-project" className="inline-flex min-h-14 items-center gap-10 bg-[#a44928] px-6 text-sm">Start your project <ArrowDownRight size={18} /></Link><Link href="/contact" className="border border-white/60 px-6 py-4 text-sm">Talk to a designer</Link></div></div></section>
      <SiteFooter />
    </main>
  );
}
