// Pointer ride — the visitor rides the paper (plans/014, finished per plans/015).
// One sampler feeds one click-through canvas of exhaust: soft puffs of gas
// that leave the bike's pipe behind the pointer, swell as they cool, rise and
// thin out. Viewport space, above the header.
// 2026-10-05 (Uttham: "lets get rid of the tire marks, that is distracting and
// the exhaust fumes were misinterpreted as brush strokes, lets get subtle
// exhaust fumes, more like gas feel"): the rubber marks layer is gone, and the
// old graphite dust — grain baked from the paper's noise, smeared along the
// path at speed — is now gas: a round, feathered puff with no grain and no
// smear, born small and faint, growing as it fades.
// The ladder (plans/014 §3, quietened in plans/015): still or slow → nothing;
// a genuine flick → a few puffs; rapid back-and-forth → the burnout, a small
// cloud that is gone in 2 s.
// One grey: --graphite, at most --dust-alpha. The hero's --ink-600 exhaust
// belongs to the illustration and is not touched.
// Still means nothing: no idle breath, no last-wisp timer. A click, a scroll or
// leaving the window stops the bike; gas already in the air finishes on its own.
// Pure functions are exported so a harness can drive them; nothing touches the
// DOM until initPointerRide runs.
export const MAX_PUFFS = 64;
export const BURST_EMISSION = 350; // ms the wheel spins after the trigger
export const BURST_CLEAR = 2000;   // ms after the trigger by which the cloud is gone
export const COOLDOWN = 4500;
export const BURST_SPEED = 1.15;   // px/ms sustained — the burnout detector's rung, distinct from RIDE.fast
const SURFACES = '[data-smoke-surface], .glass, .workboard, .tile, .note-link, .instax, .ai-mock__body, .cta, .case-artboard__paper';
const CONTROLS = 'a, button, input, textarea, select, summary, [role="button"]';

// The ladder. px/ms unless noted.
export const RIDE = Object.freeze({
  cruise: 0.6,        // below this the paper is untouched
  fast: 1.2,          // a brisk move — exhaust from here (settled between 0.9 and 1.8 after living with both)
  headingTau: 90,     // ms — the bike swings round to follow the path this slowly
  pathTau: 28,        // ms — direction smoothing against pixel jitter
  speedTau: 40,       // ms — speed smoothing
  materialTau: 100,   // ms — how fast the gas blends between paper and glass
  wheelbase: 14,      // px — the pipe trails the pointer by this along the heading
  reversalWindow: 400,// ms — a burnout needs a reversal this recent
});

// Drawing measurements for the gas. These describe the exhaust, not the
// interface; docs/design-tokens.md lists them as measurements.
export const GAS = Object.freeze({
  spacing: 20,        // px of path between puffs — close enough that they overlap into one wisp
  guard: 5,           // most puffs one sample may lay
  scatter: [9, 6],    // px a puff is born off its owed point, along and across the path, so no row of beads
  fan: 0.6,           // rad either side of straight back the pipe may push a puff
  kick: 24,           // px/s the pipe pushes a puff back along the path
  drag: 3,            // /s — the push decays; a puff drifts ~8 px, then hangs
  buoyancy: 14,       // px/s — warm gas rises
  curl: 4,            // px — lateral sway, sin(1.1 t + φ)
  born: [15, 21],     // px across at birth: already a soft breath, never a dot
  grown: [42, 60],    // px across at the end of its life: gas swells as it cools
  life: [1400, 2000], // ms ordinary
  burstLife: [1300, 1900], // ms, clipped so the cloud is gone at BURST_CLEAR
  peak: 0.62,         // × --dust-alpha at the puff's densest; overlap builds the rest
  arrive: 140,        // ms to reach its densest
  hold: 0.3,          // fraction of life before it starts to thin
  leave: 1.3,         // the thinning curve's exponent
  glass: 0.6,         // alpha factor over glass
  bloom: 7,           // puffs at the trigger
  bloomStagger: 14,   // ms between bloom births
  burstRate: 40,      // ms per burst tick after the bloom
  burstPer: 1,        // puffs per tick
  burstAlive: 16,     // deterministic bound on the cloud
  burstSpread: 16,    // px around the seat for the bloom
  burstClockSpread: 10,// px around the pipe for the puffs the spinning wheel keeps adding
  burstGrown: [56, 76],// px — a burnout's puffs swell further
  variants: 3,        // baked puff shapes
  bake: 64,           // CSS px — sprite size, drawn scaled down so its feather stays smooth
});

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = ([a, b], t) => a + (b - a) * t;

