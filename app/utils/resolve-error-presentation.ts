import type { AppApiError } from './normalize-api-error';

export type ErrorMode = 'dialog' | 'inline' | 'page' | 'silent' | 'toast';
export type GlobalErrorMode = Extract<ErrorMode, 'dialog' | 'toast'>;

type ErrorMessageKey =
  | 'error.messages.authentication'
  | 'error.messages.conflict'
  | 'error.messages.forbidden'
  | 'error.messages.notFound'
  | 'error.messages.rateLimit'
  | 'error.messages.request'
  | 'error.messages.server'
  | 'error.messages.unavailable'
  | 'error.messages.validation';

const messageKeyByCode: Partial<Record<string, ErrorMessageKey>> = {
  INTERNAL_ERROR: 'error.messages.server',
  UPSTREAM_ERROR: 'error.messages.unavailable',
};

export function resolveErrorMode(error: AppApiError, requestedMode?: ErrorMode): ErrorMode {
  if (requestedMode) {
    return requestedMode;
  }

  if (error.statusCode === 404 || error.statusCode === 422) {
    return 'inline';
  }

  return error.statusCode >= 500 ? 'dialog' : 'toast';
}

export function resolveErrorMessageKey(code: string, statusCode: number): ErrorMessageKey {
  const codeKey = messageKeyByCode[code];

  if (codeKey) return codeKey;
  if (statusCode === 401) return 'error.messages.authentication';
  if (statusCode === 403) return 'error.messages.forbidden';
  if (statusCode === 404) return 'error.messages.notFound';
  if (statusCode === 409) return 'error.messages.conflict';
  if (statusCode === 422) return 'error.messages.validation';
  if (statusCode === 429) return 'error.messages.rateLimit';
  if (statusCode >= 502 && statusCode <= 504) return 'error.messages.unavailable';
  if (statusCode >= 500) return 'error.messages.server';

  return 'error.messages.request';
}

export function resolveErrorTitleKey(
  statusCode: number,
):
  | 'error.titles.authentication'
  | 'error.titles.conflict'
  | 'error.titles.forbidden'
  | 'error.titles.notFound'
  | 'error.titles.rateLimit'
  | 'error.titles.request'
  | 'error.titles.server'
  | 'error.titles.unavailable'
  | 'error.titles.validation' {
  if (statusCode === 401) return 'error.titles.authentication';
  if (statusCode === 403) return 'error.titles.forbidden';
  if (statusCode === 404) return 'error.titles.notFound';
  if (statusCode === 409) return 'error.titles.conflict';
  if (statusCode === 422) return 'error.titles.validation';
  if (statusCode === 429) return 'error.titles.rateLimit';
  if (statusCode >= 502 && statusCode <= 504) return 'error.titles.unavailable';
  if (statusCode >= 500) return 'error.titles.server';

  return 'error.titles.request';
}
