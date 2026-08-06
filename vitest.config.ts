import { fileURLToPath } from 'node:url';
import { defineVitestConfig } from '@nuxt/test-utils/config';
import svgLoader from 'vite-svg-loader';

export default defineVitestConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '~~': fileURLToPath(new URL('.', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['./tests/unit/**/*.test.ts', './tests/integration/**/*.test.ts'],
    passWithNoTests: true,
    setupFiles: ['./tests/setup.ts'],
  },
  plugins: [svgLoader()],
});
