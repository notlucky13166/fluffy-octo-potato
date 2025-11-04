import { create } from 'zustand';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  type: 'multiple-choice' | 'open-ended' | 'image';
  choices?: string[];
  answer?: string;
  mediaUri?: string;
  difficulty: number;
}

interface ContentState {
  flashcards: Flashcard[];
  questions: QuizQuestion[];
  addFlashcards: (items: Flashcard[]) => void;
  addQuestions: (items: QuizQuestion[]) => void;
  clearContent: () => void;
}

export const useContentStore = create<ContentState>((set) => ({
  flashcards: [],
  questions: [],
  addFlashcards: (items) =>
    set((state) => ({ flashcards: [...state.flashcards, ...items] })),
  addQuestions: (items) =>
    set((state) => ({ questions: [...state.questions, ...items] })),
  clearContent: () => set({ flashcards: [], questions: [] })
}));
