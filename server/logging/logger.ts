import { redactLogValue } from './redact';
import type { LogContext, Severity } from './types';

function writeLog(level: Severity, message: string, context: LogContext = {}): void {
  try {
    const redactedContext = redactLogValue(context);
    const safeContext = redactedContext && typeof redactedContext === 'object' && !Array.isArray(redactedContext) ? redactedContext : {};

    process.stdout.write(
      `${JSON.stringify({
        ...safeContext,
        level,
        time: new Date().toISOString(),
        message: redactLogValue(message),
      })}\n`,
    );
  } catch {
    console.error('Failed to serialize a structured log event.');
  }
}

export const logger = {
  log: writeLog,
  debug: (message: string, context?: LogContext) => writeLog('debug', message, context),
  info: (message: string, context?: LogContext) => writeLog('info', message, context),
  warn: (message: string, context?: LogContext) => writeLog('warn', message, context),
  error: (message: string, context?: LogContext) => writeLog('error', message, context),
  critical: (message: string, context?: LogContext) => writeLog('critical', message, context),
};
