// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // The one address every page names as canonical (src/layouts/Base.astro) and
  // the sitemap lists; www and workers.dev fold into it.
  site: 'https://uttham.fyi',
  // The sitemap (domain trust pass, 2026-10-03): /sitemap-index.xml, named in
  // public/robots.txt and submitted to Search Console and Bing. Every built
  // page goes in; the 404 page stays out. Pinned to 3.7.0, the last release
  // built against Astro 5 — 3.7.1 onwards target Astro 6 and 7.
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) })],
  // A static site on Cloudflare Workers static assets (wrangler.jsonc; perf
  // pass 2026-10-02). The first two are Astro's defaults, stated so nobody has
  // to look them up: whitespace goes, and a page's small stylesheets are
  // inlined rather than fetched.
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  // Only links that ask for it (data-astro-prefetch) — the case tiles, the
  // tool titles and the case index — fetch their page's HTML on hover.
  // prefetchAll would also fetch the 1.7MB CV on a hover over "Download CV".
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
