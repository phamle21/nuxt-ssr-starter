import { normalizeApiError } from '../utils/normalize-api-error';

export const useAppFetch = createUseFetch({
  headers: {
    accept: 'application/json',
  },
  onRequestError({ error }) {
    throw normalizeApiError(error);
  },
  onResponseError({ response }) {
    throw normalizeApiError({
      statusCode: response.status,
      data: response._data,
      response,
    });
  },
});
