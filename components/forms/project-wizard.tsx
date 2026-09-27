"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileText, Send, Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { designStyles } from "@/config/styles";
import { priorityOptions, roomOptions, siteConfig } from "@/config/site";
import { clearDraftFiles, loadDraftFiles, saveDraftFiles } from "@/lib/draft-files";
import { assetPath } from "@/lib/asset-path";
import { qyrovaInteriorLead } from "@/config/qyrova";
import { formatInr, type FinishLevel } from "@/config/pricing";

const STORAGE_KEY = "house-of-veya-project-draft-v1";
const steps = ["Your home", "Spaces", "Design style", "Priorities", "Finish level", "Budget", "Timeline", "Inspiration", "Contact", "Review"];
const initial = { propertyType: "Apartment", bhk: "3 BHK", city: "Kolkata", locality: "", carpetArea: 1500, propertyStatus: "Possession received", possessionDate: "", rooms: [] as string[], styles: [] as string[], priorities: [] as string[], finishLevel: "Premium" as FinishLevel, budget: "", timeline: "", name: "", email: "", phone: "", preferredContact: "WhatsApp" as "Phone" | "WhatsApp" | "Email", preferredTime: "Weekday evenings", notes: "" };
type Draft = typeof initial;

export function ProjectWizard() {
  const [step, setStep] = useState(0); const [draft, setDraft] = useState<Draft>(initial); const [files, setFiles] = useState<File[]>([]); const [ready, setReady] = useState(false); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [enquiryReady, setEnquiryReady] = useState<{ low: number; high: number } | null>(null);
  useEffect(() => {
    let active = true;

    async function restoreDraft() {
      let restoredDraft: Draft | undefined;
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        try {
          const parsed = JSON.parse(saved) as Partial<Draft>;
          restoredDraft = { ...initial, ...parsed };
        } catch {
          // Ignore an invalid local draft and start with the authenticated profile.
        }
      }

      const savedStep = Number(localStorage.getItem(`${STORAGE_KEY}-step`) ?? 0);
      const restoredFiles = await loadDraftFiles().catch(() => [] as File[]);

      if (!active) return;
      if (restoredDraft) setDraft(restoredDraft);
      if (Number.isInteger(savedStep) && savedStep >= 0 && savedStep < steps.length) setStep(savedStep);
      setFiles(restoredFiles);
      setReady(true);
    }

    void restoreDraft();
    return () => { active = false; };
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); }, [draft, ready]);
  useEffect(() => { if (ready) localStorage.setItem(`${STORAGE_KEY}-step`, String(step)); }, [step, ready]);
  useEffect(() => { const context = document.modelContext; if (!context?.registerTool) return; const lifecycle = new AbortController(); void Promise.resolve(context.registerTool({ name: "stage_interior_project_brief", title: "Stage project brief", description: "Prefill and display a House of Veya project draft without submitting it.", inputSchema: { type: "object", properties: { city: { type: "string" }, propertyType: { type: "string" }, bhk: { type: "string" }, carpetArea: { type: "number" }, rooms: { type: "array", items: { type: "string" } }, styles: { type: "array", items: { type: "string" } }, budget: { type: "string" }, timeline: { type: "string" } }, additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: false }, execute(input) { const update = input as Partial<Draft>; const next = { ...draft, ...update }; setDraft(next); setStep(8); return { staged: true, nextAction: "Review the visible brief and prepare the email enquiry." }; } }, { signal: lifecycle.signal })).catch(() => undefined); return () => lifecycle.abort(); }, [draft]);
  const canContinue = useMemo(() => step === 0 ? Boolean(draft.locality && draft.carpetArea >= 100) : step === 1 ? draft.rooms.length > 0 : step === 2 ? draft.styles.length > 0 : step === 5 ? Boolean(draft.budget) : step === 6 ? Boolean(draft.timeline) : step === 8 ? Boolean(draft.name && draft.email && draft.phone) : true, [step, draft]);
  function toggle(key: "rooms" | "styles" | "priorities", value: string) { setDraft({ ...draft, [key]: draft[key].includes(value) ? draft[key].filter((item) => item !== value) : [...draft[key], value] }); }
  async function chooseFiles(list: FileList | null) { const next = [...files, ...Array.from(list ?? [])].filter((file, index, all) => all.findIndex((item) => item.name === file.name) === index).slice(0, 8); const invalid = next.find((file) => !["image/jpeg", "image/png", "image/webp", "application/pdf"].includes(file.type) || file.size > 10 * 1024 * 1024); if (invalid) { setError("Use JPG, PNG, WEBP or PDF files up to 10 MB each."); return; } setError(""); setFiles(next); await saveDraftFiles(next); }
  async function submit() {
    setBusy(true); setError("");
    try {
      const response = await fetch(qyrovaInteriorLead.endpoint, {
        method: "POST",
        // text/plain keeps this a simple cross-origin request; no secret is shipped to GitHub Pages.
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({
          form_id: qyrovaInteriorLead.formId,
          submission_id: crypto.randomUUID(),
          contact: { name: draft.name, email: draft.email, phone: draft.phone },
          answers: {
            property_type: draft.propertyType,
            bhk: draft.bhk,
            carpet_area_sqft: draft.carpetArea,
            city: draft.city,
            locality: draft.locality,
            possession_status: draft.propertyStatus,
            possession_date: draft.possessionDate,
            spaces: draft.rooms,
            styles: draft.styles,
            priorities: draft.priorities,
            finish_level: draft.finishLevel,
            budget_range: draft.budget,
            timeline: draft.timeline,
            preferred_contact: draft.preferredContact,
            preferred_time: draft.preferredTime,
            project_notes: draft.notes,
            inspiration_files: files.map((file) => file.name),
          },
        }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || "Your project brief could not be sent.");
      setEnquiryReady(result.estimate);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(`${STORAGE_KEY}-step`);
      await clearDraftFiles();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Your project brief could not be sent.");
    } finally {
      setBusy(false);
    }
  }
  if (!ready) return <div className="min-h-[540px] animate-pulse bg-[#e7ddd1]" />;
  if (enquiryReady) return <div className="grid min-h-[620px] place-items-center bg-[#1b100c] p-6 text-center text-white"><div className="max-w-2xl"><div className="mx-auto grid size-16 place-items-center rounded-full border border-white/35"><Check size={28} /></div><h2 className="mt-8 font-display text-6xl leading-[.95]">Your project brief is with us.</h2><p className="mx-auto mt-6 max-w-lg leading-7 text-white/65">Our studio has received your details and will follow up with you. Your indicative interior range is</p><p className="mt-5 font-display text-4xl">{formatInr(enquiryReady.low)} – {formatInr(enquiryReady.high)}</p><p className="mx-auto mt-6 max-w-lg text-sm leading-6 text-white/45">Indicative only. The final proposal depends on drawings, scope, site conditions, finishes and taxes. Inspiration files stay on your device; you can share them during the follow-up.</p></div></div>;
  return <div className="grid border border-[#a99380] bg-[#eee3d7] lg:grid-cols-[250px_1fr]">
    <aside className="border-b border-[#b7a28e] p-5 lg:border-b-0 lg:border-r lg:p-8"><p className="font-display text-2xl">Your project</p><Progress value={((step + 1) / steps.length) * 100} className="mt-5 h-1 rounded-none bg-[#c9b7a5]" /><p className="mt-3 text-sm text-[#78695e]">Step {step + 1} of {steps.length}</p><ol className="mt-8 hidden space-y-4 text-sm lg:block">{steps.map((title, index) => <li key={title}><button type="button" onClick={() => index < step && setStep(index)} disabled={index > step} className={`text-left ${index === step ? "text-[#a44928]" : index < step ? "text-[#1b100c]" : "text-[#9a8c81]"}`}>{String(index + 1).padStart(2, "0")} &nbsp; {title}</button></li>)}</ol></aside>
    <div className="flex min-h-[690px] flex-col"><div className="flex-1 p-6 sm:p-10 lg:p-14"><p className="text-sm text-[#7a6a5e]">{String(step + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</p><h2 className="mt-3 font-display text-5xl tracking-[-.04em] sm:text-6xl">{steps[step]}</h2><div className="mt-9">{renderStep()}</div>{error && <p className="mt-6 text-sm text-red-800" role="alert">{error}</p>}</div>
      <div className="flex items-center justify-between border-t border-[#b7a28e] p-5 sm:px-10"><button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="inline-flex items-center gap-2 text-sm disabled:opacity-30"><ArrowLeft size={16} />Back</button>{step < steps.length - 1 ? <button type="button" disabled={!canContinue} onClick={() => setStep(step + 1)} className="inline-flex items-center gap-3 bg-[#1b100c] px-6 py-4 text-sm text-white disabled:opacity-35">Continue<ArrowRight size={16} /></button> : <button type="button" onClick={() => void submit()} disabled={busy} className="inline-flex items-center gap-3 bg-[#a44928] px-6 py-4 text-sm text-white disabled:opacity-55">{busy ? "Sending…" : "Send project brief"}<Send size={16} /></button>}</div>
    </div>
  </div>;

  function renderStep() {
    if (step === 0) return <div className="grid gap-6 sm:grid-cols-2"><SelectField label="Property type" value={draft.propertyType} values={["Apartment", "Villa", "Penthouse", "Independent House"]} onChange={(propertyType) => setDraft({ ...draft, propertyType })} /><SelectField label="Home size" value={draft.bhk} values={["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"]} onChange={(bhk) => setDraft({ ...draft, bhk })} /><SelectField label="City" value={draft.city} values={[...siteConfig.cities, "Other"]} onChange={(city) => setDraft({ ...draft, city })} /><TextField label="Locality" value={draft.locality} onChange={(locality) => setDraft({ ...draft, locality })} /><TextField label="Carpet area (sq ft)" type="number" value={String(draft.carpetArea)} onChange={(value) => setDraft({ ...draft, carpetArea: Number(value) })} /><SelectField label="Property status" value={draft.propertyStatus} values={["Possession received", "Under construction", "Renovation", "Resale"]} onChange={(propertyStatus) => setDraft({ ...draft, propertyStatus })} /><TextField label="Possession date" type="date" value={draft.possessionDate} onChange={(possessionDate) => setDraft({ ...draft, possessionDate })} /></div>;
    if (step === 1) return <ChoiceGrid values={[...roomOptions]} selected={draft.rooms} onToggle={(value) => toggle("rooms", value)} />;
    if (step === 2) return <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[...designStyles, { name: "Not Sure Yet", image: "/images/hero-living.png", copy: "" }].map((style) => <button type="button" key={style.name} onClick={() => toggle("styles", style.name)} className={`relative aspect-[4/5] overflow-hidden text-left ${draft.styles.includes(style.name) ? "ring-4 ring-[#a44928] ring-offset-2 ring-offset-[#eee3d7]" : ""}`}><Image src={assetPath(style.image)} alt="" fill sizes="25vw" className="object-cover" /><span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" /><span className="absolute inset-x-3 bottom-3 font-display text-xl text-white">{style.name}</span></button>)}</div>;
    if (step === 3) return <ChoiceGrid values={[...priorityOptions]} selected={draft.priorities} onToggle={(value) => toggle("priorities", value)} />;
    if (step === 4) return <ChoiceGrid values={["Essential", "Premium", "Luxury"]} selected={[draft.finishLevel]} onToggle={(finishLevel) => setDraft({ ...draft, finishLevel: finishLevel as FinishLevel })} single />;
    if (step === 5) return <ChoiceGrid values={[...siteConfig.budgets]} selected={draft.budget ? [draft.budget] : []} onToggle={(budget) => setDraft({ ...draft, budget })} single />;
    if (step === 6) return <ChoiceGrid values={[...siteConfig.timelines]} selected={draft.timeline ? [draft.timeline] : []} onToggle={(timeline) => setDraft({ ...draft, timeline })} single />;
    if (step === 7) return <div><label className="grid min-h-48 cursor-pointer place-items-center border border-dashed border-[#8e7968] bg-[#f3ece2] p-8 text-center"><input type="file" multiple accept=".jpg,.jpeg,.png,.webp,.pdf" className="sr-only" onChange={(e) => void chooseFiles(e.target.files)} /><span><Upload className="mx-auto" strokeWidth={1.2} /><span className="mt-4 block font-display text-3xl">Choose floor plans or inspiration</span><span className="mt-2 block text-sm text-[#75665b]">JPG, PNG, WEBP or PDF · up to 10 MB each</span></span></label><div className="mt-5 space-y-2">{files.map((file) => <div key={file.name} className="flex items-center justify-between border-b border-[#c4b19f] py-3"><span className="flex min-w-0 items-center gap-3"><FileText size={17} /><span className="truncate">{file.name}</span></span><button type="button" aria-label={`Remove ${file.name}`} onClick={() => { const next = files.filter((item) => item.name !== file.name); setFiles(next); void saveDraftFiles(next); }}><X size={17} /></button></div>)}</div><p className="mt-5 text-sm leading-6 text-[#75665b]">Files stay privately in this browser. They are not uploaded by this form; you can share them during the follow-up.</p></div>;
    if (step === 8) return <div className="grid gap-6 sm:grid-cols-2"><TextField label="Name" value={draft.name} onChange={(name) => setDraft({ ...draft, name })} /><TextField label="Email" type="email" value={draft.email} onChange={(email) => setDraft({ ...draft, email })} /><TextField label="Phone" type="tel" value={draft.phone} onChange={(phone) => setDraft({ ...draft, phone })} /><SelectField label="Preferred contact" value={draft.preferredContact} values={["WhatsApp", "Phone", "Email"]} onChange={(preferredContact) => setDraft({ ...draft, preferredContact: preferredContact as Draft["preferredContact"] })} /><SelectField label="Preferred time" value={draft.preferredTime} values={["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Saturday"]} onChange={(preferredTime) => setDraft({ ...draft, preferredTime })} /><label className="sm:col-span-2"><span className="mb-2 block text-sm text-[#6f6258]">Additional notes</span><textarea value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} maxLength={2000} rows={5} className="w-full border border-[#aa9582] bg-transparent p-4 outline-none focus:border-[#a44928]" /></label></div>;
    return <div className="grid gap-6 md:grid-cols-2">{[["Your home", `${draft.bhk} ${draft.propertyType}, ${draft.carpetArea.toLocaleString("en-IN")} sq ft · ${draft.locality}, ${draft.city}`], ["Spaces", draft.rooms.join(", ")], ["Style", draft.styles.join(", ")], ["Priorities", draft.priorities.join(", ") || "Open to guidance"], ["Finish", draft.finishLevel], ["Budget", draft.budget], ["Timeline", draft.timeline], ["Inspiration", files.length ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "No files selected"], ["Contact", `${draft.name} · ${draft.phone} · ${draft.preferredContact}`]].map(([title, value], index) => <div key={title} className="border-t border-[#a99380] pt-4"><div className="flex items-center justify-between"><h3 className="font-display text-2xl">{title}</h3><button type="button" onClick={() => setStep(index)} className="text-sm underline underline-offset-4">Edit</button></div><p className="mt-2 text-sm leading-6 text-[#66594f]">{value}</p></div>)}<div className="border border-[#a44928] bg-[#f3ece2] p-5 md:col-span-2"><p className="font-display text-2xl">Ready to send</p><p className="mt-2 text-sm leading-6 text-[#66594f]">Your project brief will be sent securely to the studio’s Qyrova lead system. Inspiration files remain on your device for privacy.</p></div></div>;
  }
}

function SelectField({ label, value, values, onChange }: { label: string; value: string; values: readonly string[]; onChange: (value: string) => void }) { return <label><span className="mb-2 block text-sm text-[#6f6258]">{label}</span><Select value={value} onValueChange={onChange}><SelectTrigger className="h-12 w-full rounded-none border-[#aa9582] bg-transparent"><SelectValue /></SelectTrigger><SelectContent>{values.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></label>; }
function TextField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) { return <label><span className="mb-2 block text-sm text-[#6f6258]">{label}</span><input required type={type} value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-full border border-[#aa9582] bg-transparent px-3 outline-none focus:border-[#a44928]" /></label>; }
function ChoiceGrid({ values, selected, onToggle, single = false }: { values: string[]; selected: string[]; onToggle: (value: string) => void; single?: boolean }) { return <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{values.map((value) => <button type="button" key={value} aria-pressed={selected.includes(value)} onClick={() => onToggle(value)} className={`flex min-h-20 items-center justify-between border p-5 text-left ${selected.includes(value) ? "border-[#1b100c] bg-[#1b100c] text-white" : "border-[#aa9582]"}`}><span>{value}</span>{selected.includes(value) && <Check size={17} />}{single && selected.includes(value) ? <span className="sr-only">Selected</span> : null}</button>)}</div>; }
