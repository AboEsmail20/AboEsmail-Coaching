import { defineConfig } from 'vite';
import { siteUrl } from './scripts/site-url.mjs';

export default defineConfig({
  base: siteUrl.pathname,
  plugins: [
    {
      name: 'site-sharing-url',
      transformIndexHtml(html) {
        return html.replaceAll('__SITE_URL__', siteUrl.href);
      },
    },
  ],
});
