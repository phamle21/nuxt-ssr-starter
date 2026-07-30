import { AppError } from '../exceptions/app-error';
import { parseClientErrorReport } from './client-error-report';

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
