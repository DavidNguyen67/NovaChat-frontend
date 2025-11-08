/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
import { NextRequest, NextResponse } from 'next/server';
import { v4 } from 'uuid';
import HTTP_STATUS from 'http-status';

import { TIME_OUT_REQUEST } from './common/global';

import { METHOD } from '@/common';
import { ApiResponse } from '@/interfaces';

const publicRoutes = [
  '/api/v1/login',
  '/api/v1/register',
  '/api/v1/check-email',
  '/api/v1/forgot-password',
  '/api/v1/verify-otp',
  '/api/v1/user-info',
];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Chỉ proxy các route API v1
  if (!pathname.startsWith('/api/v1/')) return NextResponse.next();

  // Bỏ qua route public
  if (publicRoutes.includes(pathname)) {
    console.log(`[Proxy][Public] ${request.method} ${pathname}`);

    return NextResponse.next();
  }

  const token = request.headers.get('authorization');

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized: Missing access token',
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access token is required to access this resource.',
          details: null,
        },
      },
      { status: HTTP_STATUS.UNAUTHORIZED },
    );
  }

  const method: METHOD = request.method as METHOD;
  const targetUrl = `${process.env.PROXY_ENDPOINT}${pathname}${search}`;

  console.log(
    `[Proxy] → ${method} ${pathname}${search || ''} \nTarget: ${targetUrl}`,
  );

  try {
    const clonedReq = request.clone();
    const body =
      method === METHOD.GET || method === METHOD.DELETE
        ? undefined
        : await clonedReq.text();

    const headers = new Headers(request.headers);

    headers.set('x-api-key', process.env.PROXY_API_KEY!);
    headers.set('x-request-id', v4());

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIME_OUT_REQUEST);

    let response: Response;

    try {
      response = await fetch(targetUrl, {
        method,
        headers,
        body,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();

    let parsedData: any;

    try {
      parsedData = contentType.includes('application/json')
        ? JSON.parse(rawText)
        : rawText;
    } catch {
      parsedData = rawText;
    }

    const logPrefix = `[Proxy][${method}] ${pathname}`;

    if (!response.ok) {
      console.warn(
        `${logPrefix} ❌ ${response.status} → Upstream error: ${parsedData?.message || 'Unknown error'}`,
      );

      const errorResponse: ApiResponse = {
        success: false,
        message: parsedData?.message ?? 'Upstream API returned error',
        error: {
          code: 'UPSTREAM_ERROR',
          message: parsedData?.message ?? 'Upstream API returned error',
          details: parsedData,
        },
      };

      return NextResponse.json(errorResponse, {
        status: response.status || HTTP_STATUS.BAD_GATEWAY,
      });
    }

    console.log(`${logPrefix} ✅ ${response.status} → OK`);

    if (body && body.length < 500) {
      console.debug('[Proxy][RequestBody]', body);
    }

    const successResponse: ApiResponse = {
      success: true,
      data: parsedData,
      message: 'Proxy success',
    };

    return NextResponse.json(successResponse, { status: response.status });
  } catch (err: any) {
    const isAbort = err.name === 'AbortError';

    console.error(
      `[Proxy][${request.method}] ${pathname} ❌ `,
      isAbort ? 'Timeout reached' : err,
    );

    const errorResponse: ApiResponse = {
      success: false,
      message: isAbort ? 'Upstream API timeout' : 'Proxy request failed',
      error: {
        code: isAbort ? 'UPSTREAM_TIMEOUT' : 'PROXY_REQUEST_FAILED',
        message: err?.message || 'Proxy request failed',
        details: process.env.NODE_ENV === 'development' ? err?.stack : null,
      },
    };

    return NextResponse.json(errorResponse, {
      status: HTTP_STATUS.BAD_GATEWAY,
    });
  }
}

export const config = {
  matcher: ['/api/v1/:path*'],
};
