import { useMutation, useQuery } from 'react-query';
import { apiClient } from './client';
import { Flashcard, QuizQuestion } from '../store/useContentStore';

interface GenerateQuizPayload {
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  questionTypes: string[];
  references?: string[];
}

interface GenerateQuizResponse {
  questions: QuizQuestion[];
  summary: string;
  recommendedFocus: string[];
}

interface GenerateFlashcardsPayload {
  title: string;
  files: string[];
  notes?: string;
}

interface GenerateFlashcardsResponse {
  flashcards: Flashcard[];
  summary: string;
  insights: string[];
}

export const useDashboardQuery = () =>
  useQuery(['dashboard'], () => apiClient('/dashboard/insights'));

export const useGenerateQuiz = () =>
  useMutation((payload: GenerateQuizPayload) =>
    apiClient<GenerateQuizResponse>('/generator/quiz', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  );

export const useGenerateFlashcards = () =>
  useMutation((payload: GenerateFlashcardsPayload) =>
    apiClient<GenerateFlashcardsResponse>('/generator/flashcards', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  );
