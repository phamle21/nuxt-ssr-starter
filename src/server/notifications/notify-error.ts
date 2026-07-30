import { useRuntimeConfig } from '#imports';
import { logger } from '../logging/logger';
import { isSeverity, severityRank, type Severity } from '../logging/types';
import { sendGoogleChatNotification } from './channels/google-chat';
import { sendSlackNotification } from './channels/slack';
import type { ErrorNotification } from './types';

interface ChannelConfig {
  enabled: boolean;
  webhookUrl: string;
  minSeverity: string;
}

export interface ErrorNotifyConfig {
  enabled: boolean;
  minSeverity: string;
  dedupWindowSeconds: number;
  timeoutMilliseconds: number;
  slack: ChannelConfig;
  googleChat: ChannelConfig;
}

interface NotificationSenders {
  slack: typeof sendSlackNotification;
  googleChat: typeof sendGoogleChatNotification;
}

interface EligibleChannel {
  name: string;
  send: () => Promise<void>;
}

const recentNotifications = new Map<string, number>();

function readPositiveNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
}

function resolveMinSeverity(channelValue: string, globalValue: string): Severity {
  if (isSeverity(channelValue)) {
    return channelValue;
  }

  return isSeverity(globalValue) ? globalValue : 'error';
}

function isEligible(channel: ChannelConfig, notification: ErrorNotification, globalMinSeverity: string): boolean {
  return (
    channel.enabled &&
    Boolean(channel.webhookUrl) &&
    severityRank(notification.severity) >= severityRank(resolveMinSeverity(channel.minSeverity, globalMinSeverity))
  );
}

function createFingerprint(notification: ErrorNotification): string {
  return [notification.source, notification.code, notification.statusCode, notification.method, notification.path].join(':');
}

function isDuplicate(fingerprint: string, windowMilliseconds: number, now: number): boolean {
  const previous = recentNotifications.get(fingerprint);

  if (previous && now - previous < windowMilliseconds) {
    return true;
  }

  recentNotifications.set(fingerprint, now);

  if (recentNotifications.size >= 1_000) {
    for (const [key, timestamp] of recentNotifications) {
      if (now - timestamp >= windowMilliseconds) {
        recentNotifications.delete(key);
      }
    }
  }

  return false;
}

export async function notifyErrorWithConfig(
  notification: ErrorNotification,
  config: ErrorNotifyConfig,
  senders: NotificationSenders = {
    slack: sendSlackNotification,
    googleChat: sendGoogleChatNotification,
  },
): Promise<void> {
  try {
    if (!config.enabled) {
      return;
    }

    const timeoutMilliseconds = readPositiveNumber(config.timeoutMilliseconds, 5_000);
    const channelOptions = (channel: ChannelConfig) => ({
      webhookUrl: channel.webhookUrl,
      timeoutMilliseconds,
    });
    const eligibleChannels: EligibleChannel[] = [];

    if (isEligible(config.slack, notification, config.minSeverity)) {
      eligibleChannels.push({
        name: 'slack',
        send: () => senders.slack(notification, channelOptions(config.slack)),
      });
    }

    if (isEligible(config.googleChat, notification, config.minSeverity)) {
      eligibleChannels.push({
        name: 'google-chat',
        send: () => senders.googleChat(notification, channelOptions(config.googleChat)),
      });
    }

    if (eligibleChannels.length === 0) {
      return;
    }

    const dedupWindowMilliseconds = readPositiveNumber(config.dedupWindowSeconds, 300) * 1_000;
    const fingerprint = createFingerprint(notification);
    const now = Date.now();

    if (isDuplicate(fingerprint, dedupWindowMilliseconds, now)) {
      return;
    }

    const results = await Promise.allSettled(eligibleChannels.map((channel) => channel.send()));
    const hasSuccessfulDelivery = results.some((result) => result.status === 'fulfilled');

    if (!hasSuccessfulDelivery) {
      recentNotifications.delete(fingerprint);
    }

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        logger.warn('Error notification delivery failed', {
          channel: eligibleChannels[index]?.name,
          code: notification.code,
          requestId: notification.requestId,
        });
      }
    });
  } catch {
    logger.warn('Error notification pipeline failed', {
      code: notification.code,
      requestId: notification.requestId,
    });
  }
}

export async function notifyError(notification: ErrorNotification): Promise<void> {
  const config = useRuntimeConfig().errorNotify as ErrorNotifyConfig;

  await notifyErrorWithConfig(notification, config);
}
