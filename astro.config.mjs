// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  output: 'static',
  site: 'https://www.mathewmariani.com/',
  base: '/marie-simulator',
});