import { createClient } from '@supabase/supabase-js';

const sanitize = (val: any): string => {
  if (!val || typeof val !== 'string') return '';
  return val.trim().replace(/^['"]|['"]$/g, '');
};

const meta = import.meta as any;
const rawUrl = meta.env?.VITE_SUPABASE_URL || meta.env?.NEXT_PUBLIC_VITE_SUPABASE_URL || '';
const rawKey = meta.env?.VITE_SUPABASE_ANON_KEY || meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const supabaseUrl = sanitize(rawUrl);
const supabaseAnonKey = sanitize(rawKey);

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
