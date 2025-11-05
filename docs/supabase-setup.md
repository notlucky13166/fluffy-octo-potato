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
4. In **Database → Tables**, create the following tables (or import the provided SQL migration if you have one). The inline SQL shows the recommended column types the UI and Edge Functions expect:

   ```sql
   create table public.study_folders (
     id uuid primary key default gen_random_uuid(),
     name text not null,
     subject text,
     created_by uuid references auth.users not null,
     created_at timestamptz not null default now()
   );

   create table public.study_files (
     id uuid primary key default gen_random_uuid(),
     folder_id uuid references public.study_folders(id) on delete cascade not null,
     path text not null,
     content_type text not null,
     pages integer,
     created_at timestamptz not null default now()
   );

   create table public.generated_flashcards (
     id uuid primary key default gen_random_uuid(),
     folder_id uuid references public.study_folders(id) on delete cascade not null,
     prompt text not null,
     answer text not null,
     difficulty text check (difficulty in ('easy','medium','hard')) default 'medium',
     summary text,
     follow_up_tasks text,
     created_at timestamptz not null default now()
   );

   create table public.generated_quizzes (
     id uuid primary key default gen_random_uuid(),
     folder_id uuid references public.study_folders(id) on delete cascade not null,
     question text not null,
     choices jsonb,
     answer text not null,
     difficulty text check (difficulty in ('easy','medium','hard')) default 'medium',
     created_at timestamptz not null default now()
   );

   create table public.flashcard_reviews (
     flashcard_id uuid references public.generated_flashcards(id) on delete cascade primary key,
     ease_factor numeric(4,2) not null default 2.5,
     interval_days integer not null default 1,
     next_review_at timestamptz not null,
     last_reviewed_at timestamptz
   );

   create table public.supporter_waitlist (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users on delete cascade,
     tier text,
     note text,
     created_at timestamptz not null default now()
   );
   ```

5. Enable Row Level Security on each table and add policies that allow:
   - Authenticated users to `select` their own data.
   - Insert/update/delete only for rows where `created_by = auth.uid()` (or matching folder ownership).

6. Head to **Edge Functions** and deploy the functions backing the app’s generators. A quick way to do this is with the [Supabase CLI](https://supabase.com/docs/reference/cli/start):

   1. Install the CLI (`npm install -g supabase`) and authenticate with your project: `supabase login`.
   2. Inside this repository (or an empty folder), scaffold the functions that match the routes the Expo app calls:

      ```bash
      supabase functions new generator/flashcards
      supabase functions new generator/quiz
      ```

      The CLI creates `supabase/functions/generator/flashcards/index.ts` (or `.js`) and a matching folder for `quiz`.

   3. Open each `index.ts` and implement the handler that:
      - Reads the request body for `folderId`, `subject`, and `notes` (see `app/src/api/hooks.ts` for the expected payload).
      - Fetches folder files from Storage using the service role key.
      - Sends those files to Supabase AI’s GPT-4o mini to extract concepts.
      - Writes the generated flashcards or quiz rows back to the `generated_flashcards` and `generated_quizzes` tables.

      > You can start from Supabase’s [Edge Functions + OpenAI template](https://supabase.com/docs/guides/functions/examples/openai) and swap in GPT-4o mini along with your folder-specific logic.

   4. Provide the function with secrets so it can talk to your project securely:

      ```bash
      supabase secrets set SUPABASE_URL=https://jerkvxvxdrgxjcrfvhpn.supabase.co \
        SUPABASE_SERVICE_ROLE_KEY="<service-role-key>" \
        OPENAI_API_KEY="<supabase-ai-or-openai-key>"
      ```

      Replace the placeholder values with the real service role key and AI API key. Secrets are stored server-side and never ship to the Expo client.

   5. Deploy the functions so they’re reachable at `https://jerkvxvxdrgxjcrfvhpn.supabase.co/functions/v1/generator/flashcards` and `/generator/quiz`:

      ```bash
      supabase functions deploy generator/flashcards --project-ref jerkvxvxdrgxjcrfvhpn
      supabase functions deploy generator/quiz --project-ref jerkvxvxdrgxjcrfvhpn
      ```

   If you prefer the Supabase dashboard, you can create functions there with the same names, paste the handler code, add the secrets under **Config → Environment Variables**, and click **Deploy**. Either way, the service role key is used server-side (via `SUPABASE_SERVICE_ROLE_KEY`) to pull files from Storage, run AI extraction (Supabase AI GPT-4o mini), and persist generated content.

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
