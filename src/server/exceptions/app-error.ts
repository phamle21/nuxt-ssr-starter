import type { Severity } from '../logging/types';

interface AppErrorOptions {
  statusCode: number;
  code: string;
  severity: Severity;
  publicMessage: string;
  cause?: unknown;
}

export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly severity: Severity;
  readonly publicMessage: string;

  constructor(message: string, options: AppErrorOptions) {
    super(message, { cause: options.cause });
    this.name = 'AppError';
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.severity = options.severity;
    this.publicMessage = options.publicMessage;
  }
}
