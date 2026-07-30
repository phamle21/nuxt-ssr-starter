import { defineVitestConfig } from '@nuxt/test-utils/config';
import svgLoader from 'vite-svg-loader';

export default defineVitestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['./app/components/**/*.test.ts', './app/testing/**/*.test.ts', './server/**/*.test.ts', './shared/**/*.test.ts'],
    passWithNoTests: true,
    setupFiles: ['./app/testing/setup.ts'],
  },
  plugins: [svgLoader()],
});
