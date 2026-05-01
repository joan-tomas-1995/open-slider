import { defineConfig } from 'vitest/config';

const coreSrcPath = new URL('./packages/core/src/index.ts', import.meta.url).pathname;

export default defineConfig({
  resolve: {
    alias: {
      '@open-slider/core': coreSrcPath,
    },
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts']
  }
});
