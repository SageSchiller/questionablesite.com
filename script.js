// questionablesite :: presentation only. No network calls, no analytics.

(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- film grain ---------- */

  function initGrain() {
    if (reduced) return;
    const c = document.createElement("canvas");
    c.id = "grain";
    document.body.appendChild(c);
    const ctx = c.getContext("2d", { alpha: true });

    // Render a handful of noise tiles once, then cycle them. Regenerating
    // every frame is pure heat for no visible gain.
    const TILE = 140;
    const frames = [];
    for (let f = 0; f < 5; f++) {
      const off = document.createElement("canvas");
      off.width = off.height = TILE;
      const octx = off.getContext("2d");
      const img = octx.createImageData(TILE, TILE);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      octx.putImageData(img, 0, 0);
      frames.push(off);
    }

    let idx = 0;
    let last = 0;

    function size() {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      ctx.imageSmoothingEnabled = false;
    }
    size();
    window.addEventListener("resize", size);

    function draw(now) {
      // ~14fps: grain should shimmer, not strobe.
      if (now - last > 70) {
        last = now;
        idx = (idx + 1) % frames.length;
        const p = ctx.createPattern(frames[idx], "repeat");
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.fillStyle = p;
        ctx.fillRect(0, 0, c.width, c.height);
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ---------- occasional character corruption ---------- */
  // Headings flicker a single glyph now and then, as if the page is being
  // rendered by something with an intermittent fault.

  function initCorrupt() {
    if (reduced) return;
    const marks = "▓▒░#@%&$?!¤§";
    const targets = document.querySelectorAll("[data-corrupt]");
    if (!targets.length) return;

    targets.forEach((el) => {
      const original = el.textContent;
      if (original.trim().length < 3) return;

      const tick = () => {
        const wait = 2600 + Math.random() * 7000;
        setTimeout(() => {
          const chars = original.split("");
          const hits = 1 + Math.floor(Math.random() * 2);
          for (let h = 0; h < hits; h++) {
            let i = Math.floor(Math.random() * chars.length);
            let guard = 0;
            while (chars[i] === " " && guard++ < 8) i = Math.floor(Math.random() * chars.length);
            chars[i] = marks[Math.floor(Math.random() * marks.length)];
          }
          el.textContent = chars.join("");
          setTimeout(() => { el.textContent = original; tick(); }, 70 + Math.random() * 120);
        }, wait);
      };
      tick();
    });
  }

  /* ---------- the ask ---------- */

  function initAsk() {
    const form = document.getElementById("ask-form");
    if (!form) return;

    const input = document.getElementById("ask-input");
    const btn = document.getElementById("ask-btn");
    const ritual = document.getElementById("ritual");
    const block = document.getElementById("answer-block");
    const answerEl = document.getElementById("answer");
    const metaEl = document.getElementById("meta");
    const againBtn = document.getElementById("again");
    const tally = document.getElementById("tally");

    if (tally) tally.textContent = tallyLine(askCount(false));

    let busy = false;

    function reset() {
      block.classList.remove("on");
      ritual.classList.remove("on");
      ritual.innerHTML = "";
      answerEl.innerHTML = "";
      metaEl.innerHTML = "";
      input.value = "";
      input.focus();
    }

    if (againBtn) againBtn.addEventListener("click", reset);

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (busy) return;

      const q = input.value.trim();
      if (!q) {
        input.placeholder = "it will not answer nothing.";
        input.focus();
        return;
      }

      busy = true;
      btn.disabled = true;
      block.classList.remove("on");
      answerEl.innerHTML = "";
      metaEl.innerHTML = "";
      ritual.innerHTML = "";
      ritual.classList.add("on");
      document.body.classList.add("thinking");

      const reading = makeReading();
      askCount(true);

      // Walk a random subset of the ritual lines, always ending on the last.
      const steps = RITUAL.filter((_, i) =>
        i === 0 || i === RITUAL.length - 1 || Math.random() < 0.45
      );

      let i = 0;
      const runStep = () => {
        if (i >= steps.length) { setTimeout(deliver, 620); return; }
        const line = document.createElement("div");
        const odd = steps[i].indexOf("declines") > -1 || steps[i].indexOf("unable") > -1;
        line.className = odd ? "bad" : (i === steps.length - 1 ? "hit" : "");
        line.textContent = "  " + steps[i];
        ritual.appendChild(line);
        i++;
        setTimeout(runStep, reduced ? 0 : 260 + Math.random() * 340);
      };

      function deliver() {
        document.body.classList.remove("thinking");
        block.classList.add("on");

        const caret = '<span class="caret"></span>';
        const text = reading.answer;

        if (reduced) {
          answerEl.textContent = text;
        } else {
          let n = 0;
          const type = () => {
            n++;
            answerEl.innerHTML = escapeHtml(text.slice(0, n)) + (n < text.length ? caret : "");
            if (n < text.length) setTimeout(type, 22 + Math.random() * 26);
          };
          type();
        }

        const rows = [
          ["certainty", reading.certainty, reading.certaintyClass],
          ["consulted", reading.consulted, ""],
          ["latency", reading.latency, ""],
          ["depth", reading.depth, ""],
          ["sign", reading.glyph, "ember"],
        ];
        metaEl.innerHTML = "";
        rows.forEach(([k, v, cls]) => {
          const d = document.createElement("div");
          const kk = document.createElement("div");
          kk.className = "k";
          kk.textContent = k;
          const vv = document.createElement("div");
          vv.className = "v" + (cls ? " " + cls : "");
          vv.textContent = v;
          d.appendChild(kk); d.appendChild(vv);
          metaEl.appendChild(d);
        });

        if (tally) tally.textContent = tallyLine(askCount(false));
        busy = false;
        btn.disabled = false;
      }

      runStep();
    });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
  }

  /* ---------- archive feed ---------- */
  // Fabricated on load from the same corpus, so the page is never twice the
  // same and always looks like it has been running without us.

  function initArchive() {
    const feed = document.getElementById("feed");
    if (!feed) return;

    const asked = [
      "should i", "is it too late to", "was it my fault that", "how do i tell them",
      "what happens if i", "why does it keep", "am i the only one who",
      "is there a way to", "how long until", "did i imagine", "should i have said",
      "what do i do about", "can it still be", "is it normal that",
    ];

    for (let i = 0; i < 14; i++) {
      const r = makeReading();
      const e = document.createElement("div");
      e.className = "entry";

      const q = document.createElement("div");
      q.className = "q";
      q.textContent = "> " + pick(asked) + " ";
      const red = document.createElement("span");
      red.className = "redact";
      red.textContent = "█".repeat(6 + Math.floor(Math.random() * 22));
      q.appendChild(red);

      const a = document.createElement("div");
      a.className = "a";
      a.textContent = r.answer;

      const f = document.createElement("div");
      f.className = "foot";
      const days = Math.floor(Math.random() * 900) + 1;
      f.textContent = `${days} days ago  ·  ${r.certainty}  ·  consulted ${r.consulted}  ·  ${r.glyph}`;

      e.appendChild(q); e.appendChild(a); e.appendChild(f);
      feed.appendChild(e);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initGrain();
    initCorrupt();
    initAsk();
    initArchive();
  });
})();
