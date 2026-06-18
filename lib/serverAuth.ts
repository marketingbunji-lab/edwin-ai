import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LOCAL_AUTH_COOKIE, isLocalAuthEnabled, isValidLocalSession } from "@/lib/localAuth";
import { getSupabaseConfig } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";

export async function requireAuthenticatedUser() {
  if (isLocalAuthEnabled()) {
    const cookieStore = await cookies();
    const session = cookieStore.get(LOCAL_AUTH_COOKIE)?.value;

    if (isValidLocalSession(session)) {
      return null;
    }

    return NextResponse.json(
      { ok: false, error: "No autorizado" },
      { status: 401 },
    );
  }

  if (!getSupabaseConfig()) {
    return null;
  }

  const supabase = createClient(await cookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { ok: false, error: "No autorizado" },
      { status: 401 },
    );
  }

  return null;
}
