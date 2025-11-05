import { create } from 'zustand';

export type ReviewGrade = 'again' | 'hard' | 'good' | 'easy';

export interface FolderInsights {
  flashcardSummary?: string;
  quizSummary?: string;
  focusAreas?: string[];
  followUps?: string[];
}

export interface FolderMastery {
  easy: number;
  medium: number;
  hard: number;
  due: number;
  lastReviewed?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  folderId?: string;
  nextReview?: string;
  interval?: number;
  easeFactor?: number;
  reviewCount?: number;
  lastReviewed?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  type: 'multiple-choice' | 'open-ended' | 'image';
  choices?: string[];
  answer?: string;
  mediaUri?: string;
  difficulty: number;
  folderId?: string;
}

export interface StudyFolder {
  id: string;
  name: string;
  description?: string;
  files: string[];
  createdAt: string;
  insights?: FolderInsights;
  mastery: FolderMastery;
  collaborators: string[];
}

interface ContentState {
  flashcards: Flashcard[];
  questions: QuizQuestion[];
  folders: StudyFolder[];
  activeFolderId: string | null;
  addFlashcards: (items: Flashcard[], folderId?: string, insights?: Partial<FolderInsights>) => void;
  addQuestions: (items: QuizQuestion[], folderId?: string, insights?: Partial<FolderInsights>) => void;
  addFolder: (folder: Omit<StudyFolder, 'mastery' | 'collaborators'>) => void;
  selectFolder: (folderId: string) => void;
  addFilesToFolder: (folderId: string, files: string[]) => void;
  removeFileFromFolder: (folderId: string, uri: string) => void;
  addCollaborator: (folderId: string, collaborator: string) => void;
  setFolderInsights: (folderId: string, updates: Partial<FolderInsights>) => void;
  reviewFlashcard: (flashcardId: string, grade: ReviewGrade) => void;
  clearContent: () => void;
}

const nowIso = () => new Date().toISOString();
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const initialiseFlashcard = (card: Flashcard, folderId?: string): Flashcard => {
  const baseInterval = card.difficulty === 'easy' ? 1.5 : card.difficulty === 'medium' ? 0.75 : 0.3;
  const nextReview = new Date(Date.now() + baseInterval * DAY_IN_MS).toISOString();
  return {
    ...card,
    folderId: folderId ?? card.folderId,
    nextReview,
    interval: baseInterval,
    easeFactor: 2.5,
    reviewCount: card.reviewCount ?? 0,
    lastReviewed: card.lastReviewed ?? undefined
  };
};

const ensureFolderShape = (folder: StudyFolder): StudyFolder => ({
  ...folder,
  insights: folder.insights ?? {},
  mastery: folder.mastery ?? { easy: 0, medium: 0, hard: 0, due: 0 },
  collaborators: folder.collaborators ?? []
});

const computeFolderMastery = (folderId: string, cards: Flashcard[]): FolderMastery => {
  const folderCards = cards.filter((card) => card.folderId === folderId);
  const dueNow = folderCards.filter((card) => {
    if (!card.nextReview) {
      return true;
    }
    const nextReviewTime = new Date(card.nextReview).getTime();
    return Number.isFinite(nextReviewTime) ? nextReviewTime <= Date.now() : true;
  }).length;
  const lastReviewed = folderCards
    .filter((card) => card.lastReviewed)
    .sort((a, b) => (a.lastReviewed! > b.lastReviewed! ? -1 : 1))[0]?.lastReviewed;

  return {
    easy: folderCards.filter((card) => card.difficulty === 'easy').length,
    medium: folderCards.filter((card) => card.difficulty === 'medium').length,
    hard: folderCards.filter((card) => card.difficulty === 'hard').length,
    due: dueNow,
    lastReviewed
  };
};

const updateFolderCollection = (folders: StudyFolder[], flashcards: Flashcard[]): StudyFolder[] =>
  folders.map((folder) => {
    const hydrated = ensureFolderShape(folder);
    return {
      ...hydrated,
      mastery: computeFolderMastery(hydrated.id, flashcards)
    };
  });

