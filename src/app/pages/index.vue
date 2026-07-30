<template>
  <main class="flex min-h-screen items-center justify-center">
    <h1 class="text-3xl font-semibold">{{ config.public.appName }}</h1>
  </main>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
</script>
