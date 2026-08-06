import { defineEventHandler, setResponseHeader, type H3Event } from 'h3';
import { normalizeError, toSafeH3Error } from '~~/server/exceptions/normalize-error';

type ApiHandler<T> = (event: H3Event) => Promise<T> | T;

export function defineApiHandler<T>(handler: ApiHandler<T>) {
  return defineEventHandler(async (event) => {
    try {
      return await handler(event);
    } catch (error) {
      const appError = normalizeError(error);

      if (appError.retryAfter) {
        setResponseHeader(event, 'retry-after', appError.retryAfter);
      }

      throw toSafeH3Error(appError, event.context.requestId);
    }
  });
}
