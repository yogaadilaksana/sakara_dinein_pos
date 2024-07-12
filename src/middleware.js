import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/dashboard') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname.startsWith('/pos') && token.role !== 'CASHIER') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (pathname.startsWith('/auth/signup') && token.role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/pos/:path*', '/auth/signup/:path*'],
};
