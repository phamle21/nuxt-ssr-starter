import { formatErrorNotification } from '~~/server/notifications/format-notification';

describe('formatErrorNotification', () => {
  it('formats only the safe notification contract', () => {
    expect(
      formatErrorNotification({
        severity: 'error',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
        publicMessage: 'The application could not complete the request.',
        requestId: 'request-123',
        method: 'GET',
        path: '/dashboard',
        source: 'server',
      }),
    ).toBe(
      [
        '[ERROR] INTERNAL_ERROR',
        'The application could not complete the request.',
        'Status: 500',
        'Request: GET /dashboard',
        'Request ID: request-123',
        'Source: server',
      ].join('\n'),
    );
  });
});
