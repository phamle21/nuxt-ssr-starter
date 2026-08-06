import type { ApiErrorData, ApiErrorResponse } from '~~/shared/contracts/api-error';

const fallbackMessages: Record<number, string> = {
  400: 'The request is invalid.',
  401: 'Authentication is required.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'The request conflicts with the current state.',
  422: 'The request could not be processed.',
  429: 'Too many requests. Please try again later.',
  500: 'The application could not complete the request.',
  501: 'This operation is not supported.',
  502: 'A required service returned an invalid response.',
  503: 'The service is temporarily unavailable.',
  504: 'A required service timed out.',
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined;
}

function readNumber(record: Record<string, unknown> | undefined, key: string): number | undefined {
  const value = record?.[key];

  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function readString(record: Record<string, unknown> | undefined, key: string): string | undefined {
  const value = record?.[key];

  return typeof value === 'string' && value.trim() ? value : undefined;
}

function readFields(value: unknown): Record<string, string[]> | undefined {
  const record = asRecord(value);

  if (!record) {
    return undefined;
  }

  const fields = Object.fromEntries(
    Object.entries(record).flatMap(([field, messages]) => {
      if (!Array.isArray(messages) || messages.some((message) => typeof message !== 'string')) {
        return [];
      }

      return [[field, messages]];
    }),
  );

  return Object.keys(fields).length ? fields : undefined;
}

export class AppApiError extends Error {
  readonly statusCode: number;
  readonly data: ApiErrorData;

  constructor(statusCode: number, data: ApiErrorData, options?: ErrorOptions) {
    super(data.message, options);
    this.name = 'AppApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

export function normalizeApiError(error: unknown): AppApiError {
  if (error instanceof AppApiError) {
    return error;
  }

  const errorRecord = asRecord(error);
  const responseRecord = asRecord(errorRecord?.data) as Partial<ApiErrorResponse> | undefined;
  const dataRecord = asRecord(responseRecord?.data) ?? asRecord(errorRecord?.data);
  const response = asRecord(errorRecord?.response);
  const statusCode = readNumber(errorRecord, 'statusCode') ?? readNumber(errorRecord, 'status') ?? readNumber(response, 'status') ?? 500;
  const message = readString(dataRecord, 'message') ?? fallbackMessages[statusCode] ?? 'The application could not complete the request.';
  const code = readString(dataRecord, 'code') ?? (statusCode >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR');
  const requestId = readString(dataRecord, 'requestId');
  const retryAfter = readNumber(dataRecord, 'retryAfter');
  const fields = readFields(dataRecord?.fields);

  return new AppApiError(
    statusCode,
    {
      code,
      message,
      requestId,
      fields,
      retryAfter,
    },
    { cause: error },
  );
}
