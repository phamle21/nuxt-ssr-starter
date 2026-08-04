import { formatErrorNotification } from '../format-notification';
import type { ErrorNotification, WebhookChannelOptions } from '../types';

export async function sendGoogleChatNotification(notification: ErrorNotification, options: WebhookChannelOptions): Promise<void> {
  const response = await fetch(options.webhookUrl, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      text: formatErrorNotification(notification),
    }),
    signal: AbortSignal.timeout(options.timeoutMilliseconds),
  });

  if (!response.ok) {
    throw new Error(`Google Chat webhook returned HTTP ${response.status}`);
  }
}
