import type { Metadata } from "next";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ProjectWizard } from "@/components/forms/project-wizard";

export const metadata: Metadata = { title: "Start Your Project", description: "Tell House of Veya about your home, spaces, style, budget and timeline." };
export default async function StartProjectPage(){const session=await auth();return <main><SiteHeader/><section className="px-5 pb-24 pt-14 sm:px-9 lg:px-12 lg:pt-20"><div className="mx-auto max-w-[1500px]"><div className="mb-10 max-w-4xl"><p className="text-sm text-[#7a6a5e]">About eight minutes · progress saves automatically</p><h1 className="mt-4 font-display text-[clamp(4rem,8vw,8rem)] leading-[.85] tracking-[-.055em]">Let’s understand your home.</h1></div><ProjectWizard user={{authenticated:Boolean(session?.user),name:session?.user?.name,email:session?.user?.email}}/></div></section><SiteFooter/></main>}
