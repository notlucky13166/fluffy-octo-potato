# AetherLearn

AetherLearn is a concept-stage, AI-powered study companion for Android focused on helping students and lifelong learners study smarter. This repository contains a React Native (Expo) mobile skeleton, core state models, and product design documentation.

## Highlights
- **Custom Quiz Generator** – Adaptive question pipeline supporting multiple formats.
- **AI Flashcard Creator** – Upload notes or textbook snapshots to auto-generate flashcards, summaries, and insights.
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

> **Note:** API hooks reference placeholder endpoints. Connect them to your backend orchestration layer for full functionality.

## Next Steps
- Integrate authentication and secure storage.
- Connect React Query hooks to real AI services.
- Implement progress persistence and offline caching.
- Add Detox E2E tests and CI automation.

## License
MIT
