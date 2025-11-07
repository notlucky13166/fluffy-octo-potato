import { create } from 'zustand';
import { useUserStore } from './useUserStore';

interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface SignInPayload {
  email: string;
  password: string;
}

interface SignUpPayload extends SignInPayload {
  name: string;
  donationOptIn?: boolean;
  donationAmount?: number;
}

interface AuthState {
  status: 'signedOut' | 'signedIn';
  user: AuthUser | null;
  missionStatement: string;
  donationVision: string;
  signIn: (payload: SignInPayload) => void;
  signUp: (payload: SignUpPayload) => void;
  signOut: () => void;
}

const missionStatement =
  'We exist to keep every learner on track with free AI study guidance—no paywalls, just supportive tools that understand your notes and goals.';

const donationVision =
  'Optional donations will help us expand accessibility features, deeper analytics, and more AI study companions without compromising the free core experience.';

export const useAuthStore = create<AuthState>((set) => ({
  status: 'signedOut',
  user: null,
  missionStatement,
  donationVision,
  signIn: ({ email }) => {
    const { name } = useUserStore.getState();
    set({
      status: 'signedIn',
      user: {
        id: 'demo-user',
        email,
        name
      }
    });
  },
  signUp: ({ email, name, donationOptIn, donationAmount }) => {
    useUserStore.getState().setName(name);
    if (typeof donationOptIn === 'boolean') {
      useUserStore.getState().setDonationOptIn(donationOptIn);
    }
    if (typeof donationAmount === 'number') {
      useUserStore.getState().setDonationAmount(donationAmount);
    }
    set({
      status: 'signedIn',
      user: {
        id: 'demo-user',
        email,
        name
      }
    });
  },
  signOut: () => {
    set({ status: 'signedOut', user: null });
  }
}));
