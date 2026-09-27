import { existsSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const outputPath = resolve(process.argv[2] ?? ".cloudflare-secrets.json");
const runtimeSecretNames = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
  "GOOGLE_SHEET_ID",
  "GOOGLE_DRIVE_FOLDER_ID",
  "AUTH_SECRET",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
];

const runtimeSecrets = Object.fromEntries(
  runtimeSecretNames.flatMap((name) => {
    const value = process.env[name];
    return value ? [[name, value]] : [];
  }),
);

if (Object.keys(runtimeSecrets).length === 0) {
  if (existsSync(outputPath)) {
    rmSync(outputPath);
  }

  console.log("No optional runtime secrets were supplied.");
  process.exit(0);
}

writeFileSync(outputPath, `${JSON.stringify(runtimeSecrets)}\n`, {
  encoding: "utf8",
  mode: 0o600,
});

console.log(
  `Prepared ${Object.keys(runtimeSecrets).length} runtime secret(s) for deployment.`,
);
