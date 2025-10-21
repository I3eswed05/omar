import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      kv_store_4e345e61: {
        Row: {
          key: string;
          value: Json;
          created_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          created_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          created_at?: string;
        };
      };
    };
  };
}
