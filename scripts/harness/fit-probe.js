// Layout fit probe for the website. Paste the whole file into the browser
// pane's javascript_tool on a page of the dev server (see .claude/skills/ship);
// it returns PASS / FAIL lines for the rules that have broken before:
//   every page   no sideways scroll
//   homepage     the hero fills one screen; Contact and the footer fit the last
//                screen, the contact content clear of the header by --space-6
//   case pages   no phone title is cut off (every title the page can show)
await (async () => {
  const out = [];
  const ok = (cond, msg) => out.push(`${cond ? 'PASS' : 'FAIL'}  ${msg}`);
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  await document.fonts.ready;
  const vw = innerWidth, vh = innerHeight;
  out.push(`viewport ${vw}×${vh} on ${location.pathname}`);
  ok(document.documentElement.scrollWidth <= vw + 1, `no sideways scroll (page ${document.documentElement.scrollWidth}px wide)`);

  const header = document.querySelector('.site-header');
  const headerH = header ? header.getBoundingClientRect().height : 0;

  if (document.getElementById('contact')) {
    scrollTo(0, 0);
    await wait(400);
    const hero = document.querySelector('#about, .hero');
    if (hero) ok(Math.round(hero.getBoundingClientRect().height) >= vh - 1, `hero fills one screen (${Math.round(hero.getBoundingClientRect().height)}px of ${vh})`);
    scrollTo(0, document.documentElement.scrollHeight);
    await wait(1500);
    const sticker = document.querySelector('.prin__title');
    const footer = document.querySelector('footer');
    if (sticker && footer) {
      const air = Math.round(sticker.getBoundingClientRect().top - header.getBoundingClientRect().bottom);
      const foot = Math.round(footer.getBoundingClientRect().bottom);
      ok(air >= 16, `Contact content clear of the header (${air}px; designed 24)`);
      ok(foot <= vh + 1, `footer on the last screen (foot at ${foot}px of ${vh})`);
    }
    for (const t of document.querySelectorAll('.prin__item:not([hidden]) h3')) {
      const lines = Math.round(t.getBoundingClientRect().height / parseFloat(getComputedStyle(t).lineHeight));
      ok(lines <= 2, `How I lead title on ≤ 2 lines: "${t.textContent.trim()}" (${lines})`);
    }
    scrollTo(0, 0);
  }

  const title = document.querySelector('.ct-pane__title[data-pane-title]');
  if (title && getComputedStyle(title).display !== 'none') {
    const orig = title.textContent;
    const titles = [...new Set([...document.querySelectorAll('[data-title]')].map((e) => e.dataset.title).filter(Boolean))];
    for (const s of titles) {
      title.textContent = s;
      ok(title.scrollWidth <= title.clientWidth + 0.5, `phone title whole: "${s}"`);
    }
    title.textContent = orig;
  }
  out.push(`${out.filter((l) => l.startsWith('FAIL')).length} fail(s)`);
  return out.join('\n');
})();
