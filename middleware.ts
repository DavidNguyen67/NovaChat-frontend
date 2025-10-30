/* eslint-disable prettier/prettier */
import { NextRequest, NextResponse } from 'next/server';
import { v4 } from 'uuid';

import { METHOD } from './common';

export default async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (pathname.startsWith('/api/v1/')) {
    const targetUrl = process.env.PROXY_ENDPOINT + pathname + search;
    const apiKey = process.env.API_KEY;

    const clientIp =
      req.headers.get('x-real-ip') ||
      req.headers.get('x-forwarded-for')?.split(',')[0] ||
      'unknown';

    const headers = Object.fromEntries(req.headers.entries());

    if (apiKey) headers['x-api-key'] = apiKey;
    headers['x-forwarded-for'] = clientIp;
    headers['x-request-timestamp'] = new Date().toISOString();
    headers['x-request-id'] = v4();

    const res = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method === METHOD.GET ? undefined : req.body,
    });

    const responseBody = await res.text();

    return new NextResponse(responseBody, {
      status: res.status,
      headers: res.headers,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/v1/:path*'],
};
