import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";

export async function proxy(request: NextRequest) {
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

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
