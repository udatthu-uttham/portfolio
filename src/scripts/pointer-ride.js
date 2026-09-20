// Pointer ride — the visitor rides the paper (plans/014, finished per plans/015).
// One sampler feeds two click-through canvases:
//   dust  — graphite the rear tyre lifts off the sheet. Viewport space, above
//           the header, emitted per unit of paper crossed, coasting on drag,
//           buoyancy and a slow curl, softening from grain to haze. Its sprites
//           are baked from the paper's own noise, so the specks in the air are
//           the sheet's tooth.
//   marks — rubber. Page space (scrolls with the paper), holds for --linger,
//           fades over FADE, sits below the header. Never on glass or controls.
// The ladder (plans/014 §3, quietened in plans/015): still or slow → nothing;
// a genuine flick → a wisp or two, tyres gripping; a real turn → a short scuff;
// a reversal → a skid; rapid back-and-forth → the 2 s burnout, dark rubber under it.
// Two greys, one rule: --graphite for anything the ride leaves in the air,
// --ink-900 for anything on the sheet. The hero's --ink-600 exhaust belongs to
// the illustration and is not touched.
// Still means nothing: no idle breath, no last-wisp timer. A click, a scroll or
// leaving the window stops the bike; dust already in the air finishes on its own.
// Pure functions and the sprite bakers are exported for tmp/verify-pointer-ride.mjs;
// nothing touches the DOM until initPointerRide runs.
export const MAX_PUFFS = 64;
export const MAX_DABS = 320;
export const BURST_EMISSION = 350; // ms the wheel spins after the trigger
export const BURST_CLEAR = 2000;   // ms after the trigger by which the cloud is gone
export const COOLDOWN = 4500;
export const BURST_SPEED = 1.15;   // px/ms sustained — the burnout detector's rung, distinct from RIDE.fast
export const FADE = 3000;          // the tail after --linger; the hold itself is the token
export const COVER_CAP = 0.26;     // rubber saturates: a cell holds this much; neighbours stack to ~0.5 at most
export const PAPER_TOOTH = 0.75;   // feTurbulence baseFrequency per CSS px — the same recipe as body::before in global.css
const CELL = 4;                    // px, coverage grid
const SURFACES = '[data-smoke-surface], .glass, .workboard, .tile, .note-link, .instax, .ai-mock__body, .cta, .case-artboard__paper';
const CONTROLS = 'a, button, input, textarea, select, summary, [role="button"]';

// The ladder. px/ms unless noted.
export const RIDE = Object.freeze({
  cruise: 0.6,        // below this the paper is untouched
  fast: 1.2,          // a brisk move — exhaust from here (settled between 0.9 and 1.8 after living with both)
  grip: 1.6,          // slip saturates
  sideways: 0.55,     // |sin| between path and bike heading the tyres hold before scuffing (~33°)
  minSlip: 0.25,      // below this no rubber
  headingTau: 90,     // ms — the bike swings round to follow the path this slowly
  pathTau: 28,        // ms — direction smoothing against pixel jitter
  speedTau: 40,       // ms — speed smoothing
  materialTau: 100,   // ms — how fast the dust look blends between paper and glass
  wheelbase: 14,      // px — the rear tyre trails the pointer by this along the heading
  reversalWindow: 400,// ms — a burnout needs a reversal this recent
  dabSpacing: 6,      // px between rubber dabs along the path
});

// Drawing measurements for the dust (plans/015 §2). These describe the
// residue, not the interface; docs/design-tokens.md lists them as measurements.
export const DUST = Object.freeze({
  spacing: 16,        // px of path between ordinary motes — a soft, slightly open ribbon
  guard: 16,          // most motes one sample may lay
  kick: 40,           // px/s the tyre kicks a mote back along the path
  burstKick: 70,
  drag: 4,            // /s — the kick decays; a mote coasts ~10 px, then hangs
  buoyancy: 18,       // px/s — warm dust rises
  curl: 2,            // px — lateral fray, sin(1.3 t + φ)
  size: [13, 19],     // px drawn; a mote softens, it does not swell
  stretchMax: 1.35,   // the fast rung smears a mote along the path this much
  stretchGain: 0.5,   // per px/ms above RIDE.fast
  life: [900, 1300],  // ms ordinary
  burstLife: [1100, 1800], // ms, clipped so the cloud is gone at BURST_CLEAR
  hold: 0.3,          // fraction of life at full alpha before the leaving curve
  leave: 1.4,         // the exponent shared with the rubber's fade
  glass: 0.6,         // alpha factor over glass
  bloom: 14,          // motes at the trigger
  bloomStagger: 8,    // ms between bloom births
  burstRate: 20,      // ms per burst tick after the bloom
  burstPer: 2,        // motes per tick
  burstAlive: 32,     // deterministic bound on the cloud
  burstSpread: 24,    // px around the seat for the bloom
  burstClockSpread: 12,// px around the tyre for the motes the spinning wheel keeps adding
  seeds: [11, 23, 37],// three grain variants; the haze is the first tile blurred
  bake: 18,           // CSS px — sprite size; drawn at 14–20 so one sprite px stays ≈ one device px
  haze: 1.2,          // CSS px — blur of the haze sprite
});

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = ([a, b], t) => a + (b - a) * t;

