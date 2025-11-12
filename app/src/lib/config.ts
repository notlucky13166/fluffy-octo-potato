type EnvRecord = Record<string, string | undefined>;

const importMetaEnv = (typeof import.meta !== 'undefined' ? import.meta.env : {}) as EnvRecord;
const processEnv = ((globalThis as { process?: { env?: EnvRecord } }).process?.env ?? {}) as EnvRecord;

const resolveEnv = (key: string): string | undefined => importMetaEnv[key] ?? processEnv[key];

const supabaseUrl =
  resolveEnv('VITE_SUPABASE_URL') ??
  resolveEnv('EXPO_PUBLIC_SUPABASE_URL') ??
  '';

const supabaseAnonKey =
  resolveEnv('VITE_SUPABASE_ANON_KEY') ??
  resolveEnv('EXPO_PUBLIC_SUPABASE_ANON_KEY') ??
  '';

const functionsUrl =
  resolveEnv('VITE_FUNCTIONS_URL') ??
  resolveEnv('EXPO_PUBLIC_FUNCTIONS_URL') ??
  (supabaseUrl ? `${supabaseUrl.replace(/\/$/, '')}/functions/v1` : '');

export const config = {
  supabaseUrl,
  supabaseAnonKey,
  functionsUrl
};

export const ensureLeadingSlash = (path: string) => (path.startsWith('/') ? path : `/${path}`);
