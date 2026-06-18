import { NextResponse } from "next/server";
import {
  LOCAL_AUTH_COOKIE,
  getLocalAuthCredentials,
  getLocalAuthUser,
  getLocalSessionValue,
  isLocalAuthConfigured,
  isLocalAuthEnabled,
} from "@/lib/localAuth";

type LoginPayload = {
  email?: unknown;
  password?: unknown;
};

export async function POST(req: Request) {
  if (!isLocalAuthEnabled()) {
    return NextResponse.json(
      { ok: false, localAuth: false, error: "Local auth is disabled" },
      { status: 404 },
    );
  }

  if (!isLocalAuthConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Configura EDWIN_ADMIN_EMAIL y EDWIN_ADMIN_PASSWORD en .env.local.",
      },
      { status: 500 },
    );
  }

  const body = (await req.json()) as LoginPayload;
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const credentials = getLocalAuthCredentials();

  if (
    email.toLowerCase() !== credentials.email.toLowerCase() ||
    password !== credentials.password
  ) {
    return NextResponse.json(
      { ok: false, error: "Usuario o password invalidos." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true, user: getLocalAuthUser() });

  response.cookies.set(LOCAL_AUTH_COOKIE, getLocalSessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}
