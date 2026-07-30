import { randomUUID } from 'node:crypto';
import { defineEventHandler, getHeader, setResponseHeader } from 'h3';

const validRequestId = /^[A-Za-z0-9._-]{1,128}$/;

export default defineEventHandler((event) => {
  const incomingRequestId = getHeader(event, 'x-request-id');
  const requestId = incomingRequestId && validRequestId.test(incomingRequestId) ? incomingRequestId : randomUUID();

  event.context.requestId = requestId;
  setResponseHeader(event, 'x-request-id', requestId);
});