export function lcg(seed) {
  let state = seed >>> 0 || 1;
  return () => (state = (state * 1664525 + 1013904223) >>> 0) / 4294967296;
}

// Rubber saturates. Coverage is tracked per CELL of page space; a dab may only
// claim the room left under COVER_CAP, and gives it back when it fades.
export function createCoverage(cap = COVER_CAP, cell = CELL) {
  const cells = new Map();
  const key = (x, y) => `${(x / cell) | 0},${(y / cell) | 0}`;
  return {
    claim(x, y, alpha) {
      const k = key(x, y);
      const room = cap - (cells.get(k) ?? 0);
      if (room <= 0.01) return null;
      const granted = Math.min(room, alpha);
      cells.set(k, (cells.get(k) ?? 0) + granted);
      return { cell: k, alpha: granted };
    },
    release({ cell: k, alpha }) {
      const left = (cells.get(k) ?? 0) - alpha;
      if (left <= 0.001) cells.delete(k);
      else cells.set(k, left);
    },
    clear() { cells.clear(); },
    get size() { return cells.size; },
  };
}

export function smokeMaterial(target) {
  const surface = target?.closest?.(SURFACES);
  if (surface?.dataset.smokeSurface) return surface.dataset.smokeSurface === 'glass' ? 1 : 0;
  return surface?.matches('.glass, .workboard') ? 1 : 0;
}

// Parked at a link or button: the pointer is a hand, not a rider.
export function isControl(target) {
  return Boolean(target?.closest?.(CONTROLS));
}

// Require a sustained gesture, rather than one jump on entering the window.
export function updateGesture(previous, sample, now, cooldownUntil) {
  const dt = sample.dt;
  const fast = dt > 0 && dt <= 80 && sample.distance / dt > BURST_SPEED;
  // Brief slow points at a direction reversal should not erase a deliberate
  // back-and-forth gesture. Let that momentum decay instead of resetting it.
  const continuous = dt > 0 && dt <= 80;
  const duration = fast ? Math.min(220, previous.duration + dt) : continuous ? Math.max(0, previous.duration - dt) : 0;
  const distance = fast ? Math.min(1200, previous.distance + sample.distance) : continuous ? previous.distance * 0.75 : 0;
  const burst = duration >= 110 && distance >= 220 && now >= cooldownUntil;
  return { duration: burst ? 0 : duration, distance: burst ? 0 : distance, burst };
}

export function createRide() {
  return {
    last: null,
    hx: 0, hy: 0,      // bike heading (lags the path)
    px: 0, py: 0,      // smoothed path direction
    speed: 0,
    surface: 0,        // instantaneous material under the previous sample
    material: 0,       // blended material for the dust look
    gesture: { duration: 0, distance: 0 },
    burstStarted: -Infinity,
    burstTicks: 0,     // burst clock ticks already owed
    cooldownUntil: 0,
    lastReversal: -Infinity,
    reversalTyre: null,// where the tyre was at the last reversal — the burnout's seat
    carry: 0,          // path distance since the last dab
    dustCarry: 0,      // path distance since the last mote
    releasing: 0,      // dabs still owed after the tyre lets go
    lastDabAlpha: 0,
  };
}

function settle(ride, s) {
  ride.last = { x: s.x, y: s.y, time: s.now };
  ride.material = s.material;
  ride.surface = s.material;
  ride.gesture = { duration: 0, distance: 0 };
  ride.hx = ride.hy = ride.px = ride.py = 0;
  ride.speed = 0;
  ride.carry = ride.dustCarry = 0;
  ride.releasing = 0;
  // A re-entry is not a ride: the burnout ends, and an old reversal cannot seat a new one.
  ride.burstStarted = -Infinity;
  ride.burstTicks = 0;
  ride.lastReversal = -Infinity;
  ride.reversalTyre = null;
  return null;
}

