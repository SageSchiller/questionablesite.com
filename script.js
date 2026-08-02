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
          // The true-name reveal owns the text while it runs. Corrupting
          // here would overwrite it, and restoring afterwards would snap it
          // back to "questionablesite" mid-reveal.
          if (el.dataset.locked) { tick(); return; }
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

  /* ---------- the true name ---------- */
  // TSEQUA TENEBIOLIS is an exact anagram of "questionablesite": every
  // letter, no additions, nothing left over. The title occasionally
  // rearranges itself into it and then back.
  //
  // This shares the title with initCorrupt, which caches the original text
  // and restores it after each flicker. Without the dataset.locked handshake
  // the two overwrite each other and the reveal snaps back mid-scramble.

  const TRUE_NAME = "TSEQUA TENEBIOLIS";

  function scrambleTo(el, target, dur, done) {
    const GL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+=?<>/\\";
    const settle = [];
    for (let i = 0; i < target.length; i++) {
      // Characters land in a scattered order rather than left to right.
      settle.push(dur * 0.3 + Math.random() * dur * 0.7);
    }
    const t0 = performance.now();
    (function frame(now) {
      const t = now - t0;
      let out = "";
      for (let i = 0; i < target.length; i++) {
        const c = target[i];
        if (c === " ") { out += " "; continue; }
        out += (t >= settle[i]) ? c : GL[(Math.random() * GL.length) | 0];
      }
      el.textContent = out;
      if (t < dur) requestAnimationFrame(frame);
      else { el.textContent = target; if (done) done(); }
    })(t0);
  }

  function initTrueName() {
    const el = document.querySelector(".ask-title");
    if (!el) return;
    const home = el.textContent;
    if (reduced) return;

    let busy = false;

    function reveal() {
      if (busy) return;
      busy = true;
      el.dataset.locked = "1";
      scrambleTo(el, TRUE_NAME, 640, () => {
        el.classList.add("truename");
        setTimeout(() => {
          el.classList.remove("truename");
          scrambleTo(el, home, 520, () => {
            delete el.dataset.locked;
            busy = false;
          });
        }, 2300);
      });
    }

    const sign = document.getElementById("sign");
    if (sign) sign.addEventListener("click", reveal);

    const form = document.getElementById("ask-form");
    if (form) form.addEventListener("submit", () => setTimeout(reveal, 500));

    // And occasionally with no prompting at all.
    (function idle() {
      setTimeout(() => {
        if (!document.hidden && Math.random() < 0.5) reveal();
        idle();
      }, 45000 + Math.random() * 55000);
    })();
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

      // The question picks a bucket by its grammatical form and is then
      // discarded. Nothing from it reaches the answer.
      const reading = makeReading(q);
      askCount(true);

      const steps = buildRitual();

      let i = 0;
      const runStep = () => {
        if (i >= steps.length) {
          setTimeout(deliver, reduced ? 0 : 420 + Math.random() * 520);
          return;
        }
        const line = document.createElement("div");
        line.className = isOminous(steps[i]) ? "bad" : (i === steps.length - 1 ? "hit" : "");
        line.textContent = "  " + steps[i];
        ritual.appendChild(line);
        i++;
        // Uneven pacing: it occasionally takes noticeably longer over a step.
        const pause = Math.random() < 0.14
          ? 900 + Math.random() * 900
          : 190 + Math.random() * 400;
        setTimeout(runStep, reduced ? 0 : pause);
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
          ["sign", reading.glyph, "glyphs"],
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

        const n = askCount(false);
        if (tally) tally.textContent = tallyLine(n);

        // It has been seen. It says so, once, and then never again.
        const seen = document.getElementById("seen");
        if (seen && !seen.classList.contains("on")) {
          setTimeout(() => seen.classList.add("on"), 2200);
        }

        // The hunger surfaces from the second question onward and gets
        // less subtle the longer you stay.
        const hunger = document.getElementById("hunger");
        if (hunger && n >= 2) {
          const line = isMarked(n) && Math.random() < 0.45 ? pick(MARKED) : pick(HUNGER);
          hunger.innerHTML = "";
          const p = document.createElement("div");
          p.textContent = line;
          hunger.appendChild(p);
          if (isMarked(n)) {
            const b = document.createElement("div");
            b.style.marginTop = "12px";
            b.innerHTML = 'It spreads by being asked. <b><a href="propagation.html">This has been documented.</a></b>';
            hunger.appendChild(b);
          }
          setTimeout(() => hunger.classList.add("on"), 2600);
        }

        if (isMarked(n)) document.body.classList.add("marked");

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

  function renderArchive(feed) {
    feed.innerHTML = "";

    // Draw without replacement so one screen never shows the same question
    // twice.
    const bag = ARCHIVE_QUESTIONS.slice();
    // The narrow pools are small enough that fourteen draws would otherwise
    // repeat an answer on the same screen, which reads as a bug.
    const usedAnswers = new Set();

    for (let i = 0; i < 14; i++) {
      if (!bag.length) bag.push.apply(bag, ARCHIVE_QUESTIONS);
      const question = bag.splice(Math.floor(Math.random() * bag.length), 1)[0];

      // Routing uses the whole question, so the answer matches the form even
      // while most of the question is still hidden.
      let r = makeReading(question);
      for (let t = 0; t < 10 && usedAnswers.has(r.answer); t++) r = makeReading(question);
      usedAnswers.add(r.answer);

      const words = question.split(" ");
      const shown = words.slice(0, 2).join(" ");
      const hidden = words.slice(2).join(" ");

      const e = document.createElement("div");
      e.className = "entry";

      const q = document.createElement("div");
      q.className = "q";
      q.textContent = "> " + shown + " ";

      // The redaction gives way if you push at it, and what comes back is a
      // whole sentence rather than a fragment.
      const red = document.createElement("span");
      red.className = "redact";
      red.setAttribute("role", "button");
      red.setAttribute("tabindex", "0");
      red.title = "recover";
      red.textContent = "█".repeat(Math.max(6, hidden.length));
      const reveal = () => {
        if (red.classList.contains("open")) return;
        red.classList.add("open");
        red.textContent = hidden;
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

  /* ---------- carry it ---------- */
  // The one thing the site actively asks of you. It copies a link. That is
  // the entire mechanism, and the framing does the rest of the work.

  function initCarry() {
    const btn = document.getElementById("carry");
    if (!btn) return;
    const out = document.getElementById("carry-out");

    // Pinned, not derived from location. Cloudflare Pages keeps the
    // *.pages.dev hostname live alongside the custom domain, and anyone
    // who arrived on that one would otherwise copy and propagate it.
    // Localhost would do the same during testing.
    const url = CANONICAL;

    let carried = 0;

    btn.addEventListener("click", async () => {
      carried++;
      let ok = false;

      // Async clipboard first. It needs a secure context and a trusted
      // gesture, and quietly refuses in plenty of ordinary situations.
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(url);
          ok = true;
        }
      } catch (e) { ok = false; }

      // Legacy path for everywhere the above declines.
      if (!ok) {
        try {
          const ta = document.createElement("textarea");
          ta.value = url;
          ta.setAttribute("readonly", "");
          ta.style.cssText = "position:fixed;top:-1000px;opacity:0;";
          document.body.appendChild(ta);
          ta.select();
          ok = document.execCommand("copy");
          ta.remove();
        } catch (e) { ok = false; }
      }

      if (!ok) {
        out.innerHTML = "The clipboard refused. Carry it manually: <b>" +
          url.replace(/[&<>]/g, "") + "</b>";
        return;
      }

      if (carried === 1) {
        out.innerHTML = "Copied. It is on you now, in the small way that a link is on you. <b>Give it to someone.</b>";
      } else if (carried === 2) {
        out.innerHTML = "Copied again. It does not mind repetition. It has no mechanism for minding.";
      } else {
        out.innerHTML = "Copied " + carried + " times. <b>You are helping.</b> Nobody has established with what.";
      }
    });
  }

  /* ---------- persistent mark ---------- */

  function initMark() {
    if (typeof isMarked !== "function") return;
    if (isMarked(askCount(false))) document.body.classList.add("marked");
  }

  document.addEventListener("DOMContentLoaded", () => {
    initGrain();
    initCorrupt();
    initTrueName();
    initMark();
    initAsk();
    initArchive();
    initInterrogate();
    initCanary();
    initCarry();
  });
})();
