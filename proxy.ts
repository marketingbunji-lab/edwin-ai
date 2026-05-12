import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/proxy";

export async function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname === "/brands" ||
    request.nextUrl.pathname.startsWith("/brands/")
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/admin${request.nextUrl.pathname}`;

    return NextResponse.redirect(redirectUrl);
  }

  const previewMatch = request.nextUrl.pathname.match(/^\/([^/]+)\/preview\/?$/);

  if (previewMatch) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/landings/${previewMatch[1]}/preview`;

    return NextResponse.rewrite(rewriteUrl);
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
