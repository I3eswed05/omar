
---

## Source tree docs

### `src/README.md`
> Where to put: `project root/src/README.md`

```markdown
# src Overview

## Root files
- **App.tsx** – app shell, onboarding, plan orchestration, theme/RTL, error boundaries.
- **main.tsx** – React root render + global styles import.
- **index.css** – Tailwind layers + base.
- **Attributions.md / FEATURES.md / README.md** – contributor docs.

## Directories
- **components/** – screens + UI primitives.
- **guidelines/** – product/design guidance for contributors.
- **lib/** – API client, demo data, i18n, media, supabase client.
- **public/** – PWA manifest, service worker, images.
- **store/** – Zustand store (state shape + actions).
- **styles/** – tokens, theming, variables.
- **supabase/** – Edge Function code and integration notes.
- **utils/** – constants for Supabase project/keys.

