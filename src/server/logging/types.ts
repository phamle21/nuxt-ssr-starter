export const severityValues = ['debug', 'info', 'warn', 'error', 'critical'] as const;

export type Severity = (typeof severityValues)[number];

export type LogContext = Record<string, unknown>;

export function isSeverity(value: unknown): value is Severity {
  return typeof value === 'string' && severityValues.includes(value as Severity);
}

export function severityRank(severity: Severity): number {
  return severityValues.indexOf(severity);
}
