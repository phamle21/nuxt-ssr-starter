<template>
  <slot />

  <AppErrorPresenter
    v-if="presentation"
    :close-label="$t('common.actions.close')"
    :message="$t(resolveErrorMessageKey(presentation.error.code, presentation.statusCode))"
    :mode="presentation.mode"
    :reference="reference"
    :title="$t(resolveErrorTitleKey(presentation.statusCode))"
    @dismiss="errorPresentation.dismiss"
  />
</template>

<script setup lang="ts">
import { resolveErrorMessageKey, resolveErrorTitleKey } from '@/utils/resolve-error-presentation';

const errorPresentation = useErrorPresentationStore();
const { current: presentation } = storeToRefs(errorPresentation);
const { t } = useI18n();

const reference = computed(() => {
  if (!presentation.value?.error.requestId) {
    return undefined;
  }

  return t('error.requestId', { requestId: presentation.value.error.requestId });
});
</script>
