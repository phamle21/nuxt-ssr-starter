export default defineNuxtPlugin(() => {
  const api = $fetch.create({
    headers: {
      accept: 'application/json',
    },
  });

  return {
    provide: {
      api,
    },
  };
});