// Lay points every `spacing` px along the segment, each where it is owed.
function owed(from, nx, ny, distance, spacing, carry, guard = Infinity) {
  const points = [];
  let d = spacing - carry;
  while (d <= distance && points.length < guard) {
    points.push({ x: from.x + nx * d, y: from.y + ny * d });
    d += spacing;
  }
  return { points, carry: Math.min(spacing, distance - (d - spacing)) };
}

// One pointer sample → what the tyres and the dust do. Deterministic; the
// renderers add their own seeded jitter. `s` = { x, y, now, material (0 paper
// | 1 glass), control }. Returns null when nothing moved.
export function rideStep(ride, s) {
  if (!ride.last || s.now - ride.last.time > 160) return settle(ride, s);
  const from = ride.last;
  const dt = s.now - from.time;
  const dx = s.x - from.x, dy = s.y - from.y;
  const distance = Math.hypot(dx, dy);
  // A jump no hand makes — the pointer re-entered elsewhere, or two pointers
  // interleaved — is a re-entry, not a ride. Settle, lay nothing along it.
  if (distance > 160 && distance / Math.max(dt, 1) > 8) return settle(ride, s);
  ride.last = { x: s.x, y: s.y, time: s.now };
  if (distance < 1 || dt <= 0) return null;
  const nx = dx / distance, ny = dy / distance;

  // Kinematics: smoothed speed, smoothed path direction, lagging heading.
  ride.speed += (distance / dt - ride.speed) * (1 - Math.exp(-dt / RIDE.speedTau));
  const kp = 1 - Math.exp(-dt / RIDE.pathTau);
  ride.px += (nx - ride.px) * kp;
  ride.py += (ny - ride.py) * kp;
  const pl = Math.hypot(ride.px, ride.py);
  const pathx = pl > 1e-3 ? ride.px / pl : nx;
  const pathy = pl > 1e-3 ? ride.py / pl : ny;
  if (ride.hx === 0 && ride.hy === 0) {
    ride.hx = pathx;
    ride.hy = pathy;
  } else {
    const kh = 1 - Math.exp(-dt / RIDE.headingTau);
    ride.hx += (pathx - ride.hx) * kh;
    ride.hy += (pathy - ride.hy) * kh;
  }
  const hl = Math.hypot(ride.hx, ride.hy);
  const hux = hl > 1e-3 ? ride.hx / hl : pathx;
  const huy = hl > 1e-3 ? ride.hy / hl : pathy;
  // A heading that has collapsed to nothing is a wheel mid-reversal: dragged.
  const sin = hl > 1e-3 ? Math.abs(hux * pathy - huy * pathx) : 0;
  const cos = hl > 1e-3 ? hux * pathx + huy * pathy : -1;
  const speedFactor = clamp((ride.speed - RIDE.cruise) / (RIDE.grip - RIDE.cruise), 0, 1);
  let slip = clamp(Math.max(0, (sin - RIDE.sideways) / (1 - RIDE.sideways)) + Math.max(0, -cos), 0, 1) * speedFactor;
  // The rear tyre trails the pointer along the heading; dust lifts from there.
  const tyre = { x: s.x - hux * RIDE.wheelbase, y: s.y - huy * RIDE.wheelbase };

  // The path running against the heading is a reversal: the tyre is dragged.
  if (cos < -0.3 && ride.speed >= RIDE.cruise) {
    ride.lastReversal = s.now;
    ride.reversalTyre = tyre;
  }

  // Codex's material blend and burnout detector; the burnout itself is
  // reserved for rapid back-and-forth, so a fast straight swipe keeps its
  // tyres gripping and only leaves exhaust.
  ride.material += (s.material - ride.material) * (1 - Math.exp(-dt / RIDE.materialTau));
  ride.gesture = updateGesture(ride.gesture, { dt, distance }, s.now, ride.cooldownUntil);
  const trigger = ride.gesture.burst && s.now - ride.lastReversal < RIDE.reversalWindow;
  if (trigger) {
    ride.burstStarted = s.now;
    ride.burstTicks = 0;
    ride.cooldownUntil = s.now + COOLDOWN;
  }
  const burst = s.now - ride.burstStarted < BURST_EMISSION;
  if (burst) slip = 1; // the wheel spins through the whole burnout
  // A spinning wheel emits per time: motes owed by the burst clock since the last sample.
  // A hesitation inside the window owes nothing afterwards: the backlog is dropped, not dumped.
  let burstMotes = 0;
  if (burst && !trigger) {
    const ticks = Math.floor((s.now - ride.burstStarted) / DUST.burstRate);
    if (dt <= 80) burstMotes = Math.max(0, ticks - ride.burstTicks) * DUST.burstPer;
    ride.burstTicks = Math.max(ride.burstTicks, ticks);
  }

  // Rubber: paper at both ends of the segment, no control, enough slip. When
  // the tyre lets go, two more owed dabs fade out (×0.5, ×0.25) so a mark ends
  // as a release, not a cut.
  const dabs = [];
  const onPaper = !s.control && s.material === 0 && ride.surface === 0;
  const dabAlpha = burst ? 0.2 : 0.04 + 0.12 * slip;
  if (onPaper && slip >= RIDE.minSlip) {
    const laid = owed(from, nx, ny, distance, RIDE.dabSpacing, ride.carry);
    for (const p of laid.points) dabs.push({ ...p, fade: 1 });
    ride.carry = laid.carry;
    ride.releasing = 2;
    ride.lastDabAlpha = dabAlpha;
  } else if (onPaper && ride.releasing > 0) {
    const laid = owed(from, nx, ny, distance, RIDE.dabSpacing, ride.carry, ride.releasing);
    for (const p of laid.points) {
      dabs.push({ ...p, fade: ride.releasing === 2 ? 0.5 : 0.25 });
      ride.releasing--;
    }
    ride.carry = laid.carry;
  } else {
    ride.carry = 0;
    ride.releasing = 0;
  }
  ride.surface = s.material;

  // Dust: gripping tyres lift graphite per distance, only on a genuine flick or
  // while slipping. The carry starts at zero, so the first mote is owed after
  // one step of fast travel, never on the crossing itself.
  const exhaust = !s.control && (ride.speed >= RIDE.fast || slip >= RIDE.minSlip);
  let motes = [];
  if (exhaust) {
    const lifted = owed(from, nx, ny, distance, DUST.spacing, ride.dustCarry, DUST.guard);
    motes = lifted.points.map((p) => ({ x: p.x - hux * RIDE.wheelbase, y: p.y - huy * RIDE.wheelbase }));
    ride.dustCarry = lifted.carry;
  } else {
    ride.dustCarry = 0;
  }

  return {
    dt, distance, speed: ride.speed, nx, ny,
    angle: Math.atan2(pathy, pathx),
    sin, cos, slip, trigger, burst,
    tyre,
    seat: trigger ? (ride.reversalTyre ?? tyre) : null,
    bloom: trigger && !s.control ? DUST.bloom : 0,
    burstMotes: s.control ? 0 : burstMotes,
    motes,
    stretch: ride.speed >= RIDE.fast ? 1 + Math.min(DUST.stretchMax - 1, (ride.speed - RIDE.fast) * DUST.stretchGain) : 1,
    dabs,
    dabAlpha: dabs.length ? (dabs[0].fade === 1 ? dabAlpha : ride.lastDabAlpha) : dabAlpha,
    dabWidth: 3 + 4 * slip,
    material: ride.material,
  };
}

