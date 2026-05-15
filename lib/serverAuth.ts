import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/utils/supabase/config";
import { createClient } from "@/utils/supabase/server";

export async function requireAuthenticatedUser() {
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
