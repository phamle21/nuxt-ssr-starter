import type { FetchRequest } from 'ofetch';
import type { ApiErrorData } from '~~/shared/contracts/api-error';
import { normalizeApiError } from '@/utils/normalize-api-error';
import { resolveErrorMode, type ErrorMode } from '@/utils/resolve-error-presentation';

type FetchOptions = NonNullable<Parameters<typeof $fetch>[1]>;

export type AppRequestOptions = FetchOptions & {
  errorMode?: ErrorMode;
};

export function useAppRequest() {
  const { $api } = useNuxtApp();
  const errorPresentation = useErrorPresentationStore();

  const request = async <ResponseT>(requestTarget: FetchRequest, options: AppRequestOptions = {}): Promise<ResponseT> => {
    const { errorMode, ...fetchOptions } = options;

    try {
      return await $api<ResponseT>(requestTarget, fetchOptions);
    } catch (error) {
      const apiError = normalizeApiError(error);
      const resolvedMode = resolveErrorMode(apiError, errorMode);

      if (resolvedMode === 'page') {
        throw createError({
          statusCode: apiError.statusCode,
          statusMessage: 'Request Failed',
          message: apiError.message,
          data: apiError.data satisfies ApiErrorData,
          fatal: true,
        });
      }

      if (import.meta.client && (resolvedMode === 'dialog' || resolvedMode === 'toast')) {
        errorPresentation.present({
          statusCode: apiError.statusCode,
          mode: resolvedMode,
          error: apiError.data,
        });
      }

      throw apiError;
    }
  };

  return {
    request,
  };
}
