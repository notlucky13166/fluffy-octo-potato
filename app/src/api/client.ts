import Constants from 'expo-constants';

const { API_URL } = Constants.expoConfig?.extra ?? {};

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
