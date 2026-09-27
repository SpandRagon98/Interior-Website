import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadToDrive } from "@/lib/google/drive";
import { createUploadRecord } from "@/lib/google/sheets";
import { projectRepository } from "@/lib/repositories/projectRepository";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) return NextResponse.json({ error: "Sign in to upload files." }, { status: 401 });
  const form = await request.formData(); const file = form.get("file"); const projectId = String(form.get("projectId") ?? "");
  if (!(file instanceof File) || !projectId) return NextResponse.json({ error: "A file and project reference are required." }, { status: 400 });
  const project = await projectRepository.getById(projectId);
  if (!project || (project.User_ID !== session.user.id && project.Email.toLowerCase() !== session.user.email.toLowerCase())) return NextResponse.json({ error: "Project not found." }, { status: 404 });
  try {
    const uploaded = await uploadToDrive(file, projectId);
    await createUploadRecord({ Project_ID: projectId, User_ID: session.user.id, File_Name: uploaded.name, File_Type: uploaded.mimeType, Google_Drive_File_ID: uploaded.id, Google_Drive_URL: uploaded.webViewLink ?? `https://drive.google.com/file/d/${uploaded.id}/view` });
    return NextResponse.json({ id: uploaded.id, url: uploaded.webViewLink });
  } catch (error) { const message = error instanceof Error ? error.message : "Upload failed."; return NextResponse.json({ error: message }, { status: 400 }); }
}
