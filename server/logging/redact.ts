const redactedValue = '[REDACTED]';
const truncatedValue = '[TRUNCATED]';
const maxDepth = 6;
const maxArrayItems = 50;
const maxStringLength = 2_000;

const sensitiveKeys = new Set([
  'address',
  'apikey',
  'authorization',
  'cardnumber',
  'cookie',
  'email',
  'firstname',
  'lastname',
  'password',
  'phone',
  'secret',
  'session',
  'sessionid',
  'token',
  'webhookurl',
]);

const sensitiveTextPatterns = [/(bearer\s+)[^\s,;]+/gi, /([?&](?:api[-_]?key|password|secret|session|token)=)[^&\s]+/gi];

function normalizeKey(key: string): string {
  return key.replaceAll(/[-_]/g, '').toLowerCase();
}

function isSensitiveKey(key: string): boolean {
  const normalizedKey = normalizeKey(key);

  return sensitiveKeys.has(normalizedKey) || normalizedKey.endsWith('token') || normalizedKey.endsWith('password') || normalizedKey.endsWith('secret');
}

function truncateString(value: string): string {
  const redacted = sensitiveTextPatterns.reduce((result, pattern) => result.replace(pattern, `$1${redactedValue}`), value);

  return redacted.length > maxStringLength ? `${redacted.slice(0, maxStringLength)}${truncatedValue}` : redacted;
}

function redactObject(value: Record<string, unknown>, depth: number, seen: WeakSet<object>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, entry] of Object.entries(value)) {
    result[key] = isSensitiveKey(key) ? redactedValue : redactLogValue(entry, depth + 1, seen);
  }

  return result;
}

export function redactLogValue(value: unknown, depth = 0, seen = new WeakSet<object>()): unknown {
  if (typeof value === 'string') {
    return truncateString(value);
  }

  if (value === null || value === undefined || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return typeof value === 'bigint' ? value.toString() : value;
  }

  if (typeof value !== 'object') {
    return String(value);
  }

  if (depth >= maxDepth) {
    return truncatedValue;
  }

  if (seen.has(value)) {
    return '[CIRCULAR]';
  }

  seen.add(value);

  try {
    if (value instanceof Date) {
      return value.toISOString();
    }

    if (value instanceof Error) {
      return redactObject(
        {
          name: value.name,
          message: value.message,
          stack: value.stack,
        },
        depth,
        seen,
      );
    }

    if (Array.isArray(value)) {
      return value.slice(0, maxArrayItems).map((entry) => redactLogValue(entry, depth + 1, seen));
    }

    return redactObject(value as Record<string, unknown>, depth, seen);
  } finally {
    seen.delete(value);
  }
}
