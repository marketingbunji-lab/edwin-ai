import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "./config";

export function createClient(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createServerClient(config.supabaseUrl, config.supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot set cookies. The proxy keeps sessions refreshed.
        }
      },
    },
  });
}
