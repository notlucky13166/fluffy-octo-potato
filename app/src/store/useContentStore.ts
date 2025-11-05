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

export interface StudyFolder {
  id: string;
  name: string;
  description?: string;
  files: string[];
  createdAt: string;
}

interface ContentState {
  flashcards: Flashcard[];
  questions: QuizQuestion[];
  folders: StudyFolder[];
  activeFolderId: string | null;
  addFlashcards: (items: Flashcard[]) => void;
  addQuestions: (items: QuizQuestion[]) => void;
  addFolder: (folder: StudyFolder) => void;
  selectFolder: (folderId: string) => void;
  addFilesToFolder: (folderId: string, files: string[]) => void;
  removeFileFromFolder: (folderId: string, uri: string) => void;
  clearContent: () => void;
}

export const useContentStore = create<ContentState>((set) => ({
  flashcards: [],
  questions: [],
  folders: [],
  activeFolderId: null,
  addFlashcards: (items) =>
    set((state) => ({ flashcards: [...state.flashcards, ...items] })),
  addQuestions: (items) =>
    set((state) => ({ questions: [...state.questions, ...items] })),
  addFolder: (folder) =>
    set((state) => ({
      folders: [...state.folders, folder],
      activeFolderId: folder.id
    })),
  selectFolder: (folderId) => set({ activeFolderId: folderId }),
  addFilesToFolder: (folderId, files) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === folderId
          ? { ...folder, files: [...folder.files, ...files.filter((file) => !folder.files.includes(file))] }
          : folder
      )
    })),
  removeFileFromFolder: (folderId, uri) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === folderId
          ? { ...folder, files: folder.files.filter((file) => file !== uri) }
          : folder
      )
    })),
  clearContent: () => set({ flashcards: [], questions: [] })
}));
