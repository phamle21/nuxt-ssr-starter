<template>
  <main class="flex min-h-screen items-center justify-center">
    <h1 class="text-3xl font-semibold">{{ config.public.appName }}</h1>
  </main>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const { t } = useI18n();

useSeoMeta({
  title: () => t('home.title'),
  description: () => t('home.description'),
  ogTitle: () => t('home.title'),
  ogDescription: () => t('home.description'),
});
</script>
