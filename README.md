# House of Veya

A production-oriented luxury interior design website built with the Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide, Auth.js, Google Sheets and Google Drive.

## What Codex has already completed

- Original House of Veya visual identity, responsive design system and interior imagery.
- Complete homepage with editorial hero, categories, philosophy, projects, styles, services, budget guidance, estimator, transformation, process, craftsmanship, warranty, stories, FAQ and final CTA.
- All requested routes: projects and project details, services, styles, estimate, process, about, contact, project questionnaire, sign-in, account, account project details, privacy and terms.
- Nine-step project questionnaire with automatic local draft persistence. Selected upload files are kept in IndexedDB so an OAuth redirect does not erase them.
- Server-side Auth.js Google OAuth integration. No passwords are stored.
- Server-only Google Sheets and Drive access using a service-account JWT and Google REST APIs.
- Automatic creation of `USERS`, `PROJECTS`, `UPLOADS` and `ESTIMATES` tabs, plus non-destructive addition of missing headers.
- Repository layer between the UI and Google Sheets for easier future database migration.
- Human-readable project IDs such as `INT-2026-A8F32`.
- Ownership checks on account projects and uploads; identities are derived from the authenticated session, never from browser-supplied email or user IDs.
- Upload type and 10 MB size validation for JPG, PNG, WEBP and PDF files.
- Config-driven services, styles, pricing, process, projects, testimonials and FAQs.
- Metadata, sitemap, robots rules, semantic HTML, keyboard focus states, reduced-motion support, loading and 404 states.

## What you need to configure manually

Real Google credentials are intentionally not included. Complete the steps below before testing sign-in, live Sheet reads/writes or Drive uploads.

### 1. Create or select a Google Cloud project

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project or select an existing project owned by your organisation.
3. Record the project name so OAuth and the service account are easy to identify later.

### 2. Enable the APIs

In **APIs & Services → Library**, enable:

- Google Sheets API
- Google Drive API

### 3. Create a service account

1. Open **IAM & Admin → Service Accounts**.
2. Select **Create service account**.
3. Name it something clear, such as `house-of-veya-website`.
4. No broad Google Cloud IAM role is required for Sheet/Drive access; the individual Sheet and Drive folder will be shared directly.
5. Open the new service account and note its email address.

### 4. Generate credentials

1. On the service-account page, open **Keys**.
2. Choose **Add key → Create new key → JSON**.
3. Download the JSON file once and keep it in a secure password manager or secrets vault.
4. Copy `client_email` to `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
5. Copy `private_key` to `GOOGLE_PRIVATE_KEY`. Preserve the `\n` line breaks exactly as shown in `.env.example`.

Never commit the JSON key or a real `.env` file.

### 5. Share the Google Sheet

The configured spreadsheet is:

`1p_6v4ESAQW47x25m4yk8V-AlQWyYrtici8g9inKoJZ4`

1. Open the Sheet.
2. Select **Share**.
3. Add the service-account email as an **Editor**.
4. Do not delete or rename existing content. The application creates missing tabs and appends missing headers without removing existing columns or rows.

### 6. Create and share the Drive upload folder

1. In Google Drive, create a dedicated folder such as `House of Veya Website Uploads`.
2. Share the folder with the service-account email as an **Editor**.
3. Open the folder and copy the identifier from its URL: `drive.google.com/drive/folders/FOLDER_ID`.
4. Add that value as `GOOGLE_DRIVE_FOLDER_ID`.

Keep the folder restricted. Project files do not need to be public.

### 7. Configure Google OAuth

1. In Google Cloud Console, open **APIs & Services → OAuth consent screen**.
2. Configure your brand name, support email and required contact details.
3. Choose the appropriate audience. While testing an external app, add your test Google accounts.
4. Open **Credentials → Create credentials → OAuth client ID**.
5. Choose **Web application**.
6. Add authorised JavaScript origins:
   - `http://localhost:5173`
   - your final production origin, for example `https://your-domain.com`
7. Add authorised redirect URIs:
   - `http://localhost:5173/api/auth/callback/google`
   - `https://your-domain.com/api/auth/callback/google`
8. Copy the client ID and client secret into `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

Google OAuth requires the redirect URL to match exactly, including scheme, hostname and path.

### 8. Add environment variables

Copy `.env.example` to `.env.local` and fill in every value. Generate a secret with a secure random generator and use it for both `AUTH_SECRET` and `NEXTAUTH_SECRET`.

For the hosted Site, add the same values through the hosting environment-variable settings. Mark the OAuth secret, service-account private key and Auth secret as sensitive secrets.

### 9. Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

For a production build:

```bash
npm run build
```

### 10. Verify the live integration

After configuration, test in this order:

1. Sign in with Google.
2. Confirm a row appears or updates in `USERS`.
3. Calculate an estimate while signed in and confirm `ESTIMATES` receives it.
4. Start a project, refresh midway and confirm the answers remain.
5. Add a small JPG or PDF, complete Google sign-in if required and submit.
6. Confirm a new `PROJECTS` row with a unique `INT-...` ID.
7. Confirm the file exists in the Drive folder and `UPLOADS` contains its Drive ID and URL.
8. Open `/account` and verify only the signed-in user's projects appear.
9. Try opening another user's project URL while signed into the wrong account; the route must return not found.

### 11. Deploy automatically from GitHub

The repository includes `.github/workflows/deploy.yml`. Every push to `main` type-checks and builds the application, then deploys the generated Vinext worker to Cloudflare Workers. The workflow can also be run manually from the repository's **Actions** tab.

In **Settings → Environments**, create a `production` environment. Add these required Actions secrets to that environment (or as repository secrets):

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Add the following application secrets for Google sign-in, Sheets and Drive:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `GOOGLE_SHEET_ID`
- `GOOGLE_DRIVE_FOLDER_ID`
- `AUTH_SECRET`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

The workflow creates a temporary JSON file only on the GitHub-hosted runner, passes it to Wrangler's `--secrets-file` option, and deletes it after deployment. The file is ignored by Git and secret values are never printed.

The first successful run creates or updates the `house-of-veya` Worker. Set `NEXTAUTH_URL` to its final `workers.dev` or custom-domain URL, add the matching `/api/auth/callback/google` URI to the Google OAuth client, and run the workflow again.

For a manual production deployment after building, run:

```bash
npm run build
npm run deploy
```

This project is also compatible with the bundled Sites deployment path. Add production environment variables before any deployment that must use Google services. If you deploy elsewhere, use a platform that supports Next.js App Router server routes, server-side environment secrets and outbound HTTPS requests to Google APIs.

Update these URLs after choosing the final production domain:

- OAuth authorised origin and redirect URI
- `NEXTAUTH_URL`
- the absolute base URL in `app/sitemap.ts` and `app/robots.ts`

## Data architecture

Browser components call only application API routes. Those routes validate input, derive identity from the Auth.js session and call repository modules. Repositories call the Google service layer. UI components therefore do not depend on Google Sheets and can move to another database later without being rewritten.

```text
React UI → Next.js route → repository → Google Sheets / Drive
                    ↘ authenticated server session
```

## Pricing changes

All estimate rates, city multipliers, additions and range logic live in `config/pricing.ts`. Content collections live under `config/` and `data/`.

## Security notes

- Never expose service-account values through variables prefixed with `NEXT_PUBLIC_`.
- Rotate a key immediately if it is pasted into chat, committed or otherwise exposed.
- Keep the upload folder and spreadsheet restricted to the service account and authorised staff.
- Review Google Cloud audit logs and rotate service-account keys periodically.
- Before a public launch, replace the development fallback Auth secret by setting a strong production secret.
