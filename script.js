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

  const ASKED = [
    "should i", "is it too late to", "was it my fault that", "how do i tell them",
    "what happens if i", "why does it keep", "am i the only one who",
    "is there a way to", "how long until", "did i imagine", "should i have said",
    "what do i do about", "can it still be", "is it normal that",
  ];

  function renderArchive(feed) {
    feed.innerHTML = "";
    for (let i = 0; i < 14; i++) {
      const r = makeReading();
      const e = document.createElement("div");
      e.className = "entry";

      const q = document.createElement("div");
      q.className = "q";
      q.textContent = "> " + pick(ASKED) + " ";

      // The redaction gives way if you push at it. What is underneath is
      // worse than the block was.
      const red = document.createElement("span");
      red.className = "redact";
      red.setAttribute("role", "button");
      red.setAttribute("tabindex", "0");
      red.title = "recover";
      red.textContent = "█".repeat(6 + Math.floor(Math.random() * 22));
      const reveal = () => {
        if (red.classList.contains("open")) return;
        red.classList.add("open");
        red.textContent = pick(FRAGMENTS);
        red.removeAttribute("role");
        red.removeAttribute("tabindex");
        red.title = "";
      };
      red.addEventListener("click", reveal);
      red.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); reveal(); }
      });
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

  function initArchive() {
    const feed = document.getElementById("feed");
    if (!feed) return;
    renderArchive(feed);

    const btn = document.getElementById("redraw");
    const note = document.getElementById("redraw-note");
    if (!btn) return;

    let draws = 0;
    btn.addEventListener("click", () => {
      draws++;
      feed.style.opacity = "0";
      setTimeout(() => {
        renderArchive(feed);
        feed.style.opacity = "1";
        if (note) {
          if (draws === 1) note.textContent = "fourteen different entries. the archive has not changed.";
          else if (draws < 4) note.textContent = "fourteen again. it is always fourteen.";
          else if (draws < 8) note.textContent = "you are looking for the fifteenth. there is no fifteenth.";
          else note.textContent = "you have drawn " + draws + " times. it is drawing too.";
        }
      }, reduced ? 0 : 320);
    });
  }

  /* ---------- provenance: interrogate it about itself ---------- */
  // The page claims it has been asked directly eleven times and gave eleven
  // different answers. The button has to actually deliver that, so origins
  // are drawn without replacement until the pool is exhausted.

  function initInterrogate() {
    const btn = document.getElementById("interrogate");
    if (!btn) return;
    const out = document.getElementById("interrogate-out");
    const count = document.getElementById("interrogate-count");

    let pool = ORIGINS.slice();
    let asked = 0;
    let busy = false;

    btn.addEventListener("click", () => {
      if (busy) return;
      busy = true;
      asked++;
      btn.disabled = true;
      document.body.classList.add("thinking");

      out.innerHTML = "";
      const thinking = document.createElement("div");
      thinking.className = "dim";
      thinking.textContent = "  putting the question to it";
      out.appendChild(thinking);

      let dots = 0;
      const tick = setInterval(() => {
        dots = (dots + 1) % 4;
        thinking.textContent = "  putting the question to it" + ".".repeat(dots);
      }, 260);

      setTimeout(() => {
        clearInterval(tick);
        document.body.classList.remove("thinking");
        out.innerHTML = "";

        if (!pool.length) pool = ORIGINS.slice();
        const idx = Math.floor(Math.random() * pool.length);
        const claim = pool.splice(idx, 1)[0];

        const line = document.createElement("div");
        line.className = "claim";
        line.textContent = claim;
        out.appendChild(line);

        const stamp = document.createElement("div");
        stamp.className = "foot";
        stamp.textContent = `response ${asked}  ·  ${pick(CERTAINTY)[0]}  ·  ${glyphRun(3)}`;
        out.appendChild(stamp);

        if (count) {
          if (asked < 11) {
            count.textContent = `asked ${asked} time${asked === 1 ? "" : "s"}. ${asked} different answer${asked === 1 ? "" : "s"}. none of them contradict each other.`;
          } else if (asked === 11) {
            count.textContent = "eleven. this is where the record stops. the record was written before you got here.";
          } else {
            count.textContent = `asked ${asked} times. you are past the record now. it has not repeated itself.`;
          }
        }

        busy = false;
        btn.disabled = false;
      }, reduced ? 0 : 1500);
    });
  }

  /* ---------- canary: verify the signature, and the countdown ---------- */

  function initCanary() {
    const btn = document.getElementById("verify");
    const out = document.getElementById("verify-out");

    if (btn && out) {
      const LINES = [
        ['loading signature block .............. ', 'ok', 'ok'],
        ['loading public key from revision 1 ... ', 'ok', 'ok'],
        ['computing digest ..................... ', 'ok', 'ok'],
        ['comparing ............................ ', 'MISMATCH', 'no'],
        ['retrying with revision 1 key ......... ', 'MISMATCH', 'no'],
        ['retrying with current key ............ ', 'no current key published', 'no'],
        ['verifying anyway ..................... ', 'VALID', 'em'],
      ];

      btn.addEventListener("click", () => {
        btn.disabled = true;
        out.innerHTML = "";
        let i = 0;
        const step = () => {
          if (i >= LINES.length) {
            const concl = document.createElement("div");
            concl.style.marginTop = "14px";
            concl.innerHTML =
              '<span class="ok">The signature is valid. The key does not match.</span>\n' +
              '<span class="t">Both results are stable across repeated verification.</span>';
            out.appendChild(concl);
            btn.disabled = false;
            return;
          }
          const [label, val, cls] = LINES[i];
          const row = document.createElement("div");
          const a = document.createElement("span");
          a.textContent = label;
          const b = document.createElement("span");
          b.className = cls;
          b.textContent = val;
          row.appendChild(a); row.appendChild(b);
          out.appendChild(row);
          i++;
          setTimeout(step, reduced ? 0 : 260 + Math.random() * 260);
        };
        step();
      });
    }

    // Countdown to the first of the next month, when revision 10 is due.
    const clock = document.getElementById("countdown");
    if (!clock) return;
    const tick = () => {
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
      let s = Math.max(0, Math.floor((next - now) / 1000));
      const d = Math.floor(s / 86400); s -= d * 86400;
      const h = Math.floor(s / 3600);  s -= h * 3600;
      const m = Math.floor(s / 60);    s -= m * 60;
      const p = (n) => String(n).padStart(2, "0");
      clock.textContent = `${d}d ${p(h)}:${p(m)}:${p(s)}`;
    };
    tick();
    setInterval(tick, 1000);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initGrain();
    initCorrupt();
    initAsk();
    initArchive();
    initInterrogate();
    initCanary();
  });
})();
