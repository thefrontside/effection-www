import { Operation } from "effection";
import { CurrentRequest } from "../context/request.ts";
import { dirname, join } from "jsr:@std/path@^1.0.8";
import { ResolveLinkFunction } from "../hooks/use-markdown.tsx";

export const createSibling: ResolveLinkFunction = function* (
  pathname,
  connector,
  method,
): Operation<string> {
  const request = yield* CurrentRequest.expect();
  const url = new URL(request.url);
  url.pathname = join(dirname(url.pathname), pathname);
  if (connector && method) {
    url.hash = `#${method}`;
  }
  return url.toString().replace(url.origin, "");
};

export function createChildURL(prefix?: string) {
  return function* (pathname: string): Operation<string> {
    const request = yield* CurrentRequest.expect();
    const url = new URL(request.url);
    url.pathname = join(
      ...[url.pathname, prefix, pathname].flatMap((s) => s ? [s] : []),
    );
    return url.toString().replace(url.origin, "");
  };
}

export function createRootUrl(prefix?: string) {
  return function* (pathname: string): Operation<string> {
    const request = yield* CurrentRequest.expect();
    const url = new URL(request.url);
    url.pathname = join(
      ...[prefix, pathname].flatMap((s) => s ? [s] : []),
    );
    return url.toString().replace(url.origin, "");
  };
}
