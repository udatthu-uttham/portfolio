// Hero motion: the GSAP hero choreography (brief §9) and the magnetic sheets.
// Loaded by the homepage only — it is the one page with a hero and with
// data-magnetic tiles — so GSAP never ships on the teaser pages. Everything
// else a page needs (Lenis, reveals, scrollspy) is in motion.js, which runs
// first; the two share nothing but the reduced-motion query, which each one
// watches for itself (perf pass 2026-10-02).
import gsap from 'gsap';

const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
// Mirrors the CSS motion tokens in global.css (--dur-1..4, --stagger-1), in
// seconds for GSAP. Change both together.
const DUR = { micro: 0.15, standard: 0.22, moderate: 0.4, deliberate: 0.6 };
const STAGGER = 0.07;
// A page opened in a background tab gets a throttled rAF; GSAP's default lag
// smoothing then advances tweens ~33ms per throttled frame and the hero intro
// crawls for many seconds once the tab is shown. With smoothing off, tweens
// catch up to real time — a load intro should simply be done by then.
gsap.ticker.lagSmoothing(0);
let intro;
let introPlayed = false;

function settleHero() {
  gsap.set(
    '[data-hero-slab], [data-hero-line], [data-hero-ctas], [data-hero-art], [data-hero-hello]',
    { clearProps: 'opacity,transform' }
  );
}

function playHeroIntro() {
  if (introPlayed || motionPreference.matches || !document.querySelector('[data-hero-slab]')) return;

  introPlayed = true;
  intro = gsap.timeline({ defaults: { ease: 'power4.out' } });
  intro
    .from('[data-hero-slab]', { opacity: 0, y: 24, duration: DUR.moderate }, 0)
    .from('[data-hero-line]', { yPercent: 120, duration: DUR.deliberate, stagger: STAGGER }, 0.1)
    .from('[data-hero-ctas]', { opacity: 0, y: 16, duration: DUR.deliberate }, 0.45)
    .from('[data-hero-art]', { opacity: 0, duration: DUR.deliberate }, 0.5)
    .from('[data-hero-hello]', { opacity: 0, y: -14, duration: DUR.moderate }, 0.55);
}

function stopHeroIntro() {
  intro?.kill();
  intro = undefined;
  settleHero();
}

motionPreference.addEventListener('change', (event) => {
  if (event.matches) stopHeroIntro();
  else playHeroIntro();
});

if (motionPreference.matches) settleHero();
else playHeroIntro();

// Magnetic sheets — project tiles and AI Space cards only (Uttham, 2026-09-20, late).
// This is the last tuning that was live before the tilt was retired earlier today
// (recovered verbatim from the 19 Sep session); values are not to be re-invented.
// Magnetic case-study pages — physically anchored at the top edge, where
// the washi tape holds the sheet down. The pivot lives there (not the
// card's center), so the taped top barely moves while the free area below
// tilts and lifts toward the pointer, like someone peeling the sheet up
// with a hand — the closer to the bottom, the more it lifts. Fine
// pointers only; CSS hover is the fallback elsewhere.
function initMagneticTiles() {
  // Perspective magnifies the free bottom edge of tall, single-column cards
  // into the next card's tape. Keep that effect on wider hover layouts only.
  // GSAP reverts its transforms when resizing back into the mobile layout.
  const media = gsap.matchMedia();
  media.add('(min-width: 768px) and (hover: hover) and (pointer: fine)', () => {
    const cleanup = [];
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      // Scale perspective with the sheet so wider/taller cards do not grow
      // into the next row's tape or the board bolts when tilted.
      // Tiles pivot at their tape; photos pivot where their stickers hold them.
      gsap.set(el, { transformOrigin: el.dataset.magneticOrigin || '50% 0%' });
      const updatePerspective = () => gsap.set(el, {
        transformPerspective: Math.max(400, el.offsetHeight * 4, el.offsetWidth * 4),
      });
      updatePerspective();
      const sizeObserver = new ResizeObserver(updatePerspective);
      sizeObserver.observe(el);
      const rxTo = gsap.quickTo(el, 'rotationX', { duration: DUR.micro, ease: 'power2.out' });
      const ryTo = gsap.quickTo(el, 'rotationY', { duration: DUR.micro, ease: 'power2.out' });
      const zTo = gsap.quickTo(el, 'z', { duration: DUR.micro, ease: 'power2.out' });

      const enter = () => {
        if (!motionPreference.matches) zTo(2);
      };
      const move = (event) => {
        if (motionPreference.matches) return;
        const rect = el.getBoundingClientRect();
        const nx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const ny = (event.clientY - rect.top) / rect.height;
        rxTo(gsap.utils.clamp(0, 4, ny * 4));
        ryTo(gsap.utils.clamp(-2.5, 2.5, nx * 2.5 * ny));
        zTo(2 + ny * 2.5);
      };
      const leave = () => {
        rxTo(0);
        ryTo(0);
        zTo(0);
      };
      el.addEventListener('pointerenter', enter);
      el.addEventListener('pointermove', move);
      el.addEventListener('pointerleave', leave);
      cleanup.push(() => {
        sizeObserver.disconnect();
        el.removeEventListener('pointerenter', enter);
        el.removeEventListener('pointermove', move);
        el.removeEventListener('pointerleave', leave);
      });
    });
    return () => cleanup.forEach((removeListeners) => removeListeners());
  });
}

initMagneticTiles();
