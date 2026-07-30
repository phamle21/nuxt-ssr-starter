import { createError, type H3Error } from 'h3';
import { AppError } from './app-error';

const publicMessages: Record<number, string> = {
  400: 'The request is invalid.',
  401: 'Authentication is required.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'The request conflicts with the current state.',
  413: 'The request payload is too large.',
  422: 'The request could not be processed.',
  429: 'Too many requests. Please try again later.',
  502: 'An upstream service returned an invalid response.',
  504: 'An upstream service timed out.',
};

function readStatusCode(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') {
    return undefined;
  }

  const statusCode = Reflect.get(error, 'statusCode');

  return typeof statusCode === 'number' && statusCode >= 400 && statusCode <= 599 ? statusCode : undefined;
}

function readInternalMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'A non-error value was thrown';
}

function readCause(error: unknown): unknown {
  return error && typeof error === 'object' ? Reflect.get(error, 'cause') : undefined;
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  const cause = readCause(error);

  if (cause instanceof AppError) {
    return cause;
  }

  const statusCode = readStatusCode(error) ?? 500;
  const isUpstreamFailure = statusCode === 502 || statusCode === 504;

  return new AppError(readInternalMessage(error), {
    statusCode,
    code: isUpstreamFailure ? 'UPSTREAM_ERROR' : statusCode >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR',
    severity: statusCode >= 500 ? 'error' : 'warn',
    publicMessage: publicMessages[statusCode] ?? 'The application could not complete the request.',
    cause: error,
  });
}

export function toSafeH3Error(error: AppError, requestId?: string): H3Error {
  return createError({
    statusCode: error.statusCode,
    statusMessage: error.publicMessage,
    data: {
      code: error.code,
      requestId,
    },
    cause: error,
  });
}
