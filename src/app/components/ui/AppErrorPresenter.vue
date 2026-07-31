<template>
  <div
    v-if="mode === 'dialog'"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    @click.self="emit('dismiss')"
    @keydown.esc="emit('dismiss')"
  >
    <section
      aria-labelledby="app-error-title"
      aria-modal="true"
      class="w-full max-w-md rounded-lg bg-white p-6 text-slate-950 shadow-xl"
      role="dialog"
    >
      <h2
        id="app-error-title"
        class="text-xl font-semibold"
      >
        {{ title }}
      </h2>
      <p class="mt-3">{{ message }}</p>
      <p
        v-if="reference"
        class="mt-2 text-sm text-slate-600"
      >
        {{ reference }}
      </p>
      <button
        autofocus
        class="mt-6 rounded-md bg-slate-900 px-4 py-2 font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        type="button"
        @click="emit('dismiss')"
      >
        {{ closeLabel }}
      </button>
    </section>
  </div>

  <section
    v-else
    class="fixed right-4 bottom-4 z-50 max-w-sm rounded-lg bg-slate-900 p-4 text-white shadow-xl"
    role="alert"
  >
    <div class="flex items-start gap-4">
      <div>
        <h2 class="font-semibold">{{ title }}</h2>
        <p class="mt-1 text-sm">{{ message }}</p>
        <p
          v-if="reference"
          class="mt-1 text-xs text-slate-300"
        >
          {{ reference }}
        </p>
      </div>
      <button
        :aria-label="closeLabel"
        class="rounded px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        type="button"
        @click="emit('dismiss')"
      >
        ×
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    closeLabel: string;
    message: string;
    mode?: 'dialog' | 'toast';
    reference?: string;
    title: string;
  }>(),
  {
    mode: 'dialog',
    reference: undefined,
  },
);

const emit = defineEmits<{
  dismiss: [];
}>();
</script>
