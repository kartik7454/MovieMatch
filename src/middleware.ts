import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Routes to protect
  const protectedRoutes = ['/home', '/movies', '/liked', '/watched', '/watchlist'];
  const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route));
  if (isProtected) {
    // Check session via /api/auth/session (NextAuth.js)
    const sessionRes = await fetch(`${request.nextUrl.origin}/api/auth/session`, {
      headers: {
        cookie: request.headers.get('cookie') || '',
      },
    });
    const session = await sessionRes.json();
    // If not logged in, redirect to root ("/")
    if (!session || Object.keys(session).length === 0) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }
  // Proceed as normal
  return NextResponse.next();
}

// Limit to /home, /movies, /liked, /watched, /watchlist and their subroutes
export const config = {
  matcher: [
    '/home/:path*',
    '/movies/:path*',
    '/liked/:path*',
    '/watched/:path*',
    '/watchlist/:path*'
  ],
};