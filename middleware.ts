import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { canAccessPath } from "@/services/access-service";
import { userRoleSchema } from "@/types/user";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname.startsWith("/auth/")) return NextResponse.next();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return redirectToLogin(request);

  const requestHeaders = new Headers(request.headers);
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (items) => {
        for (const { name, value } of items) request.cookies.set(name, value);
        response = NextResponse.next({ request: { headers: requestHeaders } });
        for (const { name, value, options } of items) response.cookies.set(name, value, options);
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirectToLogin(request);
  if (user.app_metadata?.isActive === false) return redirectToLogin(request, "deaktivert");

  const parsedRole = userRoleSchema.safeParse(user.app_metadata?.role);
  if (parsedRole.success) {
    requestHeaders.set("x-flowlog-role", parsedRole.data);
    const roleResponse = NextResponse.next({ request: { headers: requestHeaders } });
    for (const cookie of response.cookies.getAll()) roleResponse.cookies.set(cookie);
    response = roleResponse;
    if (!canAccessPath(parsedRole.data, request.nextUrl.pathname)) return NextResponse.redirect(new URL("/", request.url));
  }
  return response;
}

function redirectToLogin(request: NextRequest, reason?: string) {
  const login = request.nextUrl.clone();
  login.pathname = "/login";
  login.search = reason ? `?grunn=${reason}` : "";
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.svg|manifest.webmanifest|icons/|sw.js|workbox-|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)"],
};
