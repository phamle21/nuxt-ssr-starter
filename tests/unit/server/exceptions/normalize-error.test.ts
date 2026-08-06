import { AppError } from '~~/server/exceptions/app-error';
import { normalizeError, toSafeH3Error } from '~~/server/exceptions/normalize-error';

describe('normalizeError', () => {
  it('preserves an AppError contract', () => {
    const expected = new AppError('Internal detail', {
      statusCode: 409,
      code: 'STATE_CONFLICT',
      severity: 'warn',
      publicMessage: 'The state changed.',
    });

    expect(normalizeError(expected)).toBe(expected);
  });

  it('normalizes unknown server failures without exposing the internal message', () => {
    const normalized = normalizeError(new Error('Database password was invalid'));
    const safeError = toSafeH3Error(normalized, 'request-123');

    expect(normalized).toMatchObject({
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      severity: 'error',
      publicMessage: 'The application could not complete the request.',
    });
    expect(safeError.statusMessage).not.toContain('Database');
    expect(safeError.data).toEqual({
      code: 'INTERNAL_ERROR',
      message: 'The application could not complete the request.',
      requestId: 'request-123',
    });
  });

  it('preserves safe validation fields and retry metadata', () => {
    const normalized = new AppError('Validation detail', {
      statusCode: 422,
      code: 'INVALID_INPUT',
      severity: 'warn',
      publicMessage: 'Please check the input.',
      fields: {
        email: ['Email is required.'],
      },
      retryAfter: 30,
    });

    expect(toSafeH3Error(normalized, 'request-456').data).toEqual({
      code: 'INVALID_INPUT',
      message: 'Please check the input.',
      requestId: 'request-456',
      fields: {
        email: ['Email is required.'],
      },
      retryAfter: 30,
    });
  });

  it('classifies upstream timeout errors', () => {
    expect(normalizeError({ statusCode: 504, message: 'socket timed out' })).toMatchObject({
      statusCode: 504,
      code: 'UPSTREAM_ERROR',
      severity: 'error',
      publicMessage: 'An upstream service timed out.',
    });
  });

  it('recovers an AppError wrapped as the cause of an H3 error', () => {
    const expected = new AppError('Invalid input', {
      statusCode: 422,
      code: 'INVALID_INPUT',
      severity: 'warn',
      publicMessage: 'Please check the input.',
    });

    expect(normalizeError({ cause: expected, statusCode: 422 })).toBe(expected);
  });
});
