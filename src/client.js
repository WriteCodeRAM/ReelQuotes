import { createClient } from '@supabase/supabase-js';

const URL = 'https://xynjasjoclgsetobxajj.supabase.co';

const API_Key = import.meta.env['VITE_API_KEY'];

export const supabase = createClient(URL, API_Key);
