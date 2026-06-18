import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";
import { createSupabaseFetch } from "./fetch";

export function createAdminClient() {
  const config = getSupabaseConfig();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!config || !serviceRoleKey) {
    return null;
  }

  return createClient(config.supabaseUrl, serviceRoleKey, {
    global: {
      fetch: createSupabaseFetch(3000),
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
