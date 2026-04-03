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

    const backendHeaders = backendResponse.headers as Headers & {
      getSetCookie?: () => string[];
    };

    let setCookieHeaders: string[] = [];
    if (typeof backendHeaders.getSetCookie === "function") {
      setCookieHeaders = backendHeaders.getSetCookie();
    } else {
      const rawSetCookie = backendResponse.headers.get("set-cookie");
      if (rawSetCookie) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Headers.getSetCookie unavailable; using fallback.");
        }
        setCookieHeaders = [rawSetCookie];
      }
    }

    for (const cookie of setCookieHeaders) {
      response.headers.append("set-cookie", cookie);
    }

    return response;
  } catch (error) {
    console.error("API proxy request failed", {
      method,
      targetUrl,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { message: "Bad Gateway: API proxy request failed" },
      { status: 502 },
    );
  }
};

const makeMethodHandler = (method: string) => {
  return async (
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> },
  ): Promise<NextResponse> => {
    const { path } = await context.params;
    return createProxyResponse(request, method, path);
  };
};

export const GET = makeMethodHandler("GET");
export const POST = makeMethodHandler("POST");
export const PUT = makeMethodHandler("PUT");
export const PATCH = makeMethodHandler("PATCH");
export const DELETE = makeMethodHandler("DELETE");
export const OPTIONS = makeMethodHandler("OPTIONS");
export const HEAD = makeMethodHandler("HEAD");
