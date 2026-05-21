import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = (import.meta.env?.VITE_SUPABASE_URL as string) || (import.meta.env?.NEXT_PUBLIC_VITE_SUPABASE_URL as string) || '';
// @ts-ignore
const supabaseAnonKey = (import.meta.env?.VITE_SUPABASE_ANON_KEY as string) || (import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY as string) || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
