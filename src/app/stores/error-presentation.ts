import { defineStore } from 'pinia';
import type { ApiErrorData } from '../../shared/contracts/api-error';
import type { GlobalErrorMode } from '../utils/resolve-error-presentation';

export interface ErrorPresentation {
  statusCode: number;
  mode: GlobalErrorMode;
  error: ApiErrorData;
}

export const useErrorPresentationStore = defineStore('error-presentation', {
  state: (): { current: ErrorPresentation | null } => ({
    current: null,
  }),

  actions: {
    present(presentation: ErrorPresentation) {
      const currentFingerprint = this.current ? `${this.current.statusCode}:${this.current.error.code}:${this.current.error.requestId ?? ''}` : undefined;
      const nextFingerprint = `${presentation.statusCode}:${presentation.error.code}:${presentation.error.requestId ?? ''}`;

      if (currentFingerprint === nextFingerprint) {
        return;
      }

      this.current = presentation;
    },

    dismiss() {
      this.current = null;
    },
  },
});
