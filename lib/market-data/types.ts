export interface AdapterOptions {
  fetchImpl?: typeof fetch;
  now?: Date;
}

export interface EiaAdapterOptions extends AdapterOptions {
  apiKey?: string;
}

export function fetchedAtFrom(now = new Date()): string {
  return now.toISOString();
}

export function cachedFetchOptions(revalidate: number, init: RequestInit = {}): RequestInit {
  return {
    ...init,
    next: { revalidate },
  } as RequestInit;
}
