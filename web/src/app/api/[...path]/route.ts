import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

const createProxyResponse = async (
  request: NextRequest,
  method: string,
  path: string[],
) => {
  const targetPath = path.join("/");
  const targetUrl = `${BACKEND_URL}/api/${targetPath}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);
  headers.set("host", new URL(BACKEND_URL).host);
  headers.delete("content-length");

  const backendResponse = await fetch(targetUrl, {
    method,
    headers,
    body:
      method === "GET" || method === "HEAD"
        ? undefined
        : await request.arrayBuffer(),
    redirect: "manual",
  });

  const responseHeaders = new Headers(backendResponse.headers);
  responseHeaders.delete("content-encoding");
  responseHeaders.delete("content-length");

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    headers: responseHeaders,
  });
};

const handleProxy = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  method: string,
) => {
  const { path } = await context.params;
  return createProxyResponse(request, method, path);
};

export const GET = (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => handleProxy(request, context, "GET");

export const POST = (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => handleProxy(request, context, "POST");

export const PUT = (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => handleProxy(request, context, "PUT");

export const PATCH = (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => handleProxy(request, context, "PATCH");

export const DELETE = (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => handleProxy(request, context, "DELETE");

export const OPTIONS = (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => handleProxy(request, context, "OPTIONS");

export const HEAD = (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => handleProxy(request, context, "HEAD");
