import { create } from 'zustand';

type ThemePreference = 'system' | 'light' | 'dark';

interface UserState {
  name: string;
  streak: number;
  badges: string[];
  themePreference: ThemePreference;
  donationOptIn: boolean;
  donationAmount: number;
  setName: (name: string) => void;
  incrementStreak: () => void;
  addBadge: (badge: string) => void;
  setThemePreference: (preference: ThemePreference) => void;
  setDonationOptIn: (value: boolean) => void;
  setDonationAmount: (value: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: 'Nova Learner',
  streak: 0,
  badges: [],
  themePreference: 'system',
  donationOptIn: false,
  donationAmount: 5,
  setName: (name) => set({ name }),
  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
  addBadge: (badge) => set((state) => ({ badges: [...state.badges, badge] })),
  setThemePreference: (preference) => set({ themePreference: preference }),
  setDonationOptIn: (value) => set({ donationOptIn: value }),
  setDonationAmount: (value) => set({ donationAmount: value })
}));
