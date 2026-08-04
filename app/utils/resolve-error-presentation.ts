import type { AppApiError } from './normalize-api-error';

export type ErrorMode = 'dialog' | 'inline' | 'page' | 'silent' | 'toast';
export type GlobalErrorMode = Extract<ErrorMode, 'dialog' | 'toast'>;

export function resolveErrorMode(error: AppApiError, requestedMode?: ErrorMode): ErrorMode {
  if (requestedMode) {
    return requestedMode;
  }

  if (error.statusCode === 404 || error.statusCode === 422) {
    return 'inline';
  }

  return error.statusCode >= 500 ? 'dialog' : 'toast';
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
