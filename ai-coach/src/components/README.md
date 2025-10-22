# Components

## Screen Groups
- **home/**: daily **Workouts**, **Meals**, **Progress**, **Report** screens.
- **onboarding/**: country/language selection + multistep profile wizard.
- **ui/**: shadcn-style primitives wrapping Radix UI with Tailwind tokens.

## Key Components
- `alternatives-modal.tsx` – AI-suggested replacements for exercises/meals.
- `bottom-nav.tsx` – mobile nav for 4 primary tabs.
- `demo-banner.tsx` – indicates demo data in use.
- `meal-card.tsx` / `workout-card.tsx` – item renderers.
- `workout-session-modal.tsx` – session timer + skip feedback capture.
- `progress-ring.tsx` – completion% visualization.
- `quick-tips.tsx` – habit reinforcement & subtle premium nudges.
- `settings-menu.tsx` – profile, premium toggle, regenerate plans, sign-out.
- `theme-toggle.tsx` – dark/light.

## Patterns
- Keep screens “thin”: fetch/derive state in container, pass data to presentational UI.
- All strings via `t(key, lang)` from `lib/i18n.ts`.
- Respect `isPremium` and render placeholders where required.

