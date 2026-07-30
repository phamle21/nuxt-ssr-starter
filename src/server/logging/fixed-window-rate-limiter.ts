interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export class FixedWindowRateLimiter {
  private readonly entries = new Map<string, RateLimitEntry>();

  consume(key: string, maxRequests: number, windowMilliseconds: number, now = Date.now()): boolean {
    const existing = this.entries.get(key);

    if (!existing || existing.resetAt <= now) {
      this.entries.set(key, {
        count: 1,
        resetAt: now + windowMilliseconds,
      });
      this.prune(now);

      return true;
    }

    if (existing.count >= maxRequests) {
      return false;
    }

    existing.count += 1;

    return true;
  }

  private prune(now: number): void {
    if (this.entries.size < 1_000) {
      return;
    }

    for (const [key, entry] of this.entries) {
      if (entry.resetAt <= now) {
        this.entries.delete(key);
      }
    }
  }
}
