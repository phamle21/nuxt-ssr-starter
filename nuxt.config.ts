import svgLoader from 'vite-svg-loader';
import tailwindcss from '@tailwindcss/vite';

const appName = process.env.NUXT_PUBLIC_APP_NAME || 'Nuxt Application';

export default defineNuxtConfig({
  app: {
    baseURL: process.env.BASE_URL,
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: appName,
      titleTemplate: `%s | ${appName}`,
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico',
        },
      ],
    },
  },

  routeRules: {
    '/**': {
      headers: {
        'permissions-policy': 'camera=(), geolocation=(), microphone=()',
        'referrer-policy': 'strict-origin-when-cross-origin',
        'x-content-type-options': 'nosniff',
        'x-frame-options': 'SAMEORIGIN',
      },
    },
  },

  modules: ['@pinia/nuxt', '@nuxtjs/i18n'],

  css: ['@/assets/style/tailwind.css'],

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      {
        code: 'en',
        language: 'en',
        file: 'en/index.ts',
      },
    ],
  },

  vite: {
    plugins: [svgLoader(), tailwindcss()],
    resolve: {},
    assetsInclude: ['**/*.mdx'],
    css: {},
  },

  runtimeConfig: {
    errorReporting: {
      maxPayloadBytes: 8_192,
      trustProxy: false,
      rateLimit: {
        maxRequests: 10,
        windowSeconds: 60,
      },
    },
    errorNotify: {
      enabled: false,
      minSeverity: 'error',
      dedupWindowSeconds: 300,
      timeoutMilliseconds: 5_000,
      slack: {
        enabled: false,
        webhookUrl: '',
        minSeverity: '',
      },
      googleChat: {
        enabled: false,
        webhookUrl: '',
        minSeverity: '',
      },
    },
    public: {
      appName,
      errorReportingEnabled: true,
    },
  },

  compatibilityDate: '2024-12-05',
});
