import type { ErrorNotification } from './types';

export function formatErrorNotification(notification: ErrorNotification): string {
  return [
    `[${notification.severity.toUpperCase()}] ${notification.code}`,
    notification.publicMessage,
    notification.statusCode ? `Status: ${notification.statusCode}` : undefined,
    notification.method && notification.path ? `Request: ${notification.method} ${notification.path}` : undefined,
    notification.requestId ? `Request ID: ${notification.requestId}` : undefined,
    `Source: ${notification.source}`,
  ]
    .filter(Boolean)
    .join('\n');
}
