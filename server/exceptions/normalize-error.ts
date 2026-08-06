import { createError, type H3Error } from 'h3';
import type { ApiErrorData } from '~~/shared/contracts/api-error';
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
  500: 'The application could not complete the request.',
  501: 'This operation is not supported.',
  502: 'An upstream service returned an invalid response.',
  503: 'The service is temporarily unavailable.',
  504: 'An upstream service timed out.',
};

const statusMessages: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  413: 'Content Too Large',
  422: 'Unprocessable Content',
  429: 'Too Many Requests',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
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
  const data: ApiErrorData = {
    code: error.code,
    message: error.publicMessage,
    requestId,
  };

  if (error.fields) {
    data.fields = error.fields;
  }

  if (error.retryAfter) {
    data.retryAfter = error.retryAfter;
  }

  return createError({
    statusCode: error.statusCode,
    statusMessage: statusMessages[error.statusCode] ?? 'Request Failed',
    data,
    cause: error,
  });
}
