/* eslint-disable prettier/prettier */
import HTTP_STATUS from 'http-status';
import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = [
  '/api/v1/login',
  '/api/v1/register',
  '/api/v1/check-email',
  '/api/v1/forgot-password',
  '/api/v1/verify-otp',
  '/api/v1/user-info',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/v1/')) {
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    const token = req.headers.get('authorization');

    if (!token) {
      return NextResponse.json(
        { message: 'Missing token' },
        { status: HTTP_STATUS.UNAUTHORIZED },
      );
    }

    return NextResponse.next();
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/api/v1/:path*'],
};
