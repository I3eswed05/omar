# Home Screens

- **WorkoutsScreen.tsx** – shows daily plan; opens `workout-session-modal`; records skip reasons.
- **MealsScreen.tsx** – meals with macros, conversions; request alternatives.
- **ProgressScreen.tsx** – adherence stats + rings.
- **ReportScreen.tsx** – premium narrative report placeholder + upgrade CTA.

**State sources:** `store/app-store.ts` (plans/logs/theme/premium), `lib/api.ts` (plan/alternatives).

