/* fx.js — the small, fun layer. Concept: the site behaves like an After Effects comp.
   Everything here is decorative and switches off under prefers-reduced-motion.
   Content stays in js/projects.js; nothing here is needed for the site to work. */

(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------- Timecode helper: frames → HH:MM:SS:FF at 24 fps ---------- */
  const FPS = 24;
  window.toTimecode = function (seconds) {
    const total = Math.max(0, Math.floor(seconds * FPS));
    const ff = total % FPS;
    const s = Math.floor(total / FPS);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(ff)}`;
  };

  /* ---------- 1. Keyframe cursor ---------- */
  function keyframeCursor() {
    if (!finePointer) return;
    const cur = document.createElement("div");
    cur.id = "cur";
    cur.innerHTML = '<span class="cur-shape"></span>';
    document.body.appendChild(cur);
    document.documentElement.classList.add("has-cursor");

    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, shown = false;
    window.addEventListener("mousemove", (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; cur.classList.add("is-on"); x = tx; y = ty; }
    }, { passive: true });
    document.addEventListener("mouseleave", () => cur.classList.remove("is-on"));
    document.addEventListener("mouseenter", () => shown && cur.classList.add("is-on"));

    const tick = () => {
      x += (tx - x) * 0.35; y += (ty - y) * 0.35;
      cur.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      requestAnimationFrame(tick);
    };
    tick();

    // Hover states: links → hollow "easy ease" keyframe; text fields → hide (native caret)
    const hot = "a, button, [role=button], .card-media, .portrait";
    const text = "input, textarea, select, [contenteditable]";
    document.addEventListener("mouseover", (e) => {
      const t = e.target;
      cur.classList.toggle("is-hot", !!t.closest(hot));
      cur.classList.toggle("is-hidden", !!t.closest(text));
    });
    window.addEventListener("mousedown", () => cur.classList.add("is-down"));
    window.addEventListener("mouseup", () => cur.classList.remove("is-down"));
  }

  /* ---------- 3. Text-animator entrance for headlines ----------
     Splits words (keeps <em>/<br>/spans intact) and staggers them in. */
  function splitWords(el) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
    let i = 0;
    nodes.forEach((n) => {
      const frag = document.createDocumentFragment();
      n.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(part));
        const w = document.createElement("span");
        w.className = "w";
        w.style.setProperty("--i", i++);
        w.textContent = part;
        frag.appendChild(w);
      });
      n.parentNode.replaceChild(frag, n);
    });
    el.classList.add("is-split");
  }

  function headlineEntrances() {
    $$(".intro h1, .about h1, .contact h1, .project-title").forEach((h) => {
      // fonts first, so word widths don't jump mid-animation
      document.fonts.ready.then(() => {
        splitWords(h);
        // Home headline: hover rainbow + turning plus.
        if (h.matches(".intro h1")) {
          // Hover only over the words themselves (not the empty space beside
          // them). A short grace period bridges the gaps between words.
          // The plus (.amp) turns while hovered and finishes its current
          // quarter-turn before stopping.
          const amps = $$(".amp", h);
          let wantSpin = false;

          // Pivot on the glyph's optical centre, not the text box centre.
          // The box centre sits below the "+" crossing, which made each
          // quarter-turn drift and the loop restart visibly jump.
          const ctx = document.createElement("canvas").getContext("2d");
          const calibrate = () => {
            amps.forEach((a) => {
              if (a.classList.contains("spin") || a.classList.contains("spin-once")) return; // measure at rest only
              const cs = getComputedStyle(a);
              ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
              const m = ctx.measureText("+");
              const cx = (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2;
              const cyAboveBaseline = (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
              // find the baseline inside the box with a zero-size inline probe
              const probe = document.createElement("span");
              probe.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline;";
              a.appendChild(probe);
              const baselineY = probe.getBoundingClientRect().top - a.getBoundingClientRect().top;
              probe.remove();
              // pen origin of the "+" = inner word's content-box left (layout
              // positions, so the entrance transform doesn't skew the reading)
              const inner = a.querySelector(".w");
              const penX = inner
                ? inner.offsetLeft - a.offsetLeft + parseFloat(getComputedStyle(inner).paddingLeft)
                : 0;
              a.style.transformOrigin = `${penX + cx}px ${baselineY - cyAboveBaseline}px`;
            });
          };
          calibrate();
          window.addEventListener("resize", calibrate);
          amps.forEach((a) =>
            a.addEventListener("animationiteration", () => {
              if (!wantSpin) a.classList.remove("spin");
            })
          );
          const setSpin = (on) => {
            wantSpin = on;
            if (on) amps.forEach((a) => { a.classList.remove("spin-once"); a.classList.add("spin"); });
          };

          // Idle: when not hovered, do the same half-turn once every 5 seconds.
          amps.forEach((a) => a.addEventListener("animationend", () => a.classList.remove("spin-once")));
          setInterval(() => {
            if (wantSpin) return;
            amps.forEach((a) => {
              if (a.classList.contains("spin") || a.classList.contains("spin-once")) return;
              a.classList.add("spin-once");
            });
          }, 5000);

          let off = 0, leaving = 0;
          h.addEventListener("mouseover", (e) => {
            if (!e.target.closest(".w")) return;
            clearTimeout(off);
            clearTimeout(leaving);
            h.classList.remove("is-leaving");
            h.classList.add("is-hover");
            setSpin(true);
          });
          h.addEventListener("mouseout", (e) => {
            const to = e.relatedTarget;
            if (to && to.closest && to.closest(".w") && h.contains(to)) return;
            clearTimeout(off);
            off = setTimeout(() => {
              h.classList.remove("is-hover");
              // keep the gradient flowing until the last word has faded back
              h.classList.add("is-leaving");
              clearTimeout(leaving);
              leaving = setTimeout(() => h.classList.remove("is-leaving"), 650);
              setSpin(false);
            }, 140);
          });
        }
      });
    });
  }

  /* ---------- 4. Reveal cards / gallery items as they enter ---------- */
  function reveals() {
    const items = $$(".card, .gallery-item, .about .portrait, .about-text, .contact-info, .form");
    if (!items.length) return;
    items.forEach((el) => el.classList.add("rv"));
    let batch = 0, lastTime = 0;
    const io = new IntersectionObserver((entries) => {
      const now = performance.now();
      if (now - lastTime > 200) batch = 0; // new scroll batch → restart stagger
      lastTime = now;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.style.setProperty("--d", `${Math.min(batch++, 5) * 70}ms`);
        e.target.classList.add("in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach((el) => io.observe(el));
  }

  /* ---------- 5. Render-bar page transition ---------- */
  function renderBar() {
    const bar = document.createElement("div");
    bar.id = "render";
    bar.innerHTML = '<div class="render-fill"></div><span class="render-label">rendering…</span>';
    document.body.appendChild(bar);

    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
      if (url.protocol === "mailto:") return;
      e.preventDefault();
      document.body.classList.add("is-leaving");
      bar.classList.add("is-on");
      setTimeout(() => (location.href = url.href), 360);
    });

    // back/forward cache can restore the page mid-transition — reset
    window.addEventListener("pageshow", () => {
      document.body.classList.remove("is-leaving");
      bar.classList.remove("is-on");
    });
  }

  /* ---------- 6. Small character bits ---------- */
  function sendButton() {
    const btn = $("#contact-form .btn");
    if (!btn) return;
    const label = btn.textContent.trim();
    btn.innerHTML = `<span class="btn-swap"><span>${label}</span><span aria-hidden="true">Render →</span></span>`;
  }

  keyframeCursor();
  headlineEntrances();
  reveals();
  renderBar();
  sendButton();
})();
