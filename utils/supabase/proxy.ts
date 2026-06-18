import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import {
  LOCAL_AUTH_COOKIE,
  isLocalAuthEnabled,
  isValidLocalSession,
} from "@/lib/localAuth";
import { getSupabaseConfig } from "./config";
import { createSupabaseFetch } from "./fetch";

const authTimeoutMs = 1500;

function isAuthProtectedPath(pathname: string) {
  return pathname.startsWith("/admin");
}

async function getUserWithTimeout(
  supabase: ReturnType<typeof createServerClient>,
) {
  try {
    const result = await Promise.race([
      supabase.auth.getUser(),
      new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), authTimeoutMs);
      }),
    ]);

    return result?.data.user ?? null;
  } catch {
    return null;
  }
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });
  const pathname = request.nextUrl.pathname;

  if (isLocalAuthEnabled()) {
    const hasLocalSession = isValidLocalSession(
      request.cookies.get(LOCAL_AUTH_COOKIE)?.value,
    );

    if (pathname === "/login" && hasLocalSession) {
      const redirectUrl = request.nextUrl.clone();

      redirectUrl.pathname = "/admin";
      redirectUrl.search = "";

      return NextResponse.redirect(redirectUrl);
    }

    if (isAuthProtectedPath(pathname) && !hasLocalSession) {
      const redirectUrl = request.nextUrl.clone();

      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set(
        "next",
        `${request.nextUrl.pathname}${request.nextUrl.search}`,
      );

      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  const config = getSupabaseConfig();

  if (!config || !isAuthProtectedPath(pathname)) {
    return response;
  }

  const supabase = createServerClient(config.supabaseUrl, config.supabaseKey, {
    global: {
      fetch: createSupabaseFetch(authTimeoutMs),
    },
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headersToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({
          request,
        });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        Object.entries(headersToSet).forEach(([name, value]) => {
          response.headers.set(name, value);
        });
      },
    },
  });

  const user = await getUserWithTimeout(supabase);

  if (isAuthProtectedPath(pathname) && !user) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );

    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
