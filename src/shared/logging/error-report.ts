export const clientErrorReportLimits = {
  name: 100,
  message: 500,
  route: 500,
} as const;

export interface ClientErrorReport {
  name?: string;
  message?: string;
  route?: string;
}
