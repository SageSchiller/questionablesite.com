// questionablesite :: the Sign.
//
// Canvas rather than SVG because CSS animation is too well behaved. The
// whole effect depends on motion that is subtly wrong: rings turning at
// ratios that never resolve, a triangle that is never quite equilateral,
// a pupil that follows you, and rare events short enough that you are not
// certain you saw them.
//
// Nothing here is random-looking noise for its own sake. Every irregularity
// is meant to read as intent.

(function () {
  "use strict";

  const canvas = document.getElementById("sign");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SIZE = 220;
  const CX = SIZE / 2;
  const CY = SIZE / 2;

  const EMBER = "208, 165, 47";
  const SIGN  = "232, 209, 90";
  const BLOOD = "141, 32, 32";
  const ASH   = "203, 197, 185";

  const GLYPHS = "◇◆○●△▲▽▼□■◈✦✧⌘⬡⬢⊕⊗⊙⌾∴∵≡⋈⌇";
  const RING_N = 13;

  let ring = [];
  for (let i = 0; i < RING_N; i++) ring.push(GLYPHS[(Math.random() * GLYPHS.length) | 0]);

  // Rotations are accumulated rather than derived from time, so a direction
  // reversal does not snap the figure to a new position.
  let rot = [0, 0, 0, 0];
  let dir = 1;

  let pointer = { x: 0, y: 0 };
  let pupil = { x: 0, y: 0 };
  let pupilBias = { x: 0, y: 0 };

  let stallUntil = 0;
  let nextEventAt = 0;
  let ev = null;

  function dpr() { return Math.min(window.devicePixelRatio || 1, 2); }

  function resize() {
    const d = dpr();
    canvas.width = SIZE * d;
    canvas.height = SIZE * d;
    canvas.style.width = SIZE + "px";
    canvas.style.height = SIZE + "px";
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  window.addEventListener("pointermove", (e) => {
    const r = canvas.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    // Normalised, clamped: it looks toward you, not wildly around.
    pointer.x = Math.max(-1, Math.min(1, (e.clientX - cx) / 260));
    pointer.y = Math.max(-1, Math.min(1, (e.clientY - cy) / 260));
  }, { passive: true });

  /* ---------------- rare events ---------------- */

  function scheduleEvent(now) {
    const marked = document.body.classList.contains("marked");
    // Once it has your count it does this more often.
    const base = marked ? 3800 : 6500;
    const spread = marked ? 7000 : 13000;
    nextEventAt = now + base + Math.random() * spread;
  }

  function fireEvent(now) {
    const marked = document.body.classList.contains("marked");
    const pool = ["blink", "saccade", "reverse", "stall", "flash", "past"];
    if (marked) pool.push("twin", "blink", "past");

    const type = pool[(Math.random() * pool.length) | 0];

    if (type === "blink") {
      ev = { type, until: now + 130 };
    } else if (type === "saccade") {
      const a = Math.random() * Math.PI * 2;
      ev = { type, until: now + 220, bx: Math.cos(a) * 0.9, by: Math.sin(a) * 0.9 };
    } else if (type === "reverse") {
      dir = -dir;
      ev = null;
    } else if (type === "stall") {
      stallUntil = now + 420 + Math.random() * 700;
      ev = null;
    } else if (type === "flash") {
      ev = { type, until: now + 55 };
    } else if (type === "past") {
      // It focuses on something a little behind you.
      ev = { type, until: now + 900 + Math.random() * 900,
             bx: (Math.random() - 0.5) * 1.4, by: (Math.random() - 0.5) * 1.4 };
    } else if (type === "twin") {
      const a = Math.random() * Math.PI * 2;
      const r = 30 + Math.random() * 55;
      ev = { type, until: now + 260, tx: Math.cos(a) * r, ty: Math.sin(a) * r };
    }

    scheduleEvent(now);
  }

  /* ---------------- drawing helpers ---------------- */

  function ringPath(r, squash, from, to) {
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) {
      const a = from + (to - from) * (i / 64);
      const x = CX + Math.cos(a) * r;
      const y = CY + Math.sin(a) * r * squash;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.stroke();
  }

  // Three vertices that drift independently, so the triangle is never quite
  // equilateral and never settles into one.
  function wrongTriangle(t, r, phase, colour, alpha) {
    ctx.strokeStyle = `rgba(${colour}, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const base = phase + (i * Math.PI * 2) / 3;
      const wobble = Math.sin(t * 0.00031 + i * 2.1) * 0.13
                   + Math.sin(t * 0.00017 + i * 4.7) * 0.07;
      const rr = r * (1 + Math.sin(t * 0.00023 + i * 1.7) * 0.09);
      const a = base + wobble;
      const x = CX + Math.cos(a) * rr;
      const y = CY + Math.sin(a) * rr;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  /* ---------------- frame ---------------- */

  let last = performance.now();

  function frame(now) {
    const dt = Math.min(64, now - last);
    last = now;

    const thinking = document.body.classList.contains("thinking");
    const marked = document.body.classList.contains("marked");

    if (!reduced) {
      if (now > nextEventAt) fireEvent(now);
      if (ev && now > ev.until) ev = null;

      const stalled = now < stallUntil;
      const speed = thinking ? 5.2 : 1;
      if (!stalled) {
        // Incommensurate ratios: the figure never returns to a pose it has
        // already held.
        rot[0] += dt * 0.000045 * dir * speed;
        rot[1] -= dt * 0.000071 * dir * speed;
        rot[2] += dt * 0.000029 * dir * speed;
        rot[3] -= dt * 0.000113 * dir * speed;
      }
    }

    // Irregular breathing. Layered periods that do not divide evenly, so it
    // never settles into a rhythm you can anticipate.
    const t = reduced ? 9000 : now;
    const breath =
      Math.sin(t * 0.00042) * 0.5 +
      Math.sin(t * 0.00071 + 1.3) * 0.3 +
      Math.sin(t * 0.00019 + 2.7) * 0.2;

    // Pupil target: you, unless it is currently looking past you.
    let tx = pointer.x, ty = pointer.y;
    if (ev && (ev.type === "saccade" || ev.type === "past")) { tx = ev.bx; ty = ev.by; }
    if (thinking) { tx = 0; ty = 0; }          // during a question it fixes on you
    const ease = thinking ? 0.14 : (ev && ev.type === "saccade" ? 0.5 : 0.045);
    pupil.x += (tx - pupil.x) * ease;
    pupil.y += (ty - pupil.y) * ease;

    // Blink squashes the whole figure vertically for a few frames.
    let lid = 1;
    if (ev && ev.type === "blink") {
      const p = 1 - (ev.until - now) / 130;
      lid = Math.abs(Math.cos(p * Math.PI));
      lid = Math.max(0.04, lid);
    }

    const boost = (ev && ev.type === "flash") ? 2.4 : 1;
    const wake = marked ? 1.28 : 1;

    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.translate(CX, CY);
    ctx.scale(1, lid);
    ctx.translate(-CX, -CY);

    // --- outer glyph ring, tilted so the far side reads as behind ---
    const SQUASH = 0.42;
    ctx.font = "11px ui-monospace, Menlo, Consolas, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < RING_N; i++) {
      const a = rot[0] + (i * Math.PI * 2) / RING_N;
      const depth = Math.sin(a);
      const x = CX + Math.cos(a) * 96;
      const y = CY + depth * 96 * SQUASH;
      const front = depth * 0.5 + 0.5;
      const alpha = (0.10 + front * 0.62) * boost * wake;

      // Glyphs are only ever replaced while they are at the back, so you
      // never catch one changing, only notice later that it has.
      if (!reduced && depth < -0.55 && Math.random() < 0.006) {
        ring[i] = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }

      ctx.fillStyle = `rgba(${i === 0 ? SIGN : EMBER}, ${alpha})`;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(0.7 + front * 0.5, 0.7 + front * 0.5);
      ctx.fillText(ring[i], 0, 0);
      ctx.restore();
    }

    // --- rings ---
    ctx.strokeStyle = `rgba(${EMBER}, ${0.16 * boost * wake})`;
    ctx.lineWidth = 1;
    ringPath(88, SQUASH, 0, Math.PI * 2);

    ctx.strokeStyle = `rgba(${ASH}, ${0.14 * boost})`;
    ringPath(74, 1, rot[1], rot[1] + Math.PI * 1.35);

    ctx.strokeStyle = `rgba(${EMBER}, ${0.3 * boost * wake})`;
    ringPath(66, 1, rot[2] + Math.PI, rot[2] + Math.PI * 1.7);

    // --- ticks ---
    ctx.strokeStyle = `rgba(${ASH}, ${0.2 * boost})`;
    for (let i = 0; i < 36; i++) {
      const a = rot[3] + (i * Math.PI * 2) / 36;
      const inner = i % 3 === 0 ? 52 : 56;
      ctx.beginPath();
      ctx.moveTo(CX + Math.cos(a) * inner, CY + Math.sin(a) * inner);
      ctx.lineTo(CX + Math.cos(a) * 59, CY + Math.sin(a) * 59);
      ctx.stroke();
    }

    // --- the two wrong triangles ---
    wrongTriangle(t, 54, -Math.PI / 2 + rot[2] * 0.5, BLOOD, 0.5 * boost);
    wrongTriangle(t, 44, Math.PI / 2 - rot[1] * 0.4, EMBER, 0.34 * boost * wake);

    // --- iris ---
    const irisR = 22 + breath * 2.4 + (thinking ? 5 : 0);
    ctx.strokeStyle = `rgba(${SIGN}, ${(0.5 + breath * 0.18) * boost * wake})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(CX, CY, irisR, 0, Math.PI * 2);
    ctx.stroke();

    // --- pupil ---
    const dilate = thinking ? 1.55 : 1 + breath * 0.16;
    const pr = (marked ? 7.4 : 6.2) * dilate;
    const px = CX + pupil.x * 11;
    const py = CY + pupil.y * 11;

    const g = ctx.createRadialGradient(px, py, 0, px, py, pr * 2.6);
    g.addColorStop(0, `rgba(${SIGN}, ${0.95 * boost})`);
    g.addColorStop(0.45, `rgba(${EMBER}, ${0.5 * boost})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(px, py, pr * 2.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(${SIGN}, ${0.95 * boost})`;
    ctx.beginPath();
    ctx.arc(px, py, pr * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // --- the second pupil, when there is one ---
    if (ev && ev.type === "twin") {
      const a = (ev.until - now) / 260;
      ctx.fillStyle = `rgba(${SIGN}, ${0.75 * a})`;
      ctx.beginPath();
      ctx.arc(CX + ev.tx, CY + ev.ty, 3.4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    if (!reduced) requestAnimationFrame(frame);
  }

  if (reduced) {
    frame(performance.now());
  } else {
    scheduleEvent(performance.now());
    requestAnimationFrame(frame);
    // Stop burning frames when nobody is looking.
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) { last = performance.now(); requestAnimationFrame(frame); }
    });
  }
})();
