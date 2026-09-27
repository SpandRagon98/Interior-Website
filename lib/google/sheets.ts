import "server-only";

const SHEET_ID = process.env.GOOGLE_SHEET_ID ?? "1p_6v4ESAQW47x25m4yk8V-AlQWyYrtici8g9inKoJZ4";
const BASE = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}`;

export const SHEET_SCHEMAS = {
  USERS: ["User_ID", "Name", "Email", "Profile_Image", "Created_At", "Last_Login"],
  PROJECTS: ["Project_ID", "User_ID", "Email", "Name", "Phone", "Property_Type", "BHK", "City", "Locality", "Carpet_Area", "Property_Status", "Possession_Date", "Rooms", "Styles", "Priorities", "Budget", "Timeline", "Preferred_Contact", "Preferred_Time", "Notes", "Status", "Created_At", "Submitted_At"],
  UPLOADS: ["Upload_ID", "Project_ID", "User_ID", "File_Name", "File_Type", "Google_Drive_File_ID", "Google_Drive_URL", "Uploaded_At"],
  ESTIMATES: ["Estimate_ID", "User_ID", "City", "Property_Type", "BHK", "Carpet_Area", "Selected_Options", "Finish_Level", "Estimated_Low", "Estimated_High", "Created_At"],
} as const;

type SheetName = keyof typeof SHEET_SCHEMAS;
type Row = Record<string, string | number | boolean | null | undefined>;

function configured() { return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && SHEET_ID); }
export function isGoogleDataConfigured() { return configured(); }

function base64Url(data: string | Uint8Array) {
  const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
  let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

let tokenCache: { token: string; expires: number } | null = null;
export async function getGoogleAccessToken() {
  if (!configured()) throw new Error("Google services are not configured.");
  if (tokenCache && tokenCache.expires > Date.now() + 60_000) return tokenCache.token;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(JSON.stringify({ iss: email, scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 }));
  const keyText = process.env.GOOGLE_PRIVATE_KEY!.replace(/^['"]|['"]$/g, "").replaceAll("\\n", "\n");
  const keyBytes = Uint8Array.from(atob(keyText.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, "")), (char) => char.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", keyBytes, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const unsigned = `${header}.${claim}`;
  const signature = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(unsigned)));
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${base64Url(signature)}` }) });
  if (!response.ok) throw new Error(`Google authentication failed (${response.status}).`);
  const data = await response.json() as { access_token: string; expires_in: number };
  tokenCache = { token: data.access_token, expires: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function googleFetch(url: string, init?: RequestInit) {
  const token = await getGoogleAccessToken();
  const response = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, "content-type": "application/json", ...(init?.headers ?? {}) } });
  if (!response.ok) { const detail = await response.text(); throw new Error(`Google Sheets request failed (${response.status}): ${detail.slice(0, 240)}`); }
  return response;
}

async function ensureSheet(name: SheetName) {
  const meta = await googleFetch(`${BASE}?fields=sheets.properties.title`); const json = await meta.json() as { sheets?: { properties: { title: string } }[] };
  if (!json.sheets?.some((sheet) => sheet.properties.title === name)) await googleFetch(`${BASE}:batchUpdate`, { method: "POST", body: JSON.stringify({ requests: [{ addSheet: { properties: { title: name } } }] }) });
  const headers = [...SHEET_SCHEMAS[name]];
  const currentResponse = await googleFetch(`${BASE}/values/${encodeURIComponent(`${name}!1:1`)}`); const current = await currentResponse.json() as { values?: string[][] };
  const existing = current.values?.[0] ?? [];
  const merged = [...existing, ...headers.filter((header) => !existing.includes(header))];
  if (merged.length !== existing.length || existing.length === 0) await googleFetch(`${BASE}/values/${encodeURIComponent(`${name}!A1`)}?valueInputOption=RAW`, { method: "PUT", body: JSON.stringify({ values: [merged] }) });
  return merged;
}

async function readRows(name: SheetName) {
  const headers = await ensureSheet(name);
  const response = await googleFetch(`${BASE}/values/${encodeURIComponent(`${name}!A2:ZZ`)}`); const data = await response.json() as { values?: (string | number)[][] };
  return (data.values ?? []).map((values, index) => ({ rowNumber: index + 2, data: Object.fromEntries(headers.map((header, column) => [header, String(values[column] ?? "")])) }));
}

async function append(name: SheetName, row: Row) {
  const headers = await ensureSheet(name); const values = headers.map((header) => row[header] ?? "");
  await googleFetch(`${BASE}/values/${encodeURIComponent(`${name}!A:ZZ`)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, { method: "POST", body: JSON.stringify({ values: [values] }) });
}

function makeId(prefix: string) { const random = crypto.getRandomValues(new Uint8Array(4)); return `${prefix}-${new Date().getUTCFullYear()}-${Array.from(random, (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 5).toUpperCase()}`; }

export async function getUserByEmail(email: string) { const rows = await readRows("USERS"); return rows.find((row) => row.data.Email.toLowerCase() === email.toLowerCase()) ?? null; }
export async function upsertUser(input: { id: string; name: string; email: string; image?: string }) {
  const existing = await getUserByEmail(input.email); const now = new Date().toISOString();
  if (!existing) { await append("USERS", { User_ID: input.id, Name: input.name, Email: input.email, Profile_Image: input.image, Created_At: now, Last_Login: now }); return input.id; }
  const headers = [...SHEET_SCHEMAS.USERS]; const row = { ...existing.data, User_ID: input.id || existing.data.User_ID, Name: input.name, Profile_Image: input.image ?? "", Last_Login: now };
  await googleFetch(`${BASE}/values/${encodeURIComponent(`USERS!A${existing.rowNumber}`)}?valueInputOption=USER_ENTERED`, { method: "PUT", body: JSON.stringify({ values: [headers.map((header) => row[header as keyof typeof row] ?? "")] }) }); return String(row.User_ID);
}
export async function createProject(row: Row) { const id = makeId("INT"); await append("PROJECTS", { ...row, Project_ID: id, Status: "Submitted", Created_At: new Date().toISOString(), Submitted_At: new Date().toISOString() }); return id; }
export async function getProjectsByUser(userId: string, email: string) { return (await readRows("PROJECTS")).filter((row) => row.data.User_ID === userId || row.data.Email.toLowerCase() === email.toLowerCase()).map((row) => row.data); }
export async function getProjectById(id: string) { return (await readRows("PROJECTS")).find((row) => row.data.Project_ID === id)?.data ?? null; }
export async function saveEstimate(row: Row) { const id = makeId("EST"); await append("ESTIMATES", { ...row, Estimate_ID: id, Created_At: new Date().toISOString() }); return id; }
export async function createUploadRecord(row: Row) { const id = makeId("UPL"); await append("UPLOADS", { ...row, Upload_ID: id, Uploaded_At: new Date().toISOString() }); return id; }
export async function updateProjectStatus(id: string, status: string) { const rows = await readRows("PROJECTS"); const match = rows.find((row) => row.data.Project_ID === id); if (!match) return false; const headers = [...SHEET_SCHEMAS.PROJECTS]; const next: Record<string, string> = { ...match.data, Status: status }; await googleFetch(`${BASE}/values/${encodeURIComponent(`PROJECTS!A${match.rowNumber}`)}?valueInputOption=USER_ENTERED`, { method: "PUT", body: JSON.stringify({ values: [headers.map((header) => next[header] ?? "")] }) }); return true; }
