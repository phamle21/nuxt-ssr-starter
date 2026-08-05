<template>
  <div
    v-if="mode === 'dialog'"
    ref="dialogElement"
    class="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4"
    @click.self="emit('dismiss')"
  >
    <section
      :aria-labelledby="titleId"
      aria-modal="true"
      class="w-full max-w-md rounded-lg bg-surface p-6 text-on-surface shadow-xl"
      role="dialog"
    >
      <h2
        :id="titleId"
        class="text-xl font-semibold"
      >
        {{ title }}
      </h2>
      <p class="mt-3">{{ message }}</p>
      <p
        v-if="reference"
        class="mt-2 text-sm text-muted"
      >
        {{ reference }}
      </p>
      <button
        ref="closeButtonElement"
        class="mt-6 rounded-md bg-action px-4 py-2 font-medium text-on-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        type="button"
        @click="emit('dismiss')"
      >
        {{ closeLabel }}
      </button>
    </section>
  </div>

  <section
    v-else
    class="fixed right-4 bottom-4 z-50 max-w-sm rounded-lg bg-action p-4 text-on-action shadow-xl"
    role="alert"
  >
    <div class="flex items-start gap-4">
      <div>
        <h2 class="font-semibold">{{ title }}</h2>
        <p class="mt-1 text-sm">{{ message }}</p>
        <p
          v-if="reference"
          class="mt-1 text-xs opacity-75"
        >
          {{ reference }}
        </p>
      </div>
      <button
        :aria-label="closeLabel"
        class="rounded px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-action"
        type="button"
        @click="emit('dismiss')"
      >
        ×
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
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

const titleId = useId();
const dialogElement = useTemplateRef<HTMLElement>('dialogElement');
const closeButtonElement = useTemplateRef<HTMLButtonElement>('closeButtonElement');
let previouslyFocusedElement: HTMLElement | null = null;

function handleDocumentKeydown(event: KeyboardEvent): void {
  if (!import.meta.client || props.mode !== 'dialog') {
    return;
  }

  if (event.key === 'Escape') {
    event.preventDefault();
    emit('dismiss');
    return;
  }

  if (event.key !== 'Tab' || !dialogElement.value) {
    return;
  }

  const focusableElements = Array.from(
    dialogElement.value.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );

  if (focusableElements.length === 0) {
    event.preventDefault();
    dialogElement.value.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements.at(-1);

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement?.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement?.focus();
  }
}

function activateDialog(): void {
  if (!import.meta.client) {
    return;
  }

  previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  document.addEventListener('keydown', handleDocumentKeydown);
  void nextTick(() => closeButtonElement.value?.focus());
}

function deactivateDialog(): void {
  if (!import.meta.client) {
    return;
  }

  document.removeEventListener('keydown', handleDocumentKeydown);
  previouslyFocusedElement?.focus();
  previouslyFocusedElement = null;
}

watch(
  () => props.mode,
  (mode, previousMode) => {
    if (mode === 'dialog' && previousMode !== 'dialog') {
      activateDialog();
    } else if (mode !== 'dialog' && previousMode === 'dialog') {
      deactivateDialog();
    }
  },
  { immediate: true },
);

onBeforeUnmount(deactivateDialog);
</script>
