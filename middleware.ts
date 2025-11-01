/* eslint-disable prettier/prettier */
import HTTP_STATUS from 'http-status';
import { NextRequest, NextResponse } from 'next/server';

import { ApiResponse } from '@/interfaces';

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

  // ✅ Chỉ áp dụng middleware cho các route bắt đầu bằng /api/v1/
  if (pathname.startsWith('/api/v1/')) {
    // ✅ Bỏ qua route công khai (public)
    if (publicRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    const token = req.headers.get('authorization');

    if (!token) {
      const res: ApiResponse = {
        success: false,
        message: 'Unauthorized: Missing access token',
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access token is required to access this resource.',
          details: null,
        },
      };

      return NextResponse.json(res, {
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    // ✅ Sau này bạn có thể thêm validate token ở đây
    // e.g. call verifyToken(token)

    return NextResponse.next();
  }

  return NextResponse.next();
}

// ✅ Cấu hình matcher để middleware chỉ chạy cho /api/v1/*
export const config = {
  matcher: ['/api/v1/:path*'],
};
