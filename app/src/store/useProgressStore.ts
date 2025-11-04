import { create } from 'zustand';

type SkillArea = 'memory' | 'comprehension' | 'application' | 'analysis';

export interface ProgressSnapshot {
  area: SkillArea;
  score: number;
  delta: number;
}

interface ProgressState {
  mastery: ProgressSnapshot[];
  updateSnapshot: (snapshot: ProgressSnapshot) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  mastery: [
    { area: 'memory', score: 72, delta: +4 },
    { area: 'comprehension', score: 65, delta: +6 },
    { area: 'application', score: 58, delta: -2 },
    { area: 'analysis', score: 61, delta: +1 }
  ],
  updateSnapshot: (snapshot) =>
    set((state) => ({
      mastery: state.mastery.map((item) =>
        item.area === snapshot.area ? { ...snapshot } : item
      )
    }))
}));
