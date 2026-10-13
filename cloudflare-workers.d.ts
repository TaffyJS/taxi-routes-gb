declare module "cloudflare:workers" {
  export const env: {
    DB?: D1Database;
  };
}

interface D1Database {}

interface ExecutionContext {
  passThroughOnException(): void;
  waitUntil(promise: Promise<unknown>): void;
}

interface Fetcher {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}
