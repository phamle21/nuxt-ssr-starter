import { createApp, toWebHandler } from 'h3';
import { AppError } from '~~/server/exceptions/app-error';
import { defineApiHandler } from '~~/server/utils/define-api-handler';

describe('defineApiHandler', () => {
  it('returns a safe error contract with request and retry metadata', async () => {
    const app = createApp();

    app.use(
      defineApiHandler((event) => {
        event.context.requestId = 'request-123';

        throw new AppError('Internal rate-limit detail', {
          statusCode: 429,
          code: 'RATE_LIMITED',
          severity: 'warn',
          publicMessage: 'Please try again later.',
          retryAfter: 30,
        });
      }),
    );

    const response = await toWebHandler(app)(new Request('http://localhost/api/example'));
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBe('30');
    expect(body).toMatchObject({
      data: {
        code: 'RATE_LIMITED',
        message: 'Please try again later.',
        requestId: 'request-123',
        retryAfter: 30,
      },
    });
    expect(JSON.stringify(body)).not.toContain('Internal rate-limit detail');
  });
});