function parseRgb(value) {
  const m = value?.match(/rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  const h = value?.trim().match(/^#([0-9a-f]{6})$/i);
  return h ? [0, 2, 4].map((i) => parseInt(h[1].slice(i, i + 2), 16)) : null;
}

// The dust sprite: a disc of the paper's own noise, thresholded at the noise
// median so about half its pixels are graphite specks (grain), or the same
// blurred into haze. The disc holds to 70% of its radius, then feathers.
// Baked at one sprite pixel per device pixel, so a speck on screen is the size
// of the sheet's tooth. Returns the SVG source; rasterised in rasterize().
export function dustSvg({ size, ratio, rgb, seed, blur = 0 }) {
  const S = Math.round(size * ratio);
  const [r, g, b] = rgb.map((v) => (v / 255).toFixed(3));
  const freq = (PAPER_TOOTH / ratio).toFixed(4);
  const soften = blur ? `<feGaussianBlur in="t" stdDeviation="${(blur * ratio).toFixed(2)}" result="t"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">` +
    `<defs><radialGradient id="d"><stop offset="0" stop-color="#000"/><stop offset="0.7" stop-color="#000"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>` +
    `<filter id="f" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">` +
    `<feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="2" seed="${seed}" stitchTiles="stitch" result="n"/>` +
    `<feColorMatrix in="n" type="saturate" values="0" result="g"/>` +
    `<feColorMatrix in="g" type="matrix" values="0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 16 0 0 0 -7.5" result="t"/>` +
    soften +
    `<feComposite in="t" in2="SourceGraphic" operator="in"/></filter></defs>` +
    `<circle cx="${S / 2}" cy="${S / 2}" r="${S / 2}" fill="url(#d)" filter="url(#f)"/></svg>`;
}

// A browser that decodes the SVG but drops its filter hands back a blank or a
// solid black disc without an error, so the raster is checked, not trusted.
function rasterize(svg, S, rgb, timeout = 2500) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timer = setTimeout(() => reject(new Error('dust bake timed out')), timeout);
    img.onload = () => {
      clearTimeout(timer);
      const sprite = document.createElement('canvas');
      sprite.width = sprite.height = S;
      const ctx = sprite.getContext('2d');
      ctx.drawImage(img, 0, 0, S, S);
      const px = ctx.getImageData(0, 0, S, S).data;
      let n = 0, dr = 0, dg = 0, db = 0;
      for (let i = 0; i < px.length; i += 4) {
        if (px[i + 3] < 60) continue;
        n++;
        dr += Math.abs(px[i] - rgb[0]);
        dg += Math.abs(px[i + 1] - rgb[1]);
        db += Math.abs(px[i + 2] - rgb[2]);
      }
      if (!n) return reject(new Error('dust bake empty'));
      if ((dr + dg + db) / (3 * n) > 24) return reject(new Error('dust bake unfiltered'));
      resolve(sprite);
    };
    img.onerror = () => { clearTimeout(timer); reject(new Error('dust bake failed')); };
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  });
}

