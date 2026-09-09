// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // TODO: change this to your real domain once DNS is pointed.
  site: 'https://example.com',
  // The CMS admin route renders its own full document; the dev toolbar has no
  // business injecting into it, and a blog does not need the toolbar anyway.
  devToolbar: { enabled: false },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      wrap: true,
    },
  },
});
