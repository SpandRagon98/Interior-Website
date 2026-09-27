# House of Veya

A responsive luxury interior design website built with Next.js, TypeScript, Tailwind CSS and Framer Motion.

## Website

The production site is hosted with GitHub Pages:

`https://spandragon98.github.io/Interior-Website/`

Every push to `main` runs `.github/workflows/deploy.yml`, checks the code, creates a static export and publishes the `out/` directory to GitHub Pages. No Cloudflare account or deployment secrets are required.

## Features

- Editorial homepage and responsive navigation
- Project portfolio and project detail pages
- Services, styles, process, about and contact pages
- Browser-based interior budget estimator
- Nine-step project enquiry that saves progress locally and prepares an email to the studio
- Privacy and terms pages
- Static metadata, sitemap and robots rules
- Keyboard focus states and reduced-motion support

Because GitHub Pages is static hosting, the site does not include server-side accounts, Google OAuth, Google Sheets or file uploads. Project details stay in the visitor's browser until they choose to open and send the prepared email.

## Local development

Requires Node.js 22 or later.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks and production build

```bash
npm run typecheck
npm run lint
npm run build
```

The static website is written to `out/`.

## Deployment

GitHub Actions publishes automatically after changes reach `main`. You can also start the workflow manually from the repository's **Actions** tab.

If GitHub Pages has not been enabled previously, open **Settings → Pages** and set **Source** to **GitHub Actions**.
