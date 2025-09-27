export type ApiFieldError = { name: string; description: string };

export class ApiError extends Error {
  status?: number;
  code?: number | string;
  description?: string;
  field_error?: ApiFieldError[];
  stack_trace?: string;

  constructor(init: Partial<ApiError> & { message: string }) {
    super(init.message);
    Object.assign(this, init);
  }
}

export const isApiError = (e: unknown): e is ApiError =>
  e instanceof Error && Object.prototype.hasOwnProperty.call(e, 'status');