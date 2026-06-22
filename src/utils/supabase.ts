import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Cảnh báo: VITE_SUPABASE_URL hoặc VITE_SUPABASE_PUBLISHABLE_KEY chưa được cấu hình đầy đủ trong file .env');
}

// Guard against empty credentials to prevent fatal runtime crash of the application on startup
const placeholderUrl = 'https://placeholder-project.supabase.co';
const placeholderKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzg4ODAwMDAsImV4cCI6MTk5NDQ0MDAwMH0.placeholder';

export const supabase = createClient(
  supabaseUrl || placeholderUrl,
  supabaseAnonKey || placeholderKey
);
