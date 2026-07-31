import { getHeader, getRequestIP, readRawBody, setResponseStatus } from 'h3';
import { AppError } from '../exceptions/app-error';
import { parseClientErrorReport } from '../logging/client-error-report';
import { FixedWindowRateLimiter } from '../logging/fixed-window-rate-limiter';
import { logger } from '../logging/logger';
import { notifyError } from '../notifications/notify-error';

const rateLimiter = new FixedWindowRateLimiter();

function readPositiveNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
}

export default defineApiHandler(async (event) => {
  const requestId = event.context.requestId;
  const runtimeConfig = useRuntimeConfig(event);
  const config = runtimeConfig.errorReporting;

  if (!runtimeConfig.public.errorReportingEnabled) {
    throw new AppError('Client error reporting is disabled', {
      statusCode: 404,
      code: 'ERROR_REPORTING_DISABLED',
      severity: 'warn',
      publicMessage: 'The requested resource was not found.',
    });
  }

  const maxPayloadBytes = readPositiveNumber(config.maxPayloadBytes, 8_192);
  const contentLength = Number(getHeader(event, 'content-length') ?? 0);

  if (contentLength > maxPayloadBytes) {
    throw new AppError('Client error report exceeds the payload limit', {
      statusCode: 413,
      code: 'ERROR_REPORT_TOO_LARGE',
      severity: 'warn',
      publicMessage: 'The error report is too large.',
    });
  }

  const maxRequests = readPositiveNumber(config.rateLimit.maxRequests, 10);
  const windowMilliseconds = readPositiveNumber(config.rateLimit.windowSeconds, 60) * 1_000;
  const clientKey = config.trustProxy ? (getRequestIP(event, { xForwardedFor: true }) ?? 'unknown') : (event.node.req.socket.remoteAddress ?? 'unknown');

  if (!rateLimiter.consume(clientKey, maxRequests, windowMilliseconds)) {
    throw new AppError('Client error report rate limit exceeded', {
      statusCode: 429,
      code: 'ERROR_REPORT_RATE_LIMITED',
      severity: 'warn',
      publicMessage: 'Too many error reports. Please try again later.',
    });
  }

  const rawBody = await readRawBody(event, 'utf8');

  if (rawBody && Buffer.byteLength(rawBody, 'utf8') > maxPayloadBytes) {
    throw new AppError('Client error report exceeds the payload limit', {
      statusCode: 413,
      code: 'ERROR_REPORT_TOO_LARGE',
      severity: 'warn',
      publicMessage: 'The error report is too large.',
    });
  }

  const report = parseClientErrorReport(rawBody);

  logger.error('Client runtime error', {
    code: 'CLIENT_RUNTIME_ERROR',
    statusCode: 500,
    severity: 'error',
    requestId,
    method: event.node.req.method,
    path: report.route,
    source: 'client',
    errorName: report.name,
  });

  void notifyError({
    severity: 'error',
    code: 'CLIENT_RUNTIME_ERROR',
    statusCode: 500,
    publicMessage: 'A client runtime error was reported.',
    requestId,
    method: event.node.req.method,
    path: report.route,
    source: 'client',
  });

  setResponseStatus(event, 204);

  return null;
});
