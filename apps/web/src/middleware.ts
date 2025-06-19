import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (proxies for third-party services)
     * 4. Metadata files: favicon.ico, sitemap.xml, robots.txt, manifest.webmanifest
     */
    "/((?!api/|_next/|_proxy/|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest).*)",
  ],
  runtime: "nodejs",
};

const REDIRECT_WHEN_NOT_AUTHENTICATED_PATH = "/auth/login";

const publicRoutes = [
  { path: '/auth/login', whenAuthneticated: "redirect" },
  { path: '/auth/create-account', whenAuthneticated: "redirect" },
  { path: '/auth/activate', whenAuthneticated: "redirect" },
  { path: '/pricing', whenAuthneticated: "next" },
  { path: '/terms', whenAuthneticated: "next" },
  { path: '/privacy', whenAuthneticated: "next" },
] as const

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('access-token')?.value;

  const publicRoute = publicRoutes.find(route => pathname.startsWith(route.path));
  if (!token && publicRoute) {
    return NextResponse.next();
  }

  if (token && publicRoute && publicRoute.whenAuthneticated === "redirect") {
    const redirectUrl = new URL("/", req.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (!publicRoute) {
    const accessToken = token;
    const refreshToken = req.cookies.get('refresh-token')?.value;
    if (!accessToken && !refreshToken) {
      const redirectUrl = new URL(REDIRECT_WHEN_NOT_AUTHENTICATED_PATH, req.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}