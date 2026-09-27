import type { Metadata } from "next";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { EstimateForm } from "@/components/forms/estimate-form";

export const metadata: Metadata = { title: "Interior Cost Estimator", description: "Estimate an indicative budget for your home interior project." };
export default function EstimatePage(){return <main><SiteHeader/><section className="px-5 pb-24 pt-16 sm:px-9 lg:px-12 lg:pt-24"><div className="mx-auto max-w-[1500px]"><div className="mb-12 grid gap-8 lg:grid-cols-[1fr_.7fr] lg:items-end"><div><p className="text-sm text-[#7a6a5e]">Interior cost estimator</p><h1 className="mt-5 font-display text-[clamp(4rem,8vw,8rem)] leading-[.85] tracking-[-.055em]">Plan with a clearer first number.</h1></div><p className="max-w-lg text-lg leading-8 text-[#66594f]">Choose the essentials and we will calculate an indicative range. It takes under two minutes.</p></div><EstimateForm/></div></section><SiteFooter/></main>}
