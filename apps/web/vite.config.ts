import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      allow: ['../../packages'],
    },
  },
  ssr: {
    noExternal: ['@tech-deels/db', '@tech-deels/shared'],
  },
});
