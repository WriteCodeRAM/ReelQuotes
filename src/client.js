import { createClient } from '@supabase/supabase-js';

const URL = 'https://xynjasjoclgsetobxajj.supabase.co';

const API_Key =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5bmphc2pvY2xnc2V0b2J4YWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODM0OTI1NDAsImV4cCI6MTk5OTA2ODU0MH0.8LvHG_nwACcO3d46U67YuTNa_Ilem17SWJNMfk4AXoU';

export const supabase = createClient(URL, API_Key);
