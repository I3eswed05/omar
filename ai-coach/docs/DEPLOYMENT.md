# Deployment

## Build
```bash
npm ci
npm run build

Outputs to build/ with hashed assets.

Supabase Edge Functions

Ensure env: OPENAI_API_KEY, project id, anon key.

Deploy function (example):

supabase functions deploy server

Hosting

Serve build/ as static hosting (e.g., Netlify, Vercel, Supabase Storage/Hosting).

Configure SPA fallback to build/index.html.
