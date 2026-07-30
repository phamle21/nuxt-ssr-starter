import svgLoader from 'vite-svg-loader';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  app: {
    baseURL: process.env.BASE_URL,
    head: {
      title: 'Nuxt Application',
    },
  },

  modules: ['@pinia/nuxt'],

  css: ['@/assets/style/tailwind.css'],

  vite: {
    plugins: [svgLoader(), tailwindcss()],
    resolve: {},
    assetsInclude: ['**/*.mdx'],
    css: {},
  },

  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBase: '',
    },
  },

  compatibilityDate: '2024-12-05',
});
