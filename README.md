# AetherLearn

AetherLearn is a concept-stage, AI-powered study companion for Android focused on helping students and lifelong learners study smarter. This repository contains a React Native (Expo) mobile skeleton, core state models, and product design documentation.

## Highlights
- **Custom Quiz Generator** – Adaptive question pipeline supporting multiple formats.
- **AI Flashcard Creator** – Upload notes or textbook snapshots to auto-generate flashcards, summaries, follow-up actions, and insights.
- **Study folders & uploads** – Organize PDFs, images, and slide decks per subject so the AI can build targeted quizzes and shared decks.
- **Spaced repetition planner** – Adaptive review queue with due counts, mastery analytics, and timeline guidance for every folder.
- **Folder mastery dashboards** – AI summaries, focus areas, and collaborator tracking surface progress at a glance.
- **Image-first ingestion** – Vision-friendly upload flow for diagrams, handwriting, and slides.
- **Bite-sized lessons** – Daily schedule with micro-learning recommendations and instant summaries.
- **Progress intelligence** – Radar charts, streak tracking, and mastery analytics.
- **Gamification & collaboration** – Badges, streaks, community challenges, invite-based study folders, and live group quizzes.
- **Mission-driven access** – Narrative sign-in/sign-up flows that reinforce the free-for-everyone mission with optional supporter pledges for future upgrades.

## Project Structure
```
├── README.md
├── docs/
│   ├── architecture.md
│   ├── ui-flow.md
│   └── vision.md
└── app/
    ├── App.tsx
    ├── package.json
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── screens/
    │   ├── services/
    │   ├── store/
    │   ├── theme/
    │   └── utils/
    └── ...
```

## Getting Started
1. Install dependencies: `cd app && npm install` (requires Node 18+).
2. Run on Android emulator or device: `npx expo start --android`.
3. Use Expo Go for quick previews during prototyping.
4. Run the project in a browser: `npm run web`.

### Configure Supabase & magic link auth
- Follow the step-by-step guide in [`docs/supabase-setup.md`](docs/supabase-setup.md) to connect the client to Supabase, enable magic link authentication, and provision the storage buckets/tables the app expects.
- Populate an `.env` file with your Supabase project URL, anon key, and functions URL before running the client so API calls succeed.

## Web & Netlify Deployment
The Expo project is configured for static web export so it can be hosted on Netlify or any other static host.

### Local web build
- From the `app/` directory run `npm run build:web`.
- The production-ready static site is emitted to `app/dist/`.
- If you see a runtime error about missing Expo web support, install the Expo web runtime with `npx expo install @expo/metro-runtime@~3.1.3`.

### Netlify configuration
- **Base directory:** `app`
- **Build command:** `npm install && npm run build:web`
- **Publish directory:** `dist`
- **Web runtime dependency:** Keep `@expo/metro-runtime@~3.1.3` in `package.json` (or the matching version for your Expo SDK) so `npm install` on Netlify pulls the required web runtime.
- **Environment variables:**
  - `EXPO_PUBLIC_SUPABASE_URL=https://jerkvxvxdrgxjcrfvhpn.supabase.co`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Implcmt2eHZ4ZHJneGpjcmZ2aHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzMjkyOTUsImV4cCI6MjA3NzkwNTI5NX0.zTPCDHxuYuqTYG3chGOOnycF_NuvtMpsB1eXWIC6r_8`
  - `EXPO_PUBLIC_FUNCTIONS_URL=https://jerkvxvxdrgxjcrfvhpn.supabase.co/functions/v1`
  - `EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET=study-uploads`

These settings are codified in `netlify.toml`, so Netlify auto-detects the build and pre-populates the public Supabase environment keys. If you prefer managing secrets in the dashboard, add the same variables under **Site settings → Environment variables**. See [`docs/netlify.md`](docs/netlify.md) for a full walkthrough of the Netlify deployment flow.

> **Note:** API hooks reference Supabase Edge Functions (see `docs/backend.md`) that stay within the free tier while powering AI generation.

## Next Steps
- Connect the new auth flow to Supabase Auth and secure storage.
- Wire optional supporter pledges to a payment provider while keeping experiences free-first.
- Connect React Query hooks to real AI services.
- Implement progress persistence and offline caching.
- Add Detox E2E tests and CI automation.

## License
MIT