// If a browser refuses SVG filters in an <img>, the dust is drawn grain: the
// same soft disc with seeded specks at tooth scale. Never silence.
export function makeFallbackSprite(S, [r, g, b], seed = 3) {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = S;
  const ctx = sprite.getContext('2d');
  const rnd = lcg(seed);
  const c = S / 2;
  const disc = ctx.createRadialGradient(c, c, 0, c, c, c);
  disc.addColorStop(0, `rgba(${r},${g},${b},0.55)`);
  disc.addColorStop(0.5, `rgba(${r},${g},${b},0.4)`);
  disc.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = disc;
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = `rgba(${r},${g},${b},0.35)`;
  for (let i = 0; i < S * S * 0.18; i++) {
    const x = rnd() * S, y = rnd() * S;
    if (Math.hypot(x - c, y - c) > c) continue;
    ctx.fillRect(x, y, 1, 1);
  }
  return sprite;
}

// Seeded value noise on a lattice one tooth wide (1 / PAPER_TOOTH CSS px), so
// the tread's edge is decided at the same scale as the sheet's grain.
function toothNoise(seed, W, H, ratio) {
  const cell = Math.max(1, ratio / PAPER_TOOTH);
  const cols = Math.ceil(W / cell) + 2, rows = Math.ceil(H / cell) + 2;
  const rnd = lcg(seed * 7919);
  const lattice = Array.from({ length: cols * rows }, () => rnd());
  const smooth = (v) => v * v * (3 - 2 * v);
  return (x, y) => {
    const gx = x / cell, gy = y / cell;
    const x0 = Math.floor(gx), y0 = Math.floor(gy);
    const fx = smooth(gx - x0), fy = smooth(gy - y0);
    const at = (i, j) => lattice[Math.min(rows - 1, j) * cols + Math.min(cols - 1, i)];
    const top = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * fx;
    const bottom = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * fx;
    return top + (bottom - top) * fy;
  };
}

// A rubber dab, baked at the drawn size times the backing ratio so its edge
// survives to the screen: a capsule of ink, solid where the across-track
// gradient is at least 0.55, and toward the edge kept only where the tooth
// noise peaks — rubber caught on fibres. Two hairline gaps where fibres lifted it.
export function makeTreadSprite(seed, [r, g, b], ratio = 1) {
  const W = Math.max(6, Math.round(12 * ratio)), H = Math.max(3, Math.round(6 * ratio));
  const sprite = document.createElement('canvas');
  sprite.width = W;
  sprite.height = H;
  const ctx = sprite.getContext('2d');
  const image = ctx.createImageData(W, H);
  const rnd = lcg(seed);
  const noise = toothNoise(seed, W, H, ratio);
  const gaps = [Math.floor(W * (0.25 + rnd() * 0.15)), Math.floor(W * (0.6 + rnd() * 0.15))];
  const radius = H / 2;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const px = x + 0.5, py = y + 0.5;
      const ax = clamp(px, radius, W - radius); // nearest point on the capsule's axis
      const d = Math.hypot(px - ax, py - radius) / radius; // 0 on the axis, 1 at the edge
      let keep = 0;
      if (d <= 1) {
        const core = 1 - d;
        // Toward the edge the noise must clear a bar that rises to 1 at the rim.
        keep = core >= 0.55 ? 1 : noise(px, py) > 0.5 + 0.5 * (0.55 - core) / 0.55 ? 1 : 0;
        if (gaps.includes(x) && rnd() < 0.6) keep *= 0.45;
      }
      const i = (y * W + x) * 4;
      image.data[i] = r;
      image.data[i + 1] = g;
      image.data[i + 2] = b;
      image.data[i + 3] = Math.round(255 * keep);
    }
  }
  ctx.putImageData(image, 0, 0);
  return sprite;
}

