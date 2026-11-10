import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zkzdotkppuklcbgsbtol.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_vkwmGnnNe_Ae-FMwi480fw_ShjfkDip";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl !== "https://your-project-id.supabase.co" &&
  supabaseKey !== "sb_publishable_your_key_here"
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage
      }
    })
  : null;

if (isSupabaseConfigured) {
  console.log("⚡ Supabase Client initialized successfully with URL:", supabaseUrl);
} else {
  console.warn("⚠️ Supabase credentials not configured. Running in Mock/Offline mode.");
}

