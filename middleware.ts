import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow access to the login pages without redirection
    if (path.endsWith("/login")) {
      return NextResponse.next();
    }

    // If authenticated but accessing wrong role path, redirect to correct dashboard
    if (token?.role && path !== "/" && !path.startsWith(`/${token.role}`)) {
      return NextResponse.redirect(new URL(`/${token.role}/dashboard`, req.url));
    }

    // If authenticated and accessing root, redirect to dashboard
    if (token && path === "/") {
      return NextResponse.redirect(new URL(`/${token.role}/dashboard`, req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Allow public routes
        if (path === "/" || path === "/verify" || path.endsWith("/login")) {
          return true;
        }

        // Protected routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};