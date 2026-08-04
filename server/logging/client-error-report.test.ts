import { Readable } from 'node:stream';
import { AppError } from '../exceptions/app-error';
import { assertClientErrorReportContentLength, parseClientErrorReport, readLimitedClientErrorReportBody } from './client-error-report';

describe('assertClientErrorReportContentLength', () => {
  it('accepts a content length within the payload limit', () => {
    expect(() => assertClientErrorReportContentLength('128', 8_192)).not.toThrow();
  });

  it('allows a missing content length so streamed bodies can be measured', () => {
    expect(() => assertClientErrorReportContentLength(undefined, 8_192)).not.toThrow();
  });

  it('rejects a content length over the payload limit', () => {
    expect(() => assertClientErrorReportContentLength('8193', 8_192)).toThrow(expect.objectContaining({ statusCode: 413, code: 'ERROR_REPORT_TOO_LARGE' }));
  });
});

describe('readLimitedClientErrorReportBody', () => {
  it('reads a streamed body within the payload limit', async () => {
    const body = Readable.from([Buffer.from('{"name":'), Buffer.from('"TypeError"}')]);

    await expect(readLimitedClientErrorReportBody(body, 100)).resolves.toBe('{"name":"TypeError"}');
  });

  it('rejects a streamed body over the payload limit', async () => {
    const body = Readable.from([Buffer.from('1234'), Buffer.from('5678')]);

    await expect(readLimitedClientErrorReportBody(body, 7)).rejects.toMatchObject({
      statusCode: 413,
      code: 'ERROR_REPORT_TOO_LARGE',
    });
  });
});

describe('parseClientErrorReport', () => {
  it('accepts a small report and strips query data from the route', () => {
    expect(
      parseClientErrorReport(
        JSON.stringify({
          name: 'TypeError',
          message: 'Could not render\u0000the view',
          route: '/dashboard?token=secret',
        }),
      ),
    ).toEqual({
      name: 'TypeError',
      message: 'Could not render the view',
      route: '/dashboard',
    });
  });

  it('rejects malformed JSON with a safe application error', () => {
    expect(() => parseClientErrorReport('{')).toThrow(AppError);

    try {
      parseClientErrorReport('{');
    } catch (error) {
      expect(error).toMatchObject({
        statusCode: 400,
        code: 'INVALID_ERROR_REPORT',
        publicMessage: 'The error report is invalid.',
      });
    }
  });

  it('rejects non-string fields', () => {
    expect(() => parseClientErrorReport(JSON.stringify({ message: 42 }))).toThrow('must be a string');
  });

  it('rejects reports without error details', () => {
    expect(() => parseClientErrorReport(JSON.stringify({ route: '/dashboard' }))).toThrow('no error details');
  });
});
