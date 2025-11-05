# Netlify deployment guide

Follow these steps to publish the Expo web build on Netlify with the supplied Supabase project.

## 1. Connect the repository
1. Log in to Netlify and click **Add new site → Import an existing project**.
2. Choose GitHub (or your preferred provider) and grant Netlify access to the repository.
3. Select the `work` branch (or whichever branch you wish to deploy).

## 2. Configure build settings
Netlify reads the commands from `netlify.toml`, but double-check the settings during the import flow:

- **Base directory:** `app`
- **Build command:** `npm install && npm run build:web`
- **Publish directory:** `dist`
- **Node version:** Netlify picks up `NODE_VERSION=18` from the config file. Adjust if you require a different runtime.

## 3. Add environment variables
The public Supabase keys are already stored in `netlify.toml`. You can also manage them from the dashboard:

| Key | Value |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | `https://jerkvxvxdrgxjcrfvhpn.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implcmt2eHZ4ZHJneGpjcmZ2aHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjkyOTUsImV4cCI6MjA3NzkwNTI5NX0.zTPCDHxuYuqTYG3chGOOnycF_NuvtMpsB1eXWIC6r_8` |
| `EXPO_PUBLIC_FUNCTIONS_URL` | `https://jerkvxvxdrgxjcrfvhpn.supabase.co/functions/v1` |
| `EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET` | `study-uploads` |

> These values are safe to expose because they only grant access to Supabase’s public, client-side APIs. Keep the service-role key confined to Supabase Edge Functions.

## 4. Trigger a deploy
1. Click **Deploy site** to start the first build.
2. Netlify runs the Expo export command, generating the static site under `dist/` inside the `app/` directory.
3. After the build succeeds, use the assigned `.netlify.app` URL or add a custom domain.

## 5. Optional: environment overrides per branch
If you deploy preview branches with different Supabase projects, add branch-specific variables under **Site settings → Environment variables → Edit variables** and choose the branch context. Netlify merges those values with the defaults in `netlify.toml`.

With these steps complete, the web client will call your Supabase Edge Functions (`/generator/flashcards` and `/generator/quiz`) and respect the same configuration used locally via the `.env` file.
