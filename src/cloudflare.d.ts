// Minimální typy pro Cloudflare Workers (plné runtime typy kolidují s typy prohlížeče v klientských skriptech).
interface D1Result<T = Record<string, unknown>> {
  results: T[];
  success: boolean;
  meta: Record<string, unknown>;
}
interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(column?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
}
interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<D1Result[]>;
}
interface Fetcher {
  fetch(input: Request | string, init?: RequestInit): Promise<Response>;
}

declare module 'cloudflare:workers' {
  export const env: Cloudflare.Env;
}
