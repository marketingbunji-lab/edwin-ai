import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { LOCAL_AUTH_COOKIE, isLocalAuthEnabled, isValidLocalSession } from "@/lib/localAuth";

export async function requireAuthenticatedUser() {
  if (!isLocalAuthEnabled()) {
    return NextResponse.json(
      { ok: false, error: "Local auth is disabled" },
      { status: 401 },
    );
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(LOCAL_AUTH_COOKIE)?.value;

  if (!isValidLocalSession(session)) {
    return NextResponse.json(
      { ok: false, error: "No autorizado" },
      { status: 401 },
    );
  }

  return null;
}
