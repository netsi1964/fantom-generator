import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true, // Use global APIs without importing them
    setupFiles: './tests/setup.js', // Optional: for setup before each test file
  },
}); 