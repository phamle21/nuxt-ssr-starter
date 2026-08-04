import { notifyErrorWithConfig, type ErrorNotifyConfig } from './notify-error';

const sendSlackNotification = vi.fn(async () => undefined);
const sendGoogleChatNotification = vi.fn(async () => undefined);

function createConfig(): ErrorNotifyConfig {
  return {
    enabled: true,
    minSeverity: 'error',
    dedupWindowSeconds: 300,
    timeoutMilliseconds: 5_000,
    slack: {
      enabled: true,
      webhookUrl: 'https://hooks.example.test/slack',
      minSeverity: '',
    },
    googleChat: {
      enabled: true,
      webhookUrl: 'https://hooks.example.test/google-chat',
      minSeverity: '',
    },
  };
}

function createNotification(code: string, severity: 'warn' | 'error' = 'error') {
  return {
    severity,
    code,
    statusCode: severity === 'error' ? 500 : 400,
    publicMessage: 'A safe public message.',
    requestId: 'request-123',
    method: 'GET',
    path: '/dashboard',
    source: 'server' as const,
  };
}

const senders = {
  slack: sendSlackNotification,
  googleChat: sendGoogleChatNotification,
};

describe('notifyErrorWithConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('delivers an eligible error to every configured channel', async () => {
    const notification = createNotification('DELIVERY_TEST');

    await notifyErrorWithConfig(notification, createConfig(), senders);

    expect(sendSlackNotification).toHaveBeenCalledWith(
      notification,
      expect.objectContaining({
        webhookUrl: 'https://hooks.example.test/slack',
        timeoutMilliseconds: 5_000,
      }),
    );
    expect(sendGoogleChatNotification).toHaveBeenCalledOnce();
  });

  it('does not deliver below the configured severity threshold', async () => {
    await notifyErrorWithConfig(createNotification('THRESHOLD_TEST', 'warn'), createConfig(), senders);

    expect(sendSlackNotification).not.toHaveBeenCalled();
    expect(sendGoogleChatNotification).not.toHaveBeenCalled();
  });

  it('does not deliver when the master switch is disabled', async () => {
    const config = createConfig();
    config.enabled = false;

    await notifyErrorWithConfig(createNotification('DISABLED_TEST'), config, senders);

    expect(sendSlackNotification).not.toHaveBeenCalled();
    expect(sendGoogleChatNotification).not.toHaveBeenCalled();
  });

  it('suppresses duplicate notifications inside the deduplication window', async () => {
    const notification = createNotification('DEDUP_TEST');
    const config = createConfig();

    await notifyErrorWithConfig(notification, config, senders);
    await notifyErrorWithConfig(notification, config, senders);

    expect(sendSlackNotification).toHaveBeenCalledOnce();
    expect(sendGoogleChatNotification).toHaveBeenCalledOnce();
  });

  it('retries only the channel whose previous delivery failed', async () => {
    const notification = createNotification('CHANNEL_RETRY_TEST');
    sendGoogleChatNotification.mockRejectedValueOnce(new Error('Google Chat unavailable'));

    await notifyErrorWithConfig(notification, createConfig(), senders);
    await notifyErrorWithConfig(notification, createConfig(), senders);

    expect(sendSlackNotification).toHaveBeenCalledOnce();
    expect(sendGoogleChatNotification).toHaveBeenCalledTimes(2);
  });
});
