import { clientErrorReportLimits, type ClientErrorReport } from '../../shared/logging/error-report';
import { AppError } from '../exceptions/app-error';

export function assertClientErrorReportContentLength(contentLength: string | undefined, maxPayloadBytes: number): void {
  if (contentLength && /^\d+$/.test(contentLength) && Number(contentLength) > maxPayloadBytes) {
    throw new AppError('Client error report exceeds the payload limit', {
      statusCode: 413,
      code: 'ERROR_REPORT_TOO_LARGE',
      severity: 'warn',
      publicMessage: 'The error report is too large.',
    });
  }
}

export async function readLimitedClientErrorReportBody(body: AsyncIterable<Uint8Array>, maxPayloadBytes: number): Promise<string | undefined> {
  const chunks: Uint8Array[] = [];
  let payloadBytes = 0;
  let isPayloadTooLarge = false;

  for await (const chunk of body) {
    payloadBytes += chunk.byteLength;

    if (payloadBytes > maxPayloadBytes) {
      isPayloadTooLarge = true;
      chunks.length = 0;
    } else if (!isPayloadTooLarge) {
      chunks.push(chunk);
    }
  }

  if (isPayloadTooLarge) {
    throw new AppError('Client error report exceeds the payload limit', {
      statusCode: 413,
      code: 'ERROR_REPORT_TOO_LARGE',
      severity: 'warn',
      publicMessage: 'The error report is too large.',
    });
  }

  return payloadBytes === 0 ? undefined : Buffer.concat(chunks).toString('utf8');
}

function readOptionalString(record: Record<string, unknown>, key: keyof ClientErrorReport, maxLength: number): string | undefined {
  const value = record[key];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string') {
    throw new AppError(`Client error report field "${key}" must be a string`, {
      statusCode: 400,
      code: 'INVALID_ERROR_REPORT',
      severity: 'warn',
      publicMessage: 'The error report is invalid.',
    });
  }

  const normalizedValue = Array.from(value, (character) => {
    const codePoint = character.codePointAt(0) ?? 0;

    return codePoint <= 31 || codePoint === 127 ? ' ' : character;
  }).join('');

  return normalizedValue.trim().slice(0, maxLength);
}

function normalizeRoute(route: string | undefined): string | undefined {
  if (!route?.startsWith('/')) {
    return undefined;
  }

  try {
    return new URL(route, 'http://local').pathname.slice(0, clientErrorReportLimits.route);
  } catch {
    return undefined;
  }
}

export function parseClientErrorReport(rawBody: string | undefined): ClientErrorReport {
  if (!rawBody) {
    throw new AppError('Client error report body is empty', {
      statusCode: 400,
      code: 'INVALID_ERROR_REPORT',
      severity: 'warn',
      publicMessage: 'The error report is invalid.',
    });
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(rawBody);
  } catch (cause) {
    throw new AppError('Client error report is not valid JSON', {
      statusCode: 400,
      code: 'INVALID_ERROR_REPORT',
      severity: 'warn',
      publicMessage: 'The error report is invalid.',
      cause,
    });
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new AppError('Client error report must be an object', {
      statusCode: 400,
      code: 'INVALID_ERROR_REPORT',
      severity: 'warn',
      publicMessage: 'The error report is invalid.',
    });
  }

  const record = parsed as Record<string, unknown>;

  const report = {
    name: readOptionalString(record, 'name', clientErrorReportLimits.name),
    message: readOptionalString(record, 'message', clientErrorReportLimits.message),
    route: normalizeRoute(readOptionalString(record, 'route', clientErrorReportLimits.route)),
  };

  if (!report.name && !report.message) {
    throw new AppError('Client error report has no error details', {
      statusCode: 400,
      code: 'INVALID_ERROR_REPORT',
      severity: 'warn',
      publicMessage: 'The error report is invalid.',
    });
  }

  return report;
}
