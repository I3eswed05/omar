# Onboarding Flow

1. `WelcomeScreen.tsx` → hero + start.
2. `CountrySelectScreen.tsx` → locale & RTL selection.
3. `OnboardingScreen.tsx` → body metrics, goals, diet.

On completion → `App.tsx` triggers `lib/api.generatePlans()`. Persisted in `app-store`.

