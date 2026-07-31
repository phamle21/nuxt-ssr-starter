export interface ApiErrorData {
  code: string;
  message: string;
  requestId?: string;
  fields?: Record<string, string[]>;
  retryAfter?: number;
}

export interface ApiErrorResponse {
  statusCode: number;
  statusMessage: string;
  data: ApiErrorData;
}
