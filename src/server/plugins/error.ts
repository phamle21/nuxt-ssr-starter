import { getRequestURL } from 'h3';
import { normalizeError } from '../exceptions/normalize-error';
import { logger } from '../logging/logger';
import { notifyError } from '../notifications/notify-error';

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('error', (error, context) => {
    const appError = normalizeError(error);
    const event = context.event;
    const requestId = event?.context.requestId;
    const method = event?.node.req.method;
    const path = event ? getRequestURL(event).pathname : undefined;

    logger.log(appError.severity, appError.message, {
      code: appError.code,
      statusCode: appError.statusCode,
      severity: appError.severity,
      requestId,
      method,
      path,
      source: 'server',
    });

    if (appError.severity === 'error' || appError.severity === 'critical') {
      void notifyError({
        severity: appError.severity,
        code: appError.code,
        statusCode: appError.statusCode,
        publicMessage: appError.publicMessage,
        requestId,
        method,
        path,
        source: 'server',
      });
    }
  });
});
