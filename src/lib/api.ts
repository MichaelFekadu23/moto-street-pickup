import { ApiError } from '../features/common/apiError';

const API = import.meta.env.VITE_API_BASE_URL as string;

export async function requestJSON<T>(
  path: string,
  { method = 'POST', body, timeoutMs = 15000 }: { method?: 'GET' | 'POST'; body?: any; timeoutMs?: number } = {}
): Promise<T> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const code        = (data as any)?.code ?? res.status;
      const description = (data as any)?.description;
      const field_error = (data as any)?.field_error as { name: string; description: string }[] | undefined;
      const stack_trace = (data as any)?.stack_trace;
      const message     = (data as any)?.message || description || `HTTP ${res.status}`;
      throw new ApiError({ message: String(message), status: res.status, code, description, field_error, stack_trace });
    }

    return data as T;
  } finally {
    clearTimeout(t);
  }
}
