import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

const errorMiddleware = createMiddleware().server(async ({ next, request }) => {
  // /lovable/* server routes (email preview, webhooks, cron) authenticate
  // themselves and must bypass app middleware.
  if (new URL(request.url).pathname.startsWith("/lovable/")) {
    return next();
  }
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

// Read bounded bytes before the server-function parser, including requests
// without Content-Length. Preserve the original stream for the RPC parser.
const bodyLimitMiddleware = createMiddleware().server(async ({ next, request, handlerType }) => {
  if (handlerType !== "serverFn" || request.method !== "POST") return next();
  const limit = 16 * 1024;
  const length = request.headers.get("content-length");
  if (length && Number(length) > limit) {
    return new Response("Request body too large", { status: 413 });
  }
  const copy = request.clone();
  const reader = copy.body?.getReader();
  if (!reader) return next();
  let bytes = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      bytes += chunk.value.byteLength;
      if (bytes > limit) {
        // Do not await cancellation of a tee: it waits for the original branch.
        void reader.cancel().catch(() => {});
        void request.body?.cancel().catch(() => {});
        return new Response("Request body too large", { status: 413 });
      }
    }
  } finally {
    reader.releaseLock();
  }
  return next();
});

export const startInstance = createStart(() => ({
  // Public-only app: deliberately no browser session/localStorage dependency.
  requestMiddleware: [errorMiddleware, bodyLimitMiddleware, csrfMiddleware],
}));
