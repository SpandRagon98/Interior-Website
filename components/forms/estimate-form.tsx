"use client";

import { useEffect, useState } from "react";
import { Calculator, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { calculateEstimate, formatInr, type EstimateInput, type FinishLevel } from "@/config/pricing";
import { siteConfig } from "@/config/site";

const initial: EstimateInput = { city: "Kolkata", propertyType: "Apartment", bhk: "3 BHK", carpetArea: 1500, rooms: ["Living Room", "Kitchen", "Bedrooms"], kitchen: true, wardrobes: 3, furniture: true, falseCeiling: true, flooring: false, finishLevel: "Premium" };

export function EstimateForm() {
  const [form, setForm] = useState(initial); const [result, setResult] = useState<{ low: number; high: number; saved?: boolean } | null>(null); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function calculate(next = form) { setBusy(true); setError(""); try { const response = await fetch("/api/estimates", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(next) }); const data = await response.json() as { low: number; high: number; saved?: boolean; error?: string }; if (!response.ok) throw new Error(data.error ?? "Estimate unavailable."); setResult(data); return data; } catch (e) { setError(e instanceof Error ? e.message : "Estimate unavailable."); throw e; } finally { setBusy(false); } }
  useEffect(() => {
    const context = document.modelContext; if (!context?.registerTool) return; const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({ name: "calculate_interior_estimate", title: "Calculate interior estimate", description: "Calculate and display an indicative House of Veya interior budget range from home details.", inputSchema: { type: "object", properties: { carpetArea: { type: "number", minimum: 250, maximum: 20000 }, finishLevel: { type: "string", enum: ["Essential", "Premium", "Luxury"] }, city: { type: "string" } }, required: ["carpetArea", "finishLevel", "city"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, async execute(input) { const raw = input as { carpetArea?: number; finishLevel?: FinishLevel; city?: string }; if (!raw.carpetArea || !["Essential", "Premium", "Luxury"].includes(String(raw.finishLevel))) throw new Error("Valid area and finish level are required."); const next = { ...form, carpetArea: raw.carpetArea, finishLevel: raw.finishLevel!, city: raw.city || form.city }; setForm(next); const estimate = await calculate(next); return { estimatedLow: estimate.low, estimatedHigh: estimate.high, currency: "INR", indicative: true }; } }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [form]);
  const toggleRoom = (room: string) => setForm({ ...form, rooms: form.rooms.includes(room) ? form.rooms.filter((item) => item !== room) : [...form.rooms, room] });
  return <div className="grid gap-0 border border-[#a99380] bg-[#eee3d7] lg:grid-cols-[1.1fr_.9fr]">
    <form onSubmit={(e) => { e.preventDefault(); void calculate(); }} className="p-6 sm:p-10 lg:p-14">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="City"><Select value={form.city} onValueChange={(city) => setForm({ ...form, city })}><SelectTrigger className="h-12 w-full rounded-none border-[#a99380] bg-transparent"><SelectValue /></SelectTrigger><SelectContent>{[...siteConfig.cities, "Other"].map((city) => <SelectItem key={city} value={city}>{city}</SelectItem>)}</SelectContent></Select></Field>
        <Field label="Property type"><Select value={form.propertyType} onValueChange={(propertyType) => setForm({ ...form, propertyType })}><SelectTrigger className="h-12 w-full rounded-none border-[#a99380] bg-transparent"><SelectValue /></SelectTrigger><SelectContent>{["Apartment", "Villa", "Penthouse", "Independent House"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></Field>
        <Field label="Home size"><Select value={form.bhk} onValueChange={(bhk) => setForm({ ...form, bhk })}><SelectTrigger className="h-12 w-full rounded-none border-[#a99380] bg-transparent"><SelectValue /></SelectTrigger><SelectContent>{["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></Field>
        <Field label={`Carpet area — ${form.carpetArea.toLocaleString("en-IN")} sq ft`}><Slider value={[form.carpetArea]} min={250} max={6000} step={50} onValueChange={([carpetArea]) => setForm({ ...form, carpetArea })} className="h-12" /></Field>
      </div>
      <fieldset className="mt-9"><legend className="text-sm text-[#6f6258]">Rooms to include</legend><div className="mt-4 flex flex-wrap gap-2">{["Living Room", "Kitchen", "Bedrooms", "Dining", "Home Office", "Bathrooms"].map((room) => <button type="button" key={room} onClick={() => toggleRoom(room)} className={`border px-4 py-3 text-sm ${form.rooms.includes(room) ? "border-[#1b100c] bg-[#1b100c] text-white" : "border-[#aa9582]"}`}>{room}</button>)}</div></fieldset>
      <div className="mt-9 grid gap-4 sm:grid-cols-2">{[["kitchen", "Modular kitchen"], ["furniture", "Loose furniture"], ["falseCeiling", "False ceiling"], ["flooring", "New flooring"]].map(([key, label]) => <label key={key} className="flex cursor-pointer items-center gap-3 border-b border-[#c4b19f] pb-4"><Checkbox checked={Boolean(form[key as keyof EstimateInput])} onCheckedChange={(checked) => setForm({ ...form, [key]: checked === true })} className="rounded-none" /><span>{label}</span></label>)}</div>
      <Field label={`Wardrobes — ${form.wardrobes}`} className="mt-9"><Slider value={[form.wardrobes]} min={0} max={10} step={1} onValueChange={([wardrobes]) => setForm({ ...form, wardrobes })} className="h-10" /></Field>
      <fieldset className="mt-9"><legend className="text-sm text-[#6f6258]">Finish level</legend><div className="mt-4 grid grid-cols-3 gap-2">{(["Essential", "Premium", "Luxury"] as FinishLevel[]).map((level) => <button type="button" key={level} onClick={() => setForm({ ...form, finishLevel: level })} className={`border px-3 py-4 text-sm ${form.finishLevel === level ? "border-[#a44928] bg-[#a44928] text-white" : "border-[#aa9582]"}`}>{level}</button>)}</div></fieldset>
      <button disabled={busy} className="mt-10 inline-flex min-h-14 w-full items-center justify-center gap-3 bg-[#1b100c] px-6 text-sm text-white disabled:opacity-60">{busy ? "Calculating…" : "Calculate my range"}<Calculator size={17} /></button>
      {error && <p className="mt-4 text-sm text-red-800" role="alert">{error}</p>}
    </form>
    <aside className="flex min-h-[440px] flex-col justify-between bg-[#1b100c] p-7 text-white sm:p-12 lg:p-14" aria-live="polite">
      <div><p className="text-sm text-white/50">Your indicative interior range</p>{result ? <><p className="mt-6 font-display text-[clamp(3rem,6vw,6.5rem)] leading-[.9] tracking-[-.05em]">{formatInr(result.low)}<br /><span className="text-white/45">to</span> {formatInr(result.high)}</p><p className="mt-8 flex items-center gap-2 text-sm text-white/60"><Check size={16} />{result.saved ? "Saved to your account" : "Sign in to save this estimate"}</p></> : <p className="mt-8 max-w-md font-display text-5xl leading-[1] text-white/55">A considered starting point, before we know the details.</p>}</div>
      <p className="mt-14 text-sm leading-6 text-white/45">Indicative only. Final pricing depends on scope, site conditions, materials, brands, customisation and taxes.</p>
    </aside>
  </div>;
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) { return <label className={`block ${className}`}><span className="mb-3 block text-sm text-[#6f6258]">{label}</span>{children}</label>; }
