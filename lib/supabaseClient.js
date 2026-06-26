import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Jika env belum diisi, supabase = null agar aplikasi tetap bisa di-build
// dan menampilkan pesan konfigurasi, bukannya crash.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const BUCKET = "dokumen-surat";
export const TABLE = "surat";
