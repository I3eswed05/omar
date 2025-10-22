# Data Flow & Interactions

## Onboarding
- `App.tsx` manages state; on completion, triggers `lib/api.generatePlans(profile, week, feedback?)`.

## Plans & Feedback
- Skip reasons captured in `workout-session-modal` → stored in `app-store`.
- Subsequent `generatePlans` calls include feedback for personalization.

## Logging & Persistence
- Meal/workout logs stored by day/week in `app-store` (localStorage).
- Toggle consumed/skipped for meals; session modal records workout outcomes.

## Premium Gating
- `settings-menu.tsx` toggles `isPremium`.
- Components read `isPremium` to show placeholders or premium hints (e.g., videos).

## Localization & RTL
- `lib/i18n.ts` houses dialect tables; `App.tsx` sets `document.dir = 'rtl' | 'ltr'`.
- `t(key, language)` provides strings per component.

## Theming
- `theme-toggle.tsx` updates `store.theme`; `App.tsx` toggles `.dark` on `documentElement`.

## Supabase Edge Function
- Validates payload (Zod), composes OpenAI prompts, returns JSON plans/alternatives/weekly report.