export function initPointerRide({ smoke, marks }) {
  const sctx = smoke?.getContext('2d') ?? null;
  const mctx = marks?.getContext('2d') ?? null;
  if (!sctx && !mctx) return () => {};
  const media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const contrast = matchMedia('(prefers-contrast: more)');
  const listeners = new AbortController();
  const root = getComputedStyle(document.documentElement);
  // Two greys: graphite in the air, ink on the sheet. --dust-alpha is the
  // ceiling for anything airborne (the hero's own 0.16); graphite's own alpha
  // is not stacked on top of it.
  const graphite = parseRgb(root.getPropertyValue('--graphite')) || [58, 55, 46];
  const ink = parseRgb(root.getPropertyValue('--ink-900')) || [22, 20, 14];
  const dustAlpha = parseFloat(root.getPropertyValue('--dust-alpha')) || 0.22;
  const fadeIn = Math.max(60, parseFloat(root.getPropertyValue('--dur-1')) || 150);
  const LINGER = parseFloat(root.getPropertyValue('--linger')) || 8000;
  const ride = createRide();
  const rnd = lcg(2026);
  let sprites = null;   // { grains: [three variants], haze }
  let treads = null;    // four variants
  let baking = false;
  let particles = [];
  let dabs = [];
  const cover = createCoverage();
  let smokeFrame = 0, marksFrame = 0, marksTimer = 0;
  let width = 0, height = 0, ratio = 0, bakeId = 0, lastScrollAt = -Infinity;

  // The bike stops: no more emission. The dust already in the air finishes on its own.
  function stopRiding() {
    ride.last = null;
    ride.gesture = { duration: 0, distance: 0 };
    ride.burstStarted = -Infinity;
    ride.releasing = 0;
    ride.carry = ride.dustCarry = 0;
  }

  // The air is erased: only when the page hides, the layer is switched off, or the canvas is rebuilt.
  function clearSmoke() {
    stopRiding();
    if (smokeFrame) cancelAnimationFrame(smokeFrame);
    smokeFrame = 0;
    particles = [];
    sctx?.clearRect(0, 0, width, height);
  }

  function clearMarks() {
    if (marksFrame) cancelAnimationFrame(marksFrame);
    if (marksTimer) clearTimeout(marksTimer);
    marksFrame = marksTimer = 0;
    dabs = [];
    cover.clear();
    mctx?.clearRect(0, 0, width, height);
  }

  function size(canvas, context) {
    if (!context) return;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  // Sprites are baked once per backing ratio, off the critical path.
  function bake() {
    const id = ++bakeId;
    const S = Math.round(DUST.bake * ratio);
    treads = [7, 19, 41, 67].map((seed) => makeTreadSprite(seed, ink, ratio));
    baking = true;
    const idle = window.requestIdleCallback
      ? (cb) => window.requestIdleCallback(cb, { timeout: 1000 })
      : (cb) => setTimeout(cb, 120);
    idle(() => {
      if (id !== bakeId) return;
      const grain = (seed, blur = 0) => rasterize(dustSvg({ size: DUST.bake, ratio, rgb: graphite, seed, blur }), S, graphite);
      Promise.all([...DUST.seeds.map((seed) => grain(seed)), grain(DUST.seeds[0], DUST.haze)])
        .then((baked) => { if (id === bakeId) sprites = { grains: baked.slice(0, -1), haze: baked.at(-1) }; })
        .catch(() => {
          if (id !== bakeId) return;
          const grains = DUST.seeds.map((seed) => makeFallbackSprite(S, graphite, seed));
          sprites = { grains, haze: grains[0] };
        })
        .finally(() => { if (id === bakeId) baking = false; });
    });
  }

  function resize() {
    clearSmoke();
    clearMarks(); // page positions are stale after a reflow
    if (!media.matches) {
      // Gate closed (touch, reduced motion): keep the layer empty and unbuilt.
      bakeId++;
      baking = false;
      sprites = treads = null;
      ratio = 0;
      if (smoke) smoke.width = smoke.height = 0;
      if (marks) marks.width = marks.height = 0;
      return;
    }
    width = innerWidth;
    height = innerHeight;
    // Cap both density and total pixel area on large / high-DPI displays; quantised
    // so a window drag above the area cap does not rebake on every event.
    const next = Math.round(Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(4000000 / (width * height))) * 20) / 20;
    if (next !== ratio || (!sprites && !baking)) { ratio = next; bake(); }
    size(smoke, sctx);
    size(marks, mctx);
  }

  // Moving the window between displays changes devicePixelRatio without a resize.
  function watchDpr() {
    const query = matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
    query.addEventListener('change', () => { resize(); watchDpr(); }, { once: true, signal: listeners.signal });
  }

  function emitMote(x, y, dirx, diry, step, { burst = false, born }) {
    if (particles.length >= MAX_PUFFS) particles.shift();
    const life = burst
      ? Math.min(lerp(DUST.burstLife, rnd()), ride.burstStarted + BURST_CLEAR - born)
      : lerp(DUST.life, rnd());
    if (life <= 0) return;
    particles.push({
      x, y,
      bx: -dirx, by: -diry,   // kicked back along the path
      lx: -diry, ly: dirx,    // curl runs across it
      phase: rnd() * Math.PI * 2,
      variant: (rnd() * DUST.seeds.length) | 0,
      size: lerp(DUST.size, rnd()),
      kick: burst ? DUST.burstKick : DUST.kick,
      stretch: burst ? 1 : step.stretch,
      angle: step.angle,
      material: step.material,
      life, born, burst,
    });
  }

  function paintSmoke(now) {
    smokeFrame = 0;
    sctx.clearRect(0, 0, width, height);
    particles = particles.filter((p) => now - p.born < p.life);
    if (sprites) {
      const { grains, haze } = sprites;
      for (const m of particles) {
        const grain = grains[m.variant] ?? grains[0];
        const age = now - m.born;
        if (age < 0) continue; // a staggered bloom birth still to come
        const u = age / m.life;
        const t = age / 1000;
        const back = m.kick * (1 - Math.exp(-DUST.drag * t)) / DUST.drag;
        const curl = DUST.curl * Math.sin(1.3 * t + m.phase);
        const x = m.x + m.bx * back + m.lx * curl;
        const y = m.y + m.by * back + m.ly * curl - DUST.buoyancy * t;
        const q = Math.min(1, age / fadeIn);
        const arrive = 1 - (1 - q) ** 2;
        const stay = u <= DUST.hold ? 1 : (1 - (u - DUST.hold) / (1 - DUST.hold)) ** DUST.leave;
        const a = dustAlpha * arrive * stay * (1 - m.material * (1 - DUST.glass));
        if (a < 0.003) continue;
        const s = m.size;
        const sx = 1 + (m.stretch - 1) * (1 - u) ** 2;
        if (sx > 1.01) {
          sctx.save();
          sctx.translate(x, y);
          sctx.rotate(m.angle);
          sctx.scale(sx, 1);
          sctx.globalAlpha = a * 0.5 * (1 - u);
          sctx.drawImage(grain, -s / 2, -s / 2, s, s);
          sctx.globalAlpha = a * (0.5 + 0.5 * u);
          sctx.drawImage(haze, -s / 2, -s / 2, s, s);
          sctx.restore();
        } else {
          // A round mote needs no transform.
          sctx.globalAlpha = a * 0.5 * (1 - u);
          sctx.drawImage(grain, x - s / 2, y - s / 2, s, s);
          sctx.globalAlpha = a * (0.5 + 0.5 * u);
          sctx.drawImage(haze, x - s / 2, y - s / 2, s, s);
        }
      }
      sctx.globalAlpha = 1;
    }
    if (particles.length) smokeFrame = requestAnimationFrame(paintSmoke);
  }

  function emitDab(point, step, now) {
    const x = point.x, y = point.y + scrollY; // page space
    const claim = cover.claim(x, y, step.dabAlpha * point.fade * (0.85 + rnd() * 0.15));
    if (!claim) return; // this bit of paper holds all the rubber it can
    if (dabs.length >= MAX_DABS) cover.release(dabs.shift());
    dabs.push({
      x, y, cell: claim.cell, alpha: claim.alpha,
      angle: step.angle,            // exactly along the path; the bite is the breakup
      length: 9.5 + rnd(),
      width: step.dabWidth,
      sprite: (rnd() * treads.length) | 0,
      born: now,
    });
  }

  function scheduleMarks() {
    if (!marksFrame) marksFrame = requestAnimationFrame(paintMarks);
  }

  // Runs only while something changes: a new dab, a scroll, or a fade. A held
  // mark costs no frames; a timer wakes the loop when the first one starts to go.
  function paintMarks(now) {
    marksFrame = 0;
    if (marksTimer) clearTimeout(marksTimer);
    marksTimer = 0;
    mctx.clearRect(0, 0, width, height);
    const sy = scrollY;
    let fading = false;
    let nextFade = Infinity;
    dabs = dabs.filter((d) => now - d.born < LINGER + FADE || (cover.release(d), false));
    for (const dab of dabs) {
      const age = now - dab.born;
      let hold = 1;
      if (age > LINGER) {
        hold = (1 - (age - LINGER) / FADE) ** DUST.leave;
        fading = true;
      } else {
        nextFade = Math.min(nextFade, dab.born + LINGER - now);
      }
      const y = dab.y - sy;
      if (y < -24 || y > height + 24) continue;
      mctx.save();
      mctx.translate(dab.x, y);
      mctx.rotate(dab.angle);
      mctx.globalAlpha = dab.alpha * hold;
      mctx.drawImage(treads[dab.sprite], -dab.length / 2, -dab.width / 2, dab.length, dab.width);
      mctx.restore();
    }
    if (fading) marksFrame = requestAnimationFrame(paintMarks);
    else if (nextFade < Infinity) marksTimer = setTimeout(scheduleMarks, nextFade + 16);
  }

  function move(event) {
    if (!media.matches || document.hidden || event.pointerType !== 'mouse' || event.buttons) return;
    const now = performance.now();
    const step = rideStep(ride, {
      x: event.clientX,
      y: event.clientY,
      now,
      material: smokeMaterial(event.target),
      control: isControl(event.target),
    });
    if (!step) return;
    if (mctx && treads && step.dabs.length && !contrast.matches) {
      for (const point of step.dabs) emitDab(point, step, now);
      scheduleMarks();
    }
    if (!sctx || !sprites) return;
    let emitted = false;
    for (const p of step.motes) {
      emitMote(p.x, p.y, step.nx, step.ny, step, { born: now });
      emitted = true;
    }
    if (step.bloom || step.burstMotes) {
      const alive = particles.reduce((n, m) => n + (m.burst ? 1 : 0), 0);
      const room = Math.max(0, DUST.burstAlive - alive);
      const seat = step.seat ?? step.tyre;
      const spread = step.bloom ? DUST.burstSpread : DUST.burstClockSpread;
      const count = Math.min(room, step.bloom || step.burstMotes);
      // The bloom is staggered; the clock's motes are spaced across their tick.
      const stagger = step.bloom ? DUST.bloomStagger : DUST.burstRate / DUST.burstPer;
      for (let i = 0; i < count; i++) {
        const a = rnd() * Math.PI * 2;
        emitMote(
          seat.x + (rnd() - 0.5) * 2 * spread,
          seat.y + (rnd() - 0.5) * 2 * spread,
          Math.cos(a), Math.sin(a), step,
          { burst: true, born: now + i * stagger },
        );
        emitted = true;
      }
    }
    if (emitted && !smokeFrame) smokeFrame = requestAnimationFrame(paintSmoke);
  }

  function repaintMarks() {
    if (dabs.length) scheduleMarks();
  }

  const options = { passive: true, signal: listeners.signal };
  window.addEventListener('pointermove', move, options);
  window.addEventListener('pointerdown', stopRiding, options);  // a click stops the bike; the air finishes, the rubber stays
  window.addEventListener('blur', stopRiding, options);
  window.addEventListener('pagehide', clearSmoke, options);
  window.addEventListener('resize', resize, options);
  window.addEventListener('scroll', () => {
    // Lenis emits a scroll event per frame for about a second after one wheel
    // notch, sparser as it settles; the bike stops once per gesture, not once
    // per frame or once per settling step.
    const now = performance.now();
    if (now - lastScrollAt > 400) stopRiding();
    lastScrollAt = now;
    repaintMarks();
  }, options);
  document.documentElement.addEventListener('pointerleave', stopRiding, options);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearSmoke(); else repaintMarks(); }, options);
  media.addEventListener('change', resize, { signal: listeners.signal }); // opens or closes the gate
  contrast.addEventListener('change', clearMarks, { signal: listeners.signal });
  resize();
  watchDpr();
  // Dev-only peek for the verification harness; stripped from production builds.
  if (import.meta.env?.DEV) {
    window.__pointerRide = {
      peek: () => ({ ratio, baking, sprites: !!sprites, treads: !!treads, particles: particles.length, dabs: dabs.length, width, height, gate: media.matches, ride: { last: !!ride.last, speed: ride.speed } }),
    };
  }
  return () => {
    bakeId++;
    clearSmoke();
    clearMarks();
    listeners.abort();
  };
}
