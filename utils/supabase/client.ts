import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";
import { createSupabaseFetch } from "./fetch";

export function createClient() {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient(config.supabaseUrl, config.supabaseKey, {
    global: {
      fetch: createSupabaseFetch(8000),
    },
  });
}
