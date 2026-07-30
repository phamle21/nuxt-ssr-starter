<template>
  <main class="flex min-h-screen items-center justify-center px-6">
    <section class="max-w-lg text-center">
      <h1 class="text-3xl font-semibold">{{ $t('error.title') }}</h1>
      <p class="mt-4">{{ $t('error.message') }}</p>
      <p
        v-if="requestId"
        class="mt-2 text-sm"
      >
        {{ $t('error.requestId', { requestId }) }}
      </p>
      <button
        class="mt-6"
        type="button"
        @click="handleReturnHome"
      >
        {{ $t('error.returnHome') }}
      </button>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { NuxtError } from 'nuxt/app';

const props = withDefaults(defineProps<{ error?: NuxtError }>(), {
  error: () => ({}) as NuxtError,
});

const requestId = computed(() => {
  if (!props.error?.data || typeof props.error.data !== 'object') {
    return undefined;
  }

  const candidate = Reflect.get(props.error.data, 'requestId');

  return typeof candidate === 'string' ? candidate : undefined;
});

const handleReturnHome = () => clearError({ redirect: '/' });
</script>
