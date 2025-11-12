import { config, ensureLeadingSlash } from './config';

export class ApiError extends Error {
  status?: number;
}

export const apiClient = async <T = unknown>(path: string, init?: RequestInit): Promise<T | null> => {
  if (!config.functionsUrl) {
    throw new Error(
      'Supabase functions URL is not configured. Set VITE_FUNCTIONS_URL (or EXPO_PUBLIC_FUNCTIONS_URL) in your environment.'
    );
  }

  const url = `${config.functionsUrl}${ensureLeadingSlash(path)}`;
  const headers = new Headers(init?.headers ?? undefined);

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...init,
    headers
  });

  const text = await response.text();
  let data: T | null = null;

  if (text) {
    try {
      data = JSON.parse(text) as T;
    } catch (error) {
      if (response.ok) {
        console.warn('Received non-JSON response from API.', error);
      }
    }
  }

  if (!response.ok) {
    const message = (data as { error?: string } | null)?.error ?? text || 'Request failed';
    const apiError = new ApiError(message);
    apiError.status = response.status;
    throw apiError;
  }

  return data;
};
