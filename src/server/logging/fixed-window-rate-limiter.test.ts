import { FixedWindowRateLimiter } from './fixed-window-rate-limiter';

describe('FixedWindowRateLimiter', () => {
  it('allows requests up to the configured limit', () => {
    const limiter = new FixedWindowRateLimiter();

    expect(limiter.consume('client', 2, 1_000, 0)).toBe(true);
    expect(limiter.consume('client', 2, 1_000, 1)).toBe(true);
    expect(limiter.consume('client', 2, 1_000, 2)).toBe(false);
  });

  it('opens a new window after the previous one expires', () => {
    const limiter = new FixedWindowRateLimiter();

    expect(limiter.consume('client', 1, 1_000, 0)).toBe(true);
    expect(limiter.consume('client', 1, 1_000, 999)).toBe(false);
    expect(limiter.consume('client', 1, 1_000, 1_000)).toBe(true);
  });

  it('tracks clients independently', () => {
    const limiter = new FixedWindowRateLimiter();

    expect(limiter.consume('client-a', 1, 1_000, 0)).toBe(true);
    expect(limiter.consume('client-a', 1, 1_000, 1)).toBe(false);
    expect(limiter.consume('client-b', 1, 1_000, 1)).toBe(true);
  });
});
