import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { calculateEstimate } from "@/config/pricing";
import { estimateSchema } from "@/lib/validation/schemas";
import { estimateRepository } from "@/lib/repositories/estimateRepository";

export async function POST(request: Request) {
  const parsed = estimateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please check the estimate details.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  const estimate = calculateEstimate(parsed.data);
  const session = await auth();
  if (session?.user?.id) {
    try { await estimateRepository.create({ User_ID: session.user.id, City: parsed.data.city, Property_Type: parsed.data.propertyType, BHK: parsed.data.bhk, Carpet_Area: parsed.data.carpetArea, Selected_Options: JSON.stringify({ rooms: parsed.data.rooms, kitchen: parsed.data.kitchen, wardrobes: parsed.data.wardrobes, furniture: parsed.data.furniture, falseCeiling: parsed.data.falseCeiling, flooring: parsed.data.flooring }), Finish_Level: parsed.data.finishLevel, Estimated_Low: estimate.low, Estimated_High: estimate.high }); }
    catch (error) { console.error("Estimate could not be saved", error); }
  }
  return NextResponse.json({ ...estimate, saved: Boolean(session?.user?.id) });
}
