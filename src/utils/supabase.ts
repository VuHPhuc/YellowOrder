import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Cảnh báo: VITE_SUPABASE_URL hoặc VITE_SUPABASE_PUBLISHABLE_KEY chưa được cấu hình đầy đủ trong file .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
