# Architecture

## App Layers
- **UI (src/components/)** – screen components, shadcn-style UI primitives.
- **State (src/store/)** – Zustand store for user profile, plans, logs, theme, premium flag.
- **Logic (src/lib/)** – API client, demo data, i18n dictionary, media mapping, supabase client.
- **Backend hooks (src/supabase/)** – Edge Function contract + call sites.
- **Utilities (src/utils/)** – env & project constants (Supabase anon key, project id).
- **Styling (src/styles/)** – globals, tokens, dark/light theme.

## Entry Points
- **index.html** – Vite mount point.
- **src/main.tsx** – React mount + global styles.
- **src/App.tsx** – navigation, onboarding, plan gen orchestration, theme/RTL, error states.

## Runtime Data Flow (short)
1. User completes onboarding → `lib/api.generatePlans`.
2. Supabase Edge Function (server/index.tsx) calls OpenAI to build plans.
3. On failure, `lib/demo-data.ts` supplies fallback.
4. User logs meals/workouts → `store/app-store.ts` persists to localStorage.
5. Skip reasons flow back into the next `generatePlans` call.

