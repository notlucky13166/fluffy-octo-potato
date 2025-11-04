# AetherLearn Technical Architecture

## Stack Overview
- **Mobile App**: React Native (Expo) with TypeScript, Zustand for state management, React Query for networking, Victory Native for charts.
- **AI Services**: REST endpoints orchestrating third-party LLMs and vision APIs, plus internal microservices for adaptive learning algorithms.
- **Backend**: NestJS (Node.js) with PostgreSQL, Redis for caching/session storage, and WebSocket gateway for collaboration features.
- **Storage**: S3-compatible object storage for file uploads, CDN for media delivery.
- **Auth**: OAuth 2.1 + passwordless magic links via Supabase Auth.
- **Analytics**: Segment SDK + self-hosted Metabase dashboards.

## Mobile Module Map
```
app/
 └─ src/
     ├─ api/              // typed API clients, React Query hooks
     ├─ components/       // design system primitives and complex widgets
     ├─ hooks/            // custom hooks (theme, accessibility, analytics)
     ├─ screens/          // screen-level containers wired to navigation
     ├─ services/         // AI adapters, storage, notifications
     ├─ store/            // Zustand slices for user, quizzes, flashcards
     ├─ theme/            // light/dark tokens, typography scale, spacing
     └─ utils/            // helpers for formatting, accessibility, scoring
```

## Navigation Structure
- **Tab Navigator**
  - Home (feed of lessons, summaries, streaks)
  - Practice (adaptive quizzes, flashcards)
  - Create (upload materials, generate content)
  - Collaborate (groups, shared decks, chat)
  - Profile (insights, achievements, settings)

## Data Flow
1. User initiates action (e.g., generate quiz) -> local state updates to pending.
2. API request dispatched via React Query -> backend orchestrates AI pipeline.
3. Streaming updates provided via WebSocket for generation progress.
4. Results normalized and cached in Zustand store.
5. Analytics events emitted for tracking.

## AI Pipeline
1. **Ingestion Layer**: Upload service stores file, triggers OCR/vision model (e.g., Google Vision, MathPix).
2. **Processing Layer**: Content chunked, embedded, and summarized using LLM. Domain-specific prompts adapt to subject type.
3. **Generation Layer**: Quiz, flashcard, summary templates populated with generated content.
4. **Evaluation Layer**: Confidence scoring, deduplication, and hallucination checks (via retrieval verification and user feedback).
5. **Delivery Layer**: Results returned to client with metadata (difficulty tags, estimated study time, recommended schedule).

## Adaptive Engine
- **Inputs**: Quiz performance, flashcard recall intervals, time-on-task, user preferences.
- **Algorithm**: Hybrid of Leitner spaced repetition and Bayesian Knowledge Tracing.
- **Outputs**: Recommended next activity, difficulty adjustments, targeted lesson suggestions.

## Collaboration Infrastructure
- Realtime messaging via WebSocket channels (Socket.IO gateway).
- Shared decks and quizzes stored with access control lists.
- Collaborative annotations built with CRDT (Yjs) serialized to backend.

## Security & Compliance
- End-to-end encryption for sensitive uploads.
- PII minimization and GDPR-compliant data retention policies.
- Role-based permissions for group features.
- Audit logs with immutable append-only storage.

## Testing Strategy
- Unit tests (Jest) for UI components and business logic.
- Integration tests using React Native Testing Library.
- End-to-end flows with Detox + mocked backend.
- Load tests on backend using k6 and nightly synthetic monitoring.

## DevOps
- CI/CD via GitHub Actions (lint, typecheck, tests, build).
- Feature flags with LaunchDarkly.
- Beta distribution through Expo EAS + Play Store internal testing track.

## Roadmap Considerations
- Phase 1: Core quiz/flashcard flow, dashboards, gamification baseline.
- Phase 2: Collaborative rooms, shared decks, chat integration.
- Phase 3: Optional AI extras (essay assistant, math solver, code debugger).
