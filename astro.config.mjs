// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://uttham.design',
  // A static site on GitHub Pages (perf pass 2026-10-02). The first two are
  // Astro's defaults, stated so nobody has to look them up: whitespace goes,
  // and a page's small stylesheets are inlined rather than fetched.
  compressHTML: true,
  build: { inlineStylesheets: 'auto' },
  // Only links that ask for it (data-astro-prefetch) — the case tiles, the
  // tool titles and the case index — fetch their page's HTML on hover.
  // prefetchAll would also fetch the 1.7MB CV on a hover over "Download CV".
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
