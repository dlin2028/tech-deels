import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    alias: {
      $lib: './src/lib',
      '@tech-deels/db/schema': resolve(__dirname, '../../packages/db/src/schema.ts'),
      '@tech-deels/db': resolve(__dirname, '../../packages/db/src/index.ts'),
      '@tech-deels/shared': resolve(__dirname, '../../packages/shared/src/index.ts'),
    },
  },
};

export default config;
