import { describe, expect, it } from 'vitest';
import { AppApiError } from './normalize-api-error';
import { resolveErrorMode, resolveErrorTitleKey } from './resolve-error-presentation';

function createError(statusCode: number) {
  return new AppApiError(statusCode, {
    code: 'TEST_ERROR',
    message: 'A safe message.',
  });
}

describe('resolveErrorMode', () => {
  it('keeps validation and not-found errors inline by default', () => {
    expect(resolveErrorMode(createError(404))).toBe('inline');
    expect(resolveErrorMode(createError(422))).toBe('inline');
  });

  it('uses a dialog for server failures and allows an explicit override', () => {
    expect(resolveErrorMode(createError(500))).toBe('dialog');
    expect(resolveErrorMode(createError(500), 'silent')).toBe('silent');
  });
});

describe('resolveErrorTitleKey', () => {
  it('maps operational statuses to stable translation keys', () => {
    expect(resolveErrorTitleKey(401)).toBe('error.titles.authentication');
    expect(resolveErrorTitleKey(429)).toBe('error.titles.rateLimit');
    expect(resolveErrorTitleKey(503)).toBe('error.titles.unavailable');
  });
});
