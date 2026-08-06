import type { Severity } from '~~/server/logging/types';

export interface ErrorNotification {
  severity: Severity;
  code: string;
  statusCode: number;
  publicMessage: string;
  requestId?: string;
  method?: string;
  path?: string;
  source: 'client' | 'server';
}

export interface WebhookChannelOptions {
  webhookUrl: string;
  timeoutMilliseconds: number;
}
