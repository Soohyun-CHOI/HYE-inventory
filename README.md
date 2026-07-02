# Materials Inventory App

React (Vite) frontend + Vercel serverless functions proxying Airtable.

## Setup

```bash
npm install
cp .env.example .env.local
# fill in AIRTABLE_API_TOKEN in .env.local (Personal Access Token, scopes:
# data.records:read, data.records:write, restricted to this base)
```

## Local development

The `/api` functions need Vercel's dev server, not plain `vite dev`:

```bash
npm install -g vercel   # once
vercel dev
```

Plain `npm run dev` (vite only) will serve the frontend but `/api/*` calls
will 404 — use `vercel dev` for anything that touches Airtable.

## Architecture notes

- **`src/` never calls Airtable directly.** All data access goes through
  `src/services/api.js`, which calls our own `/api/*` routes.
- **`api/_lib/airtable.js`** is the only file that reads `AIRTABLE_API_TOKEN`.
  Never prefix Airtable-related env vars with `VITE_` — that would bundle
  them into client-side code.
- **`api/_lib/mappers.js`** holds every table ID and field ID for the base,
  plus helpers to convert between Airtable's field-ID-keyed records and the
  camelCase objects the rest of the app uses.
- **Auth is not wired up yet** (`api/_lib/auth.js`, `src/context/AuthContext.jsx`).
  Pick a provider (Supabase Auth, Firebase Auth, Clerk, ...) and fill in
  `getUserFromRequest()` — every API route already calls `requireRole()`
  wherever write access should be restricted.

## Deploy

Push to GitHub, import the repo in Vercel, set `AIRTABLE_API_TOKEN` and
`AIRTABLE_BASE_ID` as server-side environment variables in the Vercel
project settings (not in the repo).
