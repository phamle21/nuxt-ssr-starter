import { redactLogValue } from './redact';

describe('redactLogValue', () => {
  it('redacts sensitive keys recursively', () => {
    expect(
      redactLogValue({
        authorization: 'Bearer secret',
        nested: {
          password: 'secret',
          api_key: 'secret',
        },
      }),
    ).toEqual({
      authorization: '[REDACTED]',
      nested: {
        password: '[REDACTED]',
        api_key: '[REDACTED]',
      },
    });
  });

  it('redacts credentials embedded in text', () => {
    expect(redactLogValue('Request failed with Bearer abc.def and /callback?token=secret&result=failed')).toBe(
      'Request failed with Bearer [REDACTED] and /callback?token=[REDACTED]&result=failed',
    );
  });

  it('handles circular values and bigint without breaking serialization', () => {
    const input: Record<string, unknown> = {
      count: 10n,
    };
    input.self = input;

    const redacted = redactLogValue(input);

    expect(redacted).toEqual({
      count: '10',
      self: '[CIRCULAR]',
    });
    expect(() => JSON.stringify(redacted)).not.toThrow();
  });

  it('preserves repeated references that are not circular', () => {
    const shared = { status: 'available' };

    expect(redactLogValue({ primary: shared, fallback: shared })).toEqual({
      primary: { status: 'available' },
      fallback: { status: 'available' },
    });
  });
});
