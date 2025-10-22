# Architecture Overview

- **Client**: React SPA (Vite) + Tailwind/shadcn primitives.
- **State**: Zustand with persistence.
- **AI/Serverless**: Supabase Edge Function → OpenAI.
- **i18n/RTL**: `i18n.ts` + `document.dir` set in `App.tsx`.

See per-folder READMEs for detailed responsibilities and flows.

