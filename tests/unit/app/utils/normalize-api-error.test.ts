import { describe, expect, it } from 'vitest';
import { AppApiError, normalizeApiError } from '@/utils/normalize-api-error';

describe('normalizeApiError', () => {
  it('reads the safe H3 error contract', () => {
    const normalized = normalizeApiError({
      statusCode: 422,
      data: {
        statusCode: 422,
        statusMessage: 'Unprocessable Content',
        data: {
          code: 'INVALID_INPUT',
          message: 'Please check the input.',
          requestId: 'request-123',
          fields: {
            email: ['Email is required.'],
          },
        },
      },
    });

    expect(normalized).toMatchObject({
      statusCode: 422,
      message: 'Please check the input.',
      data: {
        code: 'INVALID_INPUT',
        requestId: 'request-123',
        fields: {
          email: ['Email is required.'],
        },
      },
    });
  });

  it('falls back to a safe server error for unknown values', () => {
    expect(normalizeApiError(new Error('Database password leaked'))).toMatchObject({
      statusCode: 500,
      message: 'The application could not complete the request.',
      data: {
        code: 'INTERNAL_ERROR',
      },
    });
  });

  it('preserves an already normalized error', () => {
    const error = new AppApiError(409, {
      code: 'STATE_CONFLICT',
      message: 'The state changed.',
    });

    expect(normalizeApiError(error)).toBe(error);
  });
});
