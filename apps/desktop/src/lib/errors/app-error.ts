export type AppErrorCode =
  | 'NETWORK'
  | 'AUTH'
  | 'NOT_FOUND'
  | 'VALIDATION'
  | 'PERMISSION'
  | 'CONFLICT'
  | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly cause?: unknown;

  constructor(
    message: string,
    code: AppErrorCode = 'UNKNOWN',
    cause?: unknown,
  ) {
    super(message);

    this.name = 'AppError';
    this.code = code;
    this.cause = cause;
  }
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong.',
): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
