# lib – Services & Utilities

## `api.ts`
Fetch wrapper for Supabase Edge Functions:
- `generatePlans(profile, week, feedback?)`
- `generateWeeklyReport(profile, range)`
- `requestExerciseAlternatives(...)`
- `requestMealAlternatives(...)`
Handles error parsing and returns JSON; falls back handled by callers.

## `demo-data.ts`
Static workout/meal plans used when AI calls fail or demo mode is forced.

## `i18n.ts`
- Dictionary for English + Gulf, Egyptian, Levantine, Maghreb.
- `LANGUAGE` types, `directionFor(language)` to set `document.dir`.
- Use `t(key, language)` to fetch strings.

## `media.ts`
- Placeholder logic for exercise images/videos.
- Respects premium gating: shows text placeholders when not premium.

## `supabase.ts`
- Frontend Supabase client setup (anon key, project URL).
- Used for future persistence (if expanded).

### Notes
- Keep network code here; components consume via hooks or props.
- All user-visible strings must come through `i18n.ts`.

