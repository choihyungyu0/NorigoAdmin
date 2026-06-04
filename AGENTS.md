# NoriGo Admin Agent Guide

## Project Scope

- React + TypeScript + Vite admin dashboard for Seoul tourism operations.
- Use strict TypeScript and keep data contracts in `src/types`.
- Keep UI components in `src/components` and data access in `src/services`.
- Keep mock data in `src/mocks`; do not embed mock arrays inside page or UI components.

## Security Rules

- Never add real API keys or secrets.
- Browser code may only read `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Never expose a Supabase service role key in browser code, `.env.example`, README examples, or logs.
- Admin write operations must be represented as service functions that can later call Supabase Edge Functions.
- Do not implement direct browser writes for privileged admin actions.

## Privacy Rules

- Do not display individual user location.
- Do not display individual user itinerary.
- Only show aggregated area-level counts, trends, time buckets, and delivery metrics.
- Review new charts and tables for accidental personal data exposure.

## UI Rules

- Desktop-first civic-tech dashboard.
- Light theme, white cards, subtle gray borders, blue primary accent.
- Use clean Korean labels in data-heavy views.
- Keep spacing consistent and information dense.
- Preserve responsive tablet fallback.

## Commands

- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Type-check: `npm run typecheck`
- Lint: `npm run lint`
- Production build: `npm run build`

## Review Guidelines

- Confirm strict TypeScript passes.
- Confirm ESLint passes without unsafe exports or hooks misuse.
- Confirm production build passes.
- Check that new UI does not introduce individual user tracking displays.
