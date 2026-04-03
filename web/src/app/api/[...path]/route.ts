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

    const responseHeadersWithSetCookie = backendResponse.headers as Headers & {
      getSetCookie?: () => string[];
    };

    let setCookieHeader: string[] = [];
    if (typeof responseHeadersWithSetCookie.getSetCookie === "function") {
      setCookieHeader = responseHeadersWithSetCookie.getSetCookie();
    } else {
      const rawSetCookie = backendResponse.headers.get("set-cookie");
      if (rawSetCookie) {
        console.warn(
          "Headers.getSetCookie unavailable; using set-cookie fallback",
        );
        setCookieHeader = [rawSetCookie];
      }
    }

    for (const cookie of setCookieHeader) {
      response.headers.append("set-cookie", cookie);
    }

    return response;
  } catch (error) {
    console.error("API proxy request failed", { method, targetUrl, error });
    return NextResponse.json(
      { message: "Bad Gateway: API is unreachable" },
      { status: 502 },
    );
  }
};

export const GET = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) => {
  const { path } = await context.params;
  return createProxyResponse(request, "GET", path);
};

export const POST = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> => {
  const { path } = await context.params;
  return createProxyResponse(request, "POST", path);
};

export const PUT = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> => {
  const { path } = await context.params;
  return createProxyResponse(request, "PUT", path);
};

export const PATCH = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> => {
  const { path } = await context.params;
  return createProxyResponse(request, "PATCH", path);
};

export const DELETE = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> => {
  const { path } = await context.params;
  return createProxyResponse(request, "DELETE", path);
};

export const OPTIONS = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> => {
  const { path } = await context.params;
  return createProxyResponse(request, "OPTIONS", path);
};

export const HEAD = async (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<NextResponse> => {
  const { path } = await context.params;
  return createProxyResponse(request, "HEAD", path);
};
