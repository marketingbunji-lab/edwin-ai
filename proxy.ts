import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  LOCAL_AUTH_COOKIE,
  isLocalAuthEnabled,
  isValidLocalSession,
} from "@/lib/localAuth";

function isAuthProtectedPath(pathname: string) {
  return pathname.startsWith("/admin");
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const shortVisualAssetsMatch = request.nextUrl.pathname.match(
    /^\/([^/]+)\/visual-assets(\/.*)?$/,
  );

  if (shortVisualAssetsMatch) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/admin/brands/${shortVisualAssetsMatch[1]}/visual-assets${shortVisualAssetsMatch[2] ?? ""}`;

    return NextResponse.redirect(redirectUrl);
  }

  if (
    request.nextUrl.pathname === "/brands" ||
    request.nextUrl.pathname.startsWith("/brands/")
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/admin${request.nextUrl.pathname}`;

    return NextResponse.redirect(redirectUrl);
  }

  if (!isLocalAuthEnabled()) {
    return NextResponse.next({
      request,
    });
  }

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

  return NextResponse.next({
    request,
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
