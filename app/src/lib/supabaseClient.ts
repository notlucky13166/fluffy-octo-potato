import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { config } from './config';

let client: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (client) {
    return client;
  }

  if (!config.supabaseUrl || !config.supabaseAnonKey) {
    if (import.meta.env?.DEV) {
      console.warn(
        'Supabase environment variables are missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or the Expo equivalents).'
      );
    }
    return null;
  }

  client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  return client;
};

export type { SupabaseClient } from '@supabase/supabase-js';
