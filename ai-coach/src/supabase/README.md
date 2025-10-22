# supabase – Edge Functions

`functions/server/index.tsx`:
- Validates input with Zod.
- Builds prompts (injects skip reasons when present).
- Calls OpenAI (gpt-4o-mini) for:
  - workout & meal plan generation,
  - alternatives,
  - weekly reports.
- Responds JSON to the frontend.

Deployment:
- Supabase functions deploy independently of the web build.
- Requires env (project URL, anon key) and OpenAI credentials.

