import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth');
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin');

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return null;
    }

    if (isAdminPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
      if (!token.isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return null;
    }

    return null;
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ['/admin/:path*', '/auth/:path*'],
}; 