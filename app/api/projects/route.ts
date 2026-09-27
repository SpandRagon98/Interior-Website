import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { projectSchema } from "@/lib/validation/schemas";
import { projectRepository } from "@/lib/repositories/projectRepository";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return NextResponse.json({ error: "Sign in with Google to submit your project.", signInRequired: true }, { status: 401 });
  const parsed = projectSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Please review the highlighted project details.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
  const data = parsed.data;
  try {
    const projectId = await projectRepository.create({ User_ID: session.user.id, Email: session.user.email, Name: data.name, Phone: data.phone, Property_Type: data.propertyType, BHK: data.bhk, City: data.city, Locality: data.locality, Carpet_Area: data.carpetArea, Property_Status: data.propertyStatus, Possession_Date: data.possessionDate, Rooms: data.rooms.join(", "), Styles: data.styles.join(", "), Priorities: data.priorities.join(", "), Budget: data.budget, Timeline: data.timeline, Preferred_Contact: data.preferredContact, Preferred_Time: data.preferredTime, Notes: data.notes });
    return NextResponse.json({ projectId }, { status: 201 });
  } catch (error) { console.error("Project submission failed", error); return NextResponse.json({ error: "Your project could not be saved. Please try again." }, { status: 503 }); }
}
