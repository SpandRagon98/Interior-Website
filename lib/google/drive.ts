import "server-only";
import { getGoogleAccessToken } from "./sheets";

export const ALLOWED_UPLOADS = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export async function uploadToDrive(file: File, projectId: string) {
  if (!process.env.GOOGLE_DRIVE_FOLDER_ID) throw new Error("Google Drive upload folder is not configured.");
  if (!ALLOWED_UPLOADS.includes(file.type)) throw new Error("Unsupported file type.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("File exceeds the 10 MB limit.");
  const token = await getGoogleAccessToken();
  const safeName = file.name.replace(/[^a-zA-Z0-9._ -]/g, "_");
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify({ name: `${projectId} — ${safeName}`, parents: [process.env.GOOGLE_DRIVE_FOLDER_ID] })], { type: "application/json" }));
  form.append("file", file, safeName);
  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
  if (!response.ok) throw new Error(`Google Drive upload failed (${response.status}).`);
  return response.json() as Promise<{ id: string; name: string; mimeType: string; webViewLink?: string }>;
}