const adjustFlashcardAfterReview = (card: Flashcard, grade: ReviewGrade): Flashcard => {
  const now = Date.now();
  let easeFactor = card.easeFactor ?? 2.5;
  let interval = Math.max(card.interval ?? 0.1, 0.1);
  let difficulty: Flashcard['difficulty'] = card.difficulty;

  switch (grade) {
    case 'again':
      easeFactor = Math.max(1.3, easeFactor - 0.3);
      interval = 0.0417; // roughly one hour
      difficulty = 'hard';
      break;
    case 'hard':
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      interval = interval < 1 ? 0.75 : interval * 1.2;
      difficulty = 'hard';
      break;
    case 'good':
      easeFactor = easeFactor + 0.05;
      interval = interval < 1 ? 1 : interval * easeFactor;
      difficulty = 'medium';
      break;
    case 'easy':
      easeFactor = easeFactor + 0.15;
      interval = interval < 1 ? 3 : interval * (easeFactor + 0.5);
      difficulty = 'easy';
      break;
    default:
      break;
  }

  const nextReview = new Date(now + interval * DAY_IN_MS).toISOString();

  return {
    ...card,
    easeFactor,
    interval,
    nextReview,
    reviewCount: card.reviewCount + 1,
    lastReviewed: nowIso(),
    difficulty
  };
};

export const useContentStore = create<ContentState>((set) => ({
  flashcards: [],
  questions: [],
  folders: [],
  activeFolderId: null,
  addFlashcards: (items, folderId, insights) =>
    set((state) => {
      const normalised = items.map((card) => initialiseFlashcard(card, folderId));
      const flashcards = [...state.flashcards, ...normalised];
      const folders = updateFolderCollection(
        state.folders.map((folder) => {
          const hydrated = ensureFolderShape(folder);
          if (folderId && hydrated.id === folderId) {
            return {
              ...hydrated,
              insights: insights ? { ...hydrated.insights, ...insights } : hydrated.insights
            };
          }
          return hydrated;
        }),
        flashcards
      );
      return { flashcards, folders };
    }),
  addQuestions: (items, folderId, insights) =>
    set((state) => {
      const questions = [
        ...state.questions,
        ...items.map((question) => ({ ...question, folderId: folderId ?? question.folderId }))
      ];
      const folders = state.folders.map((folder) => {
        const hydrated = ensureFolderShape(folder);
        if (folderId && hydrated.id === folderId) {
          return {
            ...hydrated,
            insights: insights ? { ...hydrated.insights, ...insights } : hydrated.insights
          };
        }
        return hydrated;
      });
      return { questions, folders };
    }),
  addFolder: (folder) =>
    set((state) => ({
      folders: [
        ...state.folders,
        ensureFolderShape({
          ...folder,
          insights: {},
          mastery: { easy: 0, medium: 0, hard: 0, due: 0 },
          collaborators: []
        })
      ],
      activeFolderId: folder.id
    })),
  selectFolder: (folderId) => set({ activeFolderId: folderId }),
  addFilesToFolder: (folderId, files) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === folderId
          ? {
              ...ensureFolderShape(folder),
              files: [...folder.files, ...files.filter((file) => !folder.files.includes(file))]
            }
          : folder
      )
    })),
  removeFileFromFolder: (folderId, uri) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === folderId
          ? {
              ...ensureFolderShape(folder),
              files: folder.files.filter((file) => file !== uri)
            }
          : folder
      )
    })),
  addCollaborator: (folderId, collaborator) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === folderId
          ? {
              ...ensureFolderShape(folder),
              collaborators: folder.collaborators.includes(collaborator)
                ? folder.collaborators
                : [...folder.collaborators, collaborator]
            }
          : folder
      )
    })),
  setFolderInsights: (folderId, updates) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === folderId
          ? {
              ...ensureFolderShape(folder),
              insights: { ...ensureFolderShape(folder).insights, ...updates }
            }
          : folder
      )
    })),
  reviewFlashcard: (flashcardId, grade) =>
    set((state) => {
      const flashcards = state.flashcards.map((card) =>
        card.id === flashcardId ? adjustFlashcardAfterReview(card, grade) : card
      );
      const folders = updateFolderCollection(state.folders, flashcards);
      return { flashcards, folders };
    }),
  clearContent: () => ({ flashcards: [], questions: [] })
}));
