# store – Zustand State

`app-store.ts` persists:
- Auth (if added), onboarding profile/completion,
- Plans and logs (workouts/meals),
- Premium flag, weekly report string,
- UI: selected day, theme.

Methods:
- Replace exercises/meals, clear state, toggle premium, regenerate, etc.

Persistence:
- Backed by `localStorage`. Consider versioning/migrations when schema changes.

