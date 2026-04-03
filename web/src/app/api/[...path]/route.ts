import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:4000";

const REQUEST_HEADER_ALLOWLIST = [
  "accept",
  "accept-language",
  "authorization",
  "content-type",
  "cookie",
  "origin",
  "referer",
  "user-agent",
  "x-csrf-token",
  "x-requested-with",
];

const getForwardHeaders = (request: NextRequest) => {
  const headers = new Headers();

  for (const [key, value] of request.headers.entries()) {
    if (REQUEST_HEADER_ALLOWLIST.includes(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  headers.delete("content-length");
  return headers;
};

const createProxyResponse = async (
  request: NextRequest,
  method: string,
  path: string[],
) => {
  const targetPath = path.join("/");
  const targetUrl = `${BACKEND_URL}/api/${targetPath}${request.nextUrl.search}`;

  try {
    const backendResponse = await fetch(targetUrl, {
      method,
      headers: getForwardHeaders(request),
      body:
        method === "GET" || method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      redirect: "manual",
    });

    const responseHeaders = new Headers();
    for (const [key, value] of backendResponse.headers.entries()) {
      if (
        key.toLowerCase() !== "content-encoding" &&
        key.toLowerCase() !== "content-length" &&
        key.toLowerCase() !== "set-cookie"
      ) {
        responseHeaders.set(key, value);
      }
    }

    const response = new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      headers: responseHeaders,
    });

    const setCookieHeader =
      "getSetCookie" in backendResponse.headers
        ? backendResponse.headers.getSetCookie()
        : [];

    for (const cookie of setCookieHeader) {
      response.headers.append("set-cookie", cookie);
    }

    return response;
  } catch {
    return NextResponse.json(
      { message: "Bad Gateway: API is unreachable" },
      { status: 502 },
    );
  }
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
