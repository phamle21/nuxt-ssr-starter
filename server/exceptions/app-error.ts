import type { Severity } from '~~/server/logging/types';

interface AppErrorOptions {
  statusCode: number;
  code: string;
  severity: Severity;
  publicMessage: string;
  fields?: Record<string, string[]>;
  retryAfter?: number;
  cause?: unknown;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly severity: Severity;
  readonly publicMessage: string;
  readonly fields?: Record<string, string[]>;
  readonly retryAfter?: number;

  constructor(message: string, options: AppErrorOptions) {
    super(message, { cause: options.cause });
    this.name = 'AppError';
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.severity = options.severity;
    this.publicMessage = options.publicMessage;
    this.fields = options.fields;
    this.retryAfter = options.retryAfter;
  }
}
