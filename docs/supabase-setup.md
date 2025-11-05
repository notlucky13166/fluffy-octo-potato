# Supabase + Magic Link setup

Follow these steps to connect the Expo client to your Supabase project and enable passwordless sign-in with magic links.

## 1. Prepare the Supabase project
1. Sign in at [supabase.com](https://supabase.com) and open the project associated with `https://jerkvxvxdrgxjcrfvhpn.supabase.co`.
2. Confirm the API keys in **Project Settings → API**:
   - **Project URL:** `https://jerkvxvxdrgxjcrfvhpn.supabase.co`
   - **Anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implcmt2eHZ4ZHJneGpjcmZ2aHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjkyOTUsImV4cCI6MjA3NzkwNTI5NX0.zTPCDHxuYuqTYG3chGOOnycF_NuvtMpsB1eXWIC6r_8`
   - **Service role key (server-side only):** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implcmt2eHZ4ZHJneGpjcmZ2aHBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjMyOTI5NSwiZXhwIjoyMDc3OTA1Mjk1fQ.gbjuUHjfpSq0WV2sr-AR_CDEGt4ukuWahVlX2ZcE7sI`

   > ⚠️ **Never commit the service role key** to git or ship it inside the client—store it only in server-side environments (Edge Functions, backend jobs, CI secrets).

3. In **Storage → Buckets**, create a bucket named `study-uploads` (public access disabled). This bucket matches the path conventions referenced in the Create screen.
4. In **Database → Tables**, create the following tables (or import the provided SQL migration if you have one):
   - `study_folders` – stores folder metadata (`id`, `name`, `subject`, `created_by`, `created_at`).
   - `study_files` – stores file records per folder (`id`, `folder_id`, `path`, `content_type`, `pages`, `created_at`).
   - `generated_flashcards` – stores generated flashcards (`id`, `folder_id`, `prompt`, `answer`, `difficulty`, `created_at`).
   - `generated_quizzes` – stores quiz questions (`id`, `folder_id`, `question`, `choices`, `answer`, `difficulty`, `created_at`).
   - `flashcard_reviews` – tracks spaced-repetition metadata (`flashcard_id`, `ease_factor`, `interval_days`, `next_review_at`, `last_reviewed_at`).
   - `supporter_waitlist` – optional table for donation opt-ins (`id`, `user_id`, `tier`, `note`, `created_at`).

5. Enable Row Level Security on each table and add policies that allow:
   - Authenticated users to `select` their own data.
   - Insert/update/delete only for rows where `created_by = auth.uid()` (or matching folder ownership).

6. Head to **Edge Functions** and deploy the functions backing the app’s generators:
   - `generator/flashcards`
   - `generator/quiz`

   Each function can use the service role key via environment variables (`SUPABASE_SERVICE_ROLE_KEY`) to pull files from storage, run AI extraction (Supabase AI GPT-4o mini), and persist generated content.

## 2. Configure magic link authentication
1. In **Authentication → Providers**, keep only **Email** enabled and toggle **Magic Link**.
2. Set the **Site URL** (under **URL Configuration**) to your Expo dev tunnel or deployed web origin so Supabase knows where to redirect after email verification (e.g., `exp+supabase://localhost` for development with `expo-dev-client`).
3. Customize the email template in **Authentication → Templates → Magic Link** to explain the AetherLearn mission and reassure learners it’s a free experience.
4. Optional: turn on **Confirm email** to require users to click the magic link before accessing protected tabs.

## 3. Environment variables for the Expo app
1. Create an `.env` file (ignored by git) at the repo root:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://jerkvxvxdrgxjcrfvhpn.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implcmt2eHZ4ZHJneGpjcmZ2aHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjkyOTUsImV4cCI6MjA3NzkwNTI5NX0.zTPCDHxuYuqTYG3chGOOnycF_NuvtMpsB1eXWIC6r_8
   EXPO_PUBLIC_FUNCTIONS_URL=https://jerkvxvxdrgxjcrfvhpn.supabase.co/functions/v1
   ```

2. Ensure `app/app.json` (or `app.config.ts`) reads the variables through `expo-constants`. The current project already expects `extra.supabaseUrl`, `extra.supabaseAnonKey`, and `extra.functionsUrl`.
3. Restart the Expo server after editing environment variables so the new values load.

## 4. Connect the client
1. The Supabase client factory (`app/src/api/hooks.ts`) will automatically pick up the env values and attach the anon key to requests.
2. The authentication store (`app/src/store/useAuthStore.ts`) should call `supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })` to send the magic link and `supabase.auth.getSession()` to resume sessions.
3. After the user taps the magic link, Supabase redirects back to the app, completing the sign-in flow. Use `supabase.auth.onAuthStateChange` to react to session updates and unlock the main navigation tabs.

## 5. Securing server-side actions
- Edge Functions should access Supabase via the service role key stored in the project’s environment variables—not hard-coded in source control.
- When invoking AI (Supabase AI GPT-4o mini), ensure the function streams results back to the client and caches outputs per folder to stay within the free tier.
- Schedule periodic cleanup (e.g., delete orphaned uploads) using Supabase cron or GitHub Actions hitting the service role-protected endpoints.

With this setup, learners can sign in with a single click, upload references, and generate flashcards/quizzes—all while keeping the entire experience free.
