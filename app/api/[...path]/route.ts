/* eslint-disable prettier/prettier */
import { NextRequest, NextResponse } from 'next/server';
import HTTP_STATUS from 'http-status';
import { v4 } from 'uuid';

import { METHOD } from '@/common';
import { ApiResponse } from '@/interfaces';

export async function handleProxy<T>(
  req: NextRequest,
  method: METHOD,
  params: { path: string[] },
): Promise<NextResponse<ApiResponse<T>>> {
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
    const rawText = await response.text();

    let parsedData: any;

    try {
      parsedData = contentType.includes('application/json')
        ? JSON.parse(rawText)
        : rawText;
    } catch {
      parsedData = rawText;
    }

    if (!response.ok) {
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

    const successResponse: ApiResponse<T> = {
      success: true,
      data: parsedData,
      message: 'Proxy success',
    };

    return NextResponse.json(successResponse, { status: response.status });
  } catch (err: any) {
    console.error(`[Proxy Error - ${method}]`, err);

    const errorResponse: ApiResponse = {
      success: false,
      message: 'Proxy request failed',
      error: {
        code: 'PROXY_REQUEST_FAILED',
        message: err?.message || 'Proxy request failed',
        details: err?.stack ?? 'Unknown error',
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
