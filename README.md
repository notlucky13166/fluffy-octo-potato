# AetherLearn

AetherLearn is a concept-stage, AI-powered study companion for Android focused on helping students and lifelong learners study smarter. This repository contains a React Native (Expo) mobile skeleton, core state models, and product design documentation.

## Highlights
- **Custom Quiz Generator** – Adaptive question pipeline supporting multiple formats.
- **AI Flashcard Creator** – Upload notes or textbook snapshots to auto-generate flashcards, summaries, and insights.
- **Study folders & uploads** – Organize PDFs, images, and slide decks per subject so the AI can build targeted quizzes.
- **Image-first ingestion** – Vision-friendly upload flow for diagrams, handwriting, and slides.
- **Bite-sized lessons** – Daily schedule with micro-learning recommendations and instant summaries.
- **Progress intelligence** – Radar charts, streak tracking, and mastery analytics.
- **Gamification & collaboration** – Badges, streaks, community challenges, shared decks, and live group quizzes.

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

## Web & Netlify Deployment
The Expo project is configured for static web export so it can be hosted on Netlify or any other static host.

### Local web build
- From the `app/` directory run `npm run build:web`.
- The production-ready static site is emitted to `app/dist/`.

### Netlify configuration
- **Base directory:** *(leave blank; `netlify.toml` installs dependencies from `app/` automatically)*
- **Build command:** `npm install --prefix app && npm run --prefix app build:web`
- **Publish directory:** `app/dist`
- **Node version (optional environment variable):** `NODE_VERSION=18`

These settings are codified in `netlify.toml` so Netlify can automatically detect them on deploy.

> **Note:** API hooks reference Supabase Edge Functions (see `docs/backend.md`) that stay within the free tier while powering AI generation.

## Next Steps
- Integrate authentication and secure storage.
- Connect React Query hooks to real AI services.
- Implement progress persistence and offline caching.
- Add Detox E2E tests and CI automation.

## License
MIT
