import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = 'https://fymyrxqjmnekcmrpvtju.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5bXlyeHFqbW5la2NtcnB2dGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDUyMzIsImV4cCI6MjA4NTI4MTIzMn0.B946RoSjn1S2636SbHs6n5J4bIHpAK4-f5qwljytitg';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get public URL for stored images
export function getImageUrl(path: string): string {
  if (!path) return '';
  // If it's already a full URL, return as is
  if (path.startsWith('http')) return path;
  // Otherwise, get from Supabase storage
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
}
