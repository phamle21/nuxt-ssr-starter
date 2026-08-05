interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export class FixedWindowRateLimiter {
  private readonly entries = new Map<string, RateLimitEntry>();

  constructor(private readonly maxEntries = 1_000) {}

  consume(key: string, maxRequests: number, windowMilliseconds: number, now = Date.now()): boolean {
    const existing = this.entries.get(key);

    if (!existing || existing.resetAt <= now) {
      if (this.entries.size >= this.maxEntries) {
        this.prune(now);
      }

      if (this.entries.size >= this.maxEntries) {
        const oldestKey = this.entries.keys().next().value;

        if (oldestKey !== undefined) {
          this.entries.delete(oldestKey);
        }
      }

      this.entries.set(key, {
        count: 1,
        resetAt: now + windowMilliseconds,
      });

      return true;
    }

    if (existing.count >= maxRequests) {
      return false;
    }

    existing.count += 1;

    return true;
  }

  private prune(now: number): void {
    for (const [key, entry] of this.entries) {
      if (entry.resetAt <= now) {
        this.entries.delete(key);
      }
    }
  }
}
