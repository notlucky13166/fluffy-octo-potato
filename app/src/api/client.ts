import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as {
  API_URL?: string;
};

type Env = typeof globalThis & {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

const env = ((globalThis as Env).process?.env) ?? {};

const DEFAULT_API_URL = 'https://jerkvxvxdrgxjcrfvhpn.supabase.co/functions/v1';

const API_URL = extra.API_URL ?? env.EXPO_PUBLIC_FUNCTIONS_URL ?? DEFAULT_API_URL;

export const apiClient = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_URL ?? 'https://api.aetherlearn.ai'}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Request failed');
  }

  return response.json() as Promise<T>;
};
