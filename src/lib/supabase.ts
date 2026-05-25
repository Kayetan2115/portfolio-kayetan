import { createClient } from '@supabase/supabase-js';

const sanitize = (val: any): string => {
  if (!val || typeof val !== 'string') return '';
  return val.trim().replace(/^['"]|['"]$/g, '');
};

// Use direct, literal references so Vite's static analysis can replace these variables during compilation
// @ts-ignore
const rawUrl = import.meta.env?.VITE_SUPABASE_URL || import.meta.env?.NEXT_PUBLIC_VITE_SUPABASE_URL || '';
// @ts-ignore
const rawKey = import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const supabaseUrl = sanitize(rawUrl);
const supabaseAnonKey = sanitize(rawKey);

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://'))
);

const getClient = () => {
  if (!isSupabaseConfigured) return null;
  const pass = typeof window !== 'undefined' ? localStorage.getItem('kayetan_admin_pass') || '' : '';
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        'x-admin-passphrase': pass
      }
    }
  });
};

export const supabase = isSupabaseConfigured 
  ? new Proxy({} as any, {
      get(target, prop) {
        const client = getClient();
        if (!client) return undefined;
        const val = Reflect.get(client, prop);
        if (typeof val === 'function') {
          return val.bind(client);
        }
        return val;
      }
    })
  : null;


