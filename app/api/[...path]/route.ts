/* eslint-disable prettier/prettier */
import { NextRequest, NextResponse } from 'next/server';
import { v4 } from 'uuid';
import HTTP_STATUS from 'http-status';

import { METHOD } from '@/common';

async function handleProxy(
  req: NextRequest,
  method: string,
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

    const resBody = await response.text();

    return new NextResponse(resBody, {
      status: response.status,
      headers: response.headers,
    });
  } catch (err: any) {
    console.error(`[Proxy Error - ${method}]`, err);

    return NextResponse.json(
      { error: 'Proxy request failed', message: err.message },
      { status: HTTP_STATUS.INTERNAL_SERVER_ERROR },
    );
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
