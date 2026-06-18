import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  LOCAL_AUTH_COOKIE,
  getLocalAuthUser,
  isLocalAuthEnabled,
  isValidLocalSession,
} from "@/lib/localAuth";

export async function GET() {
  if (!isLocalAuthEnabled()) {
    return NextResponse.json(
      { ok: false, localAuth: false },
      { status: 404 },
    );
  }

  const cookieStore = await cookies();
  const session = cookieStore.get(LOCAL_AUTH_COOKIE)?.value;

  if (!isValidLocalSession(session)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  return NextResponse.json({ ok: true, user: getLocalAuthUser() });
}
