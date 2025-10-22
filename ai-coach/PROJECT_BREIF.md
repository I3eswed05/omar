# AI Coach – Comprehensive Project Brief

> Arabic-first fitness web app offering adaptive workouts, halal-sensitive meal plans, and light-touch coaching.

## 1) Product Overview
- React + TypeScript app with RTL and five locales (EN + 4 Arabic dialects).
- Adaptive plans via Supabase Edge Function → OpenAI (gpt-4o-mini).
- Skip-reason intelligence informs the next plan generation.
- Premium gating (gentle): guided videos and weekly narrative reports.

## 2) Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn-style primitives, design tokens
- **State:** Zustand (persisted in localStorage)
- **Backend/AI:** Supabase Edge Functions + OpenAI
- **Localization:** custom i18n table (EN + 4 Arabic dialects), RTL
- **Deployment:** static build (`build/`) + Supabase functions
- **Tooling:** TS, PostCSS/Tailwind, npm

## 3) Folder Map (high level)
project root/
├─ build/ # Vite output (hashed assets)
├─ docs/ # Hand-authored docs
├─ src/ # App source
└─ ...

## 4) Key Capabilities
- Onboarding → plan generation (AI with demo fallback)
- Logging meals/workouts + skip-reason feedback
- Premium gating for videos and weekly reports
- RTL + dialect-aware UI

## 5) Links
- See `docs/ARCHITECTURE.md` for structure
- See `docs/DATA_FLOW.md` for the end-to-end lifecycle
- See `docs/DEPLOYMENT.md` to build & deploy

