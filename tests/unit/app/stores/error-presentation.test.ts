import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useErrorPresentationStore } from '@/stores/error-presentation';

describe('useErrorPresentationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('presents and dismisses a global error', () => {
    const store = useErrorPresentationStore();

    store.present({
      statusCode: 500,
      mode: 'dialog',
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Something went wrong.',
      },
    });

    expect(store.current?.error.code).toBe('INTERNAL_ERROR');

    store.dismiss();

    expect(store.current).toBeNull();
  });

  it('does not replace an identical active presentation', () => {
    const store = useErrorPresentationStore();
    const presentation = {
      statusCode: 429,
      mode: 'toast' as const,
      error: {
        code: 'RATE_LIMITED',
        message: 'Try again later.',
        requestId: 'request-123',
      },
    };

    store.present(presentation);
    const first = store.current;
    store.present({ ...presentation });

    expect(store.current).toBe(first);
  });
});
