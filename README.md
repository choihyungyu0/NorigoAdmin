# NoriGo Admin

NoriGo Admin is a React + TypeScript dashboard foundation for municipality and tourism operators monitoring Seoul tourism operations. It focuses on aggregated area-level operations data across crowding, `risk_score`, Re-Trip movement flows, Culture Scan friction signals, Discover hidden spot performance, notice delivery, data quality, API health, admin actions, and audit logs.

## Stack

- React, TypeScript, Vite
- Tailwind CSS
- React Router
- TanStack Query
- Supabase JS client
- Recharts
- lucide-react
- clsx, tailwind-merge
- date-fns

## Setup

```bash
npm install
```

Create a local environment file from the example when Supabase is ready:

```bash
cp .env.example .env.local
```

## Environment Variables

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Do not add a Supabase service role key to browser environment files.

## Scripts

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
npm run preview
```

## Pages

- `/` Overview
- `/live-map` Live Map
- `/areas/:areaId` Area Detail
- `/re-trip` Re-Trip Monitor
- `/culture` Culture Insights
- `/discover` Discover Performance
- `/notices` Visitor Notice Manager
- `/data-quality` Data Quality
- `/reports` Reports
- `/settings` Admin Settings

## Security Notes

- Browser code only uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Service role keys must never be placed in `.env.example`, `.env.local`, source files, or browser bundles.
- Admin write operations are modeled as service functions that can later call Supabase Edge Functions.
- Current data is mock data and does not perform privileged backend writes.

## Privacy Notes

- The dashboard does not display individual user locations.
- The dashboard does not display individual user itineraries.
- UI should only show aggregated area-level counts, trends, time buckets, delivery metrics, and quality signals.
- Mock data is separated from UI components under `src/mocks`.

## Run Locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.