export function lcg(seed) {
  let state = seed >>> 0 || 1;
  return () => (state = (state * 1664525 + 1013904223) >>> 0) / 4294967296;
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
    material: 0,       // blended material for the gas look
    gesture: { duration: 0, distance: 0 },
    burstStarted: -Infinity,
    burstTicks: 0,     // burst clock ticks already owed
    cooldownUntil: 0,
    lastReversal: -Infinity,
    reversalPipe: null,// where the pipe was at the last reversal — the burnout's seat
    gasCarry: 0,       // path distance since the last puff
  };
}

function settle(ride, s) {
  ride.last = { x: s.x, y: s.y, time: s.now };
  ride.material = s.material;
  ride.gesture = { duration: 0, distance: 0 };
  ride.hx = ride.hy = ride.px = ride.py = 0;
  ride.speed = 0;
  ride.gasCarry = 0;
  // A re-entry is not a ride: the burnout ends, and an old reversal cannot seat a new one.
  ride.burstStarted = -Infinity;
  ride.burstTicks = 0;
  ride.lastReversal = -Infinity;
  ride.reversalPipe = null;
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

// One pointer sample → what the pipe breathes out. Deterministic; the renderer
// adds its own seeded jitter. `s` = { x, y, now, material (0 paper | 1 glass),
// control }. Returns null when nothing moved.
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
  const cos = hl > 1e-3 ? hux * pathx + huy * pathy : -1;
  // The pipe trails the pointer along the heading; the gas leaves from there.
  const pipe = { x: s.x - hux * RIDE.wheelbase, y: s.y - huy * RIDE.wheelbase };

  // The path running against the heading is a reversal.
  if (cos < -0.3 && ride.speed >= RIDE.cruise) {
    ride.lastReversal = s.now;
    ride.reversalPipe = pipe;
  }

  // The burnout is reserved for rapid back-and-forth, so a fast straight swipe
  // only breathes a few puffs.
  ride.material += (s.material - ride.material) * (1 - Math.exp(-dt / RIDE.materialTau));
  ride.gesture = updateGesture(ride.gesture, { dt, distance }, s.now, ride.cooldownUntil);
  const trigger = ride.gesture.burst && s.now - ride.lastReversal < RIDE.reversalWindow;
  if (trigger) {
    ride.burstStarted = s.now;
    ride.burstTicks = 0;
    ride.cooldownUntil = s.now + COOLDOWN;
  }
  const burst = s.now - ride.burstStarted < BURST_EMISSION;
  // A spinning wheel breathes per time: puffs owed by the burst clock since the last sample.
  // A hesitation inside the window owes nothing afterwards: the backlog is dropped, not dumped.
  let burstPuffs = 0;
  if (burst && !trigger) {
    const ticks = Math.floor((s.now - ride.burstStarted) / GAS.burstRate);
    if (dt <= 80) burstPuffs = Math.max(0, ticks - ride.burstTicks) * GAS.burstPer;
    ride.burstTicks = Math.max(ride.burstTicks, ticks);
  }

  // Exhaust per distance, only on a genuine flick. The carry starts at zero, so
  // the first puff is owed after one step of fast travel, never on the crossing.
  const breathing = !s.control && ride.speed >= RIDE.fast;
  let puffs = [];
  if (breathing) {
    const laid = owed(from, nx, ny, distance, GAS.spacing, ride.gasCarry, GAS.guard);
    puffs = laid.points.map((p) => ({ x: p.x - hux * RIDE.wheelbase, y: p.y - huy * RIDE.wheelbase }));
    ride.gasCarry = laid.carry;
  } else {
    ride.gasCarry = 0;
  }

  return {
    dt, distance, speed: ride.speed, nx, ny,
    trigger, burst,
    pipe,
    seat: trigger ? (ride.reversalPipe ?? pipe) : null,
    bloom: trigger && !s.control ? GAS.bloom : 0,
    burstPuffs: s.control ? 0 : burstPuffs,
    puffs,
    material: ride.material,
  };
}

