import { AppError } from './app-error';

export function mapSupabaseError(error: {
  code?: string;
  message?: string;
}): AppError {
  const code = error.code ?? '';

  if (code === '23505') {
    return new AppError('This value is already in use.', 'CONFLICT', error);
  }

  if (code === '42501' || code === 'PGRST301') {
    return new AppError(
      'You do not have permission to perform this action.',
      'PERMISSION',
      error,
    );
  }

  if (code === 'PGRST116') {
    return new AppError(
      'The requested item was not found.',
      'NOT_FOUND',
      error,
    );
  }

  return new AppError(
    'Unable to complete the request. Please try again.',
    'UNKNOWN',
    error,
  );
}
