export interface StudySession {
  id: string;
  title: string;
  durationMinutes: number;
  focusArea: string;
  recommendedStart: string;
}

export const buildDailySchedule = (): StudySession[] => [
  {
    id: 'session-1',
    title: 'Flashcard pulse',
    durationMinutes: 15,
    focusArea: 'Memory reinforcement',
    recommendedStart: '08:00'
  },
  {
    id: 'session-2',
    title: 'Adaptive quiz',
    durationMinutes: 20,
    focusArea: 'Application practice',
    recommendedStart: '13:00'
  },
  {
    id: 'session-3',
    title: 'Bite-sized lesson review',
    durationMinutes: 10,
    focusArea: 'Comprehension boost',
    recommendedStart: '19:00'
  }
];
