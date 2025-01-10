import { createClient } from '@supabase/supabase-js';
import { Tables } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase credentials não encontradas');
}

export const supabase = createClient<Tables>(supabaseUrl, supabaseKey);
