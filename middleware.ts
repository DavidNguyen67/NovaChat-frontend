/* eslint-disable prettier/prettier */
import HTTP_STATUS from 'http-status';
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/v1/')) {
    const token = req.headers.get('authorization');

    if (!token) {
      return NextResponse.json(
        { message: 'Missing token' },
        { status: HTTP_STATUS.UNAUTHORIZED },
      );
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/api/v1/:path*'],
};