function parseRgb(value) {
  const m = value?.match(/rgba?\(\s*(\d+)\D+(\d+)\D+(\d+)/);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  const h = value?.trim().match(/^#([0-9a-f]{6})$/i);
  return h ? [0, 2, 4].map((i) => parseInt(h[1].slice(i, i + 2), 16)) : null;
}

// A puff of gas: three or four overlapping soft lobes on one feathered body, so
// its edge is a little uneven, the way exhaust is, with no grain and no hard
// rim. Densest in the middle, nothing at the edge.
export function makePuffSprite(S, [r, g, b], seed) {
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = S;
  const ctx = sprite.getContext('2d');
  const rnd = lcg(seed * 131 + 7);
  const c = S / 2;
  const lobe = (x, y, radius, alpha) => {
    const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
    // a Gaussian-like falloff: no core edge and no rim, so a puff never reads as a dot
    for (const [at, k] of [[0, 1], [0.2, 0.86], [0.4, 0.58], [0.6, 0.3], [0.8, 0.1], [1, 0]]) {
      grad.addColorStop(at, `rgba(${r},${g},${b},${alpha * k})`);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, S, S);
  };
  lobe(c, c, c * 0.95, 0.6);
  const n = 3 + ((rnd() * 2) | 0);
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2;
    const d = c * (0.18 + rnd() * 0.18);
    lobe(c + Math.cos(a) * d, c + Math.sin(a) * d, c * (0.42 + rnd() * 0.16), 0.35);
  }
  return sprite;
}

export function initPointerRide({ smoke }) {
  const sctx = smoke?.getContext('2d') ?? null;
  if (!sctx) return () => {};
  const media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const listeners = new AbortController();
  const root = getComputedStyle(document.documentElement);
  // One grey: graphite. --dust-alpha is the ceiling for anything airborne;
  // graphite's own alpha is not stacked on top of it.
  const graphite = parseRgb(root.getPropertyValue('--graphite')) || [58, 55, 46];
  const dustAlpha = parseFloat(root.getPropertyValue('--dust-alpha')) || 0.22;
  const ride = createRide();
  const rnd = lcg(2026);
  let sprites = null;
  let particles = [];
  let smokeFrame = 0;
  let width = 0, height = 0, ratio = 0, lastScrollAt = -Infinity;

  // The bike stops: no more emission. Gas already in the air finishes on its own.
  function stopRiding() {
    ride.last = null;
    ride.gesture = { duration: 0, distance: 0 };
    ride.burstStarted = -Infinity;
    ride.gasCarry = 0;
  }

  // The air is cleared: only when the page hides, the layer is switched off, or the canvas is rebuilt.
  function clearSmoke() {
    stopRiding();
    if (smokeFrame) cancelAnimationFrame(smokeFrame);
    smokeFrame = 0;
    particles = [];
    sctx.clearRect(0, 0, width, height);
  }

  function resize() {
    clearSmoke();
    if (!media.matches) {
      // Gate closed (touch, reduced motion): keep the layer empty and unbuilt.
      sprites = null;
      ratio = 0;
      smoke.width = smoke.height = 0;
      return;
    }
    width = innerWidth;
    height = innerHeight;
    // Cap both density and total pixel area on large / high-DPI displays; quantised
    // so a window drag above the area cap does not rebake on every event.
    const next = Math.round(Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(4000000 / (width * height))) * 20) / 20;
    if (next !== ratio || !sprites) {
      ratio = next;
      const S = Math.round(GAS.bake * ratio);
      sprites = Array.from({ length: GAS.variants }, (_, i) => makePuffSprite(S, graphite, i + 1));
    }
    smoke.width = Math.round(width * ratio);
    smoke.height = Math.round(height * ratio);
    sctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  // Moving the window between displays changes devicePixelRatio without a resize.
  function watchDpr() {
    const query = matchMedia(`(resolution: ${devicePixelRatio}dppx)`);
    query.addEventListener('change', () => { resize(); watchDpr(); }, { once: true, signal: listeners.signal });
  }

  function emitPuff(x, y, dirx, diry, step, { burst = false, born }) {
    if (particles.length >= MAX_PUFFS) particles.shift();
    if (!burst) {
      // born a little off the owed point, along and across the path, and pushed
      // back within a fan, so the trail is a wisp and never a row of beads
      const along = (rnd() - 0.5) * 2 * GAS.scatter[0];
      const across = (rnd() - 0.5) * 2 * GAS.scatter[1];
      x += dirx * along - diry * across;
      y += diry * along + dirx * across;
      const turn = (rnd() - 0.5) * 2 * GAS.fan;
      const c = Math.cos(turn), sn = Math.sin(turn);
      [dirx, diry] = [dirx * c - diry * sn, dirx * sn + diry * c];
    }
    const life = burst
      ? Math.min(lerp(GAS.burstLife, rnd()), ride.burstStarted + BURST_CLEAR - born)
      : lerp(GAS.life, rnd());
    if (life <= 0) return;
    particles.push({
      x, y,
      bx: -dirx, by: -diry,   // pushed back along the path
      lx: -diry, ly: dirx,    // the sway runs across it
      phase: rnd() * Math.PI * 2,
      spin: (rnd() - 0.5) * 0.6, // rad over its life: a puff turns a little as it drifts
      angle: rnd() * Math.PI * 2,
      variant: (rnd() * GAS.variants) | 0,
      from: lerp(GAS.born, rnd()),
      to: lerp(burst ? GAS.burstGrown : GAS.grown, rnd()),
      material: step.material,
      life, born, burst,
    });
  }

  function paintSmoke(now) {
    smokeFrame = 0;
    sctx.clearRect(0, 0, width, height);
    particles = particles.filter((p) => now - p.born < p.life);
    if (sprites) {
      for (const p of particles) {
        const age = now - p.born;
        if (age < 0) continue; // a staggered bloom birth still to come
        const u = age / p.life;
        const t = age / 1000;
        const back = GAS.kick * (1 - Math.exp(-GAS.drag * t)) / GAS.drag;
        const sway = GAS.curl * Math.sin(1.1 * t + p.phase);
        const x = p.x + p.bx * back + p.lx * sway;
        const y = p.y + p.by * back + p.ly * sway - GAS.buoyancy * t;
        // Gas swells fast at first, then slowly: ease-out from its birth size.
        const s = p.from + (p.to - p.from) * (1 - (1 - u) ** 2);
        const arrive = Math.min(1, age / GAS.arrive);
        const thin = u <= GAS.hold ? 1 : (1 - (u - GAS.hold) / (1 - GAS.hold)) ** GAS.leave;
        const a = dustAlpha * GAS.peak * arrive * thin * (1 - p.material * (1 - GAS.glass));
        if (a < 0.003) continue;
        sctx.save();
        sctx.translate(x, y);
        sctx.rotate(p.angle + p.spin * u);
        sctx.globalAlpha = a;
        sctx.drawImage(sprites[p.variant] ?? sprites[0], -s / 2, -s / 2, s, s);
        sctx.restore();
      }
    }
    if (particles.length) smokeFrame = requestAnimationFrame(paintSmoke);
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
    if (!step || !sprites) return;
    let emitted = false;
    for (const p of step.puffs) {
      emitPuff(p.x, p.y, step.nx, step.ny, step, { born: now });
      emitted = true;
    }
    if (step.bloom || step.burstPuffs) {
      const alive = particles.reduce((n, m) => n + (m.burst ? 1 : 0), 0);
      const room = Math.max(0, GAS.burstAlive - alive);
      const seat = step.seat ?? step.pipe;
      const spread = step.bloom ? GAS.burstSpread : GAS.burstClockSpread;
      const count = Math.min(room, step.bloom || step.burstPuffs);
      // The bloom is staggered; the clock's puffs are spaced across their tick.
      const stagger = step.bloom ? GAS.bloomStagger : GAS.burstRate / GAS.burstPer;
      for (let i = 0; i < count; i++) {
        const a = rnd() * Math.PI * 2;
        emitPuff(
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

  const options = { passive: true, signal: listeners.signal };
  window.addEventListener('pointermove', move, options);
  window.addEventListener('pointerdown', stopRiding, options); // a click stops the bike; the air finishes
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
  }, options);
  document.documentElement.addEventListener('pointerleave', stopRiding, options);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearSmoke(); }, options);
  media.addEventListener('change', resize, { signal: listeners.signal }); // opens or closes the gate
  resize();
  watchDpr();
  // Dev-only peek for the verification harness; stripped from production builds.
  if (import.meta.env?.DEV) {
    window.__pointerRide = {
      peek: () => ({ ratio, sprites: !!sprites, particles: particles.length, width, height, gate: media.matches, ride: { last: !!ride.last, speed: ride.speed } }),
    };
  }
  return () => {
    clearSmoke();
    listeners.abort();
  };
}
