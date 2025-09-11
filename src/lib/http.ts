// src/lib/http.ts
export async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    // only add JSON header if sending a body (avoids preflight on GET)
    headers: init?.body
      ? { 'Content-Type': 'application/json', ...(init.headers ?? {}) }
      : init?.headers,
    ...init,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;
  if (!res.ok) throw new Error((data as any)?.message || `HTTP ${res.status}`);
  return data as T;
}
