/* eslint-disable prettier/prettier */
import { NextRequest, NextResponse } from 'next/server';
import HTTP_STATUS from 'http-status';
import { v4 } from 'uuid';

import { METHOD } from '@/common';
import { ApiResponse } from '@/interfaces';

export async function handleProxy(
  req: NextRequest,
  method: METHOD,
  params: { path: string[] },
) {
  try {
    const targetUrl = `${process.env.PROXY_ENDPOINT}/${params.path.join('/')}${req.nextUrl.search}`;

    const body =
      method === METHOD.GET || method === METHOD.DELETE
        ? undefined
        : await req.text();

    const headers = new Headers(req.headers);

    headers.set('x-api-key', process.env.PROXY_API_KEY!);
    headers.set('x-request-id', v4());

    const response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });

    const contentType = response.headers.get('content-type') || '';
    const raw = await response.text();

    let parsed: any;

    try {
      parsed = contentType.includes('application/json') ? JSON.parse(raw) : raw;
    } catch {
      parsed = raw;
    }

    if (!response.ok) {
      const res: ApiResponse = {
        success: false,
        error: {
          code: 'UPSTREAM_ERROR',
          message: parsed?.message || 'Upstream API returned error',
          details: parsed,
        },
      };

      return NextResponse.json(res, { status: response.status });
    }

    const res: ApiResponse = {
      success: true,
      data: parsed,
      message: 'Proxy success',
    };

    return NextResponse.json(res, { status: response.status });
  } catch (err: any) {
    console.error(`[Proxy Error - ${method}]`, err);

    const errorResponse: ApiResponse = {
      success: false,
      error: {
        code: 'PROXY_REQUEST_FAILED',
        message: 'Proxy request failed',
        details: err?.message ?? 'Unknown error',
      },
    };

    return NextResponse.json(errorResponse, {
      status: HTTP_STATUS.BAD_GATEWAY,
    });
  }
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;

  return handleProxy(req, METHOD.GET, { path });
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;

  return handleProxy(req, METHOD.POST, { path });
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;

  return handleProxy(req, METHOD.PUT, { path });
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;

  return handleProxy(req, METHOD.DELETE, { path });
}
