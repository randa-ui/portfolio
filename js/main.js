/* Shared behaviour: header/footer, grid, project page, contact form.
   Content lives in js/projects.js — you should not need to edit this file. */

(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const page = document.body.dataset.page;

  /* ---------- Header + footer, rendered once so all pages stay in sync ---------- */
  function renderChrome() {
    const header = $("#site-header");
    if (header) {
      header.innerHTML = `
        <a class="brand" href="index.html">${site.fullName}</a>
        <nav class="nav" aria-label="Main">
          <a href="index.html" ${page === "home" || page === "project" ? 'aria-current="page"' : ""}>Work</a>
          <a href="about.html" ${page === "about" ? 'aria-current="page"' : ""}>About</a>
          <a href="contact.html" ${page === "contact" ? 'aria-current="page"' : ""}>Contact</a>
        </nav>`;
    }
    const footer = $("#site-footer");
    if (footer) {
      footer.innerHTML = `
        <div>© ${new Date().getFullYear()} ${site.fullName}</div>
        <div class="links">
          <a href="mailto:${site.email}">Email</a>
          <a href="${site.instagram}" target="_blank" rel="noopener">Instagram</a>
          <a href="${site.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
        </div>`;
    }
    document.querySelectorAll("[data-site]").forEach((el) => {
      const key = el.dataset.site;
      if (key in site) {
        if (el.tagName === "A") {
          el.href = key === "email" ? `mailto:${site.email}` : site[key];
          if (!el.textContent.trim()) el.textContent = site[key];
        } else {
          el.textContent = site[key];
        }
      }
    });
  }

  /* ---------- Hover-to-play for any .card-media that has a <video> ---------- */
  function wireHoverVideo(media) {
    const video = $("video", media);
    if (!video) return;

    const play = () => {
      if (video.preload === "none") video.preload = "auto";
      const p = video.play();
      if (p && p.catch) p.catch(() => {});
      media.classList.add("is-playing");
    };
    const stop = () => {
      video.pause();
      media.classList.remove("is-playing");
    };

    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch) {
      // On phones there's no hover: play the clip while it is mostly in view.
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => (e.intersectionRatio > 0.6 ? play() : stop())),
        { threshold: [0, 0.6] }
      );
      io.observe(media);
      return;
    }

    media.addEventListener("mouseenter", play);
    media.addEventListener("mouseleave", stop);
    media.closest("a")?.addEventListener("focus", play);
    media.closest("a")?.addEventListener("blur", stop);

    // Scrub: moving the pointer across the thumb scrubs the loop like a playhead.
    // Stop moving and it resumes from there. Timecode tag rides with the pointer.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tag = document.createElement("span");
    tag.className = "tc-tag";
    media.appendChild(tag);
    let resume = 0;
    media.addEventListener("mousemove", (e) => {
      const r = media.getBoundingClientRect();
      const fx = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
      tag.style.transform = `translate(${e.clientX - r.left + 14}px, ${e.clientY - r.top + 14}px)`;
      if (!video.duration || !isFinite(video.duration)) return;
      video.pause();
      video.currentTime = fx * video.duration;
      media.classList.add("is-scrubbing");
      if (window.toTimecode) tag.textContent = toTimecode(video.currentTime);
      clearTimeout(resume);
      resume = setTimeout(() => {
        media.classList.remove("is-scrubbing");
        play();
      }, 220);
    });
    media.addEventListener("mouseleave", () => {
      clearTimeout(resume);
      media.classList.remove("is-scrubbing");
    });
  }

  /* ---------- Home grid ---------- */
  function renderGrid() {
    const grid = $("#grid");
    if (!grid) return;
    grid.innerHTML = projects
      .map(
        (p) => `
        <a class="card" href="project.html?p=${p.slug}">
          <div class="card-media${p.loop ? " is-loop" : ""}">
            <img src="${p.thumb}" alt="" loading="lazy" decoding="async">
            ${p.loop
              ? `<video src="${p.loop}" poster="${p.thumb}" autoplay muted loop playsinline preload="metadata" aria-hidden="true"></video>`
              : p.preview ? `<video src="${p.preview}" muted loop playsinline preload="none" aria-hidden="true"></video>` : ""}
          </div>
          <div class="card-caption">
            <h2 class="card-title">${p.title}</h2>
            ${p.client ? `<span class="card-client">${p.client}</span>` : ""}
          </div>
        </a>`
      )
      .join("");
    grid.querySelectorAll(".card-media:not(.is-loop)").forEach(wireHoverVideo);
    wireAutoplayLoops(grid); // "GIF" tiles: play while in view
  }

  /* ---------- Autoplay loops (gallery + self-hosted hero) ----------
     Chrome ignores a `muted` attribute written via innerHTML for autoplay
     purposes, so we set it from JS and only play clips while they're in view. */
  function wireAutoplayLoops(root) {
    const vids = root.querySelectorAll("video[autoplay]");
    if (!vids.length) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const v = e.target;
          if (e.isIntersecting) {
            v.muted = true;
            const p = v.play();
            if (p && p.catch) p.catch(() => {});
          } else {
            v.pause();
          }
        }),
      { rootMargin: "200px 0px" }
    );
    vids.forEach((v) => {
      v.muted = true;
      v.defaultMuted = true;
      io.observe(v);
    });
  }

  /* ---------- Project page ---------- */
  function heroMarkup(hero, title) {
    if (!hero) return "";
    if (hero.vimeo) {
      return `<iframe src="https://player.vimeo.com/video/${hero.vimeo}?title=0&byline=0&portrait=0&dnt=1"
        title="${title}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    }
    if (hero.youtube) {
      return `<iframe src="https://www.youtube-nocookie.com/embed/${hero.youtube}?rel=0&modestbranding=1"
        title="${title}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    }
    if (hero.video) {
      return `<video src="${hero.video}" ${hero.poster ? `poster="${hero.poster}"` : ""}
        controls autoplay muted loop playsinline></video>`;
    }
    return "";
  }

  function galleryItem(item) {
    const span = item.span === 2 ? "span-2" : "";
    let media = "";
    if (item.type === "video") {
      media = `<video src="${item.src}" autoplay muted loop playsinline preload="metadata"></video>`;
    } else {
      // gif or image
      media = `<img src="${item.src}" alt="${item.caption || ""}" loading="lazy" decoding="async">`;
    }
    return `
      <figure class="gallery-item ${span}">
        <div class="gallery-media">${media}</div>
        ${item.caption ? `<figcaption>${item.caption}</figcaption>` : ""}
      </figure>`;
  }

  function renderProject() {
    const root = $("#project");
    if (!root) return;
    const slug = new URLSearchParams(location.search).get("p");
    const index = projects.findIndex((p) => p.slug === slug);
    const p = projects[index];

    if (!p) {
      root.innerHTML = `<div class="notfound">That project isn't here. <a href="index.html">Back to work</a></div>`;
      return;
    }

    document.title = `${p.title} — ${site.fullName}`;
    const prev = projects[(index - 1 + projects.length) % projects.length];
    const next = projects[(index + 1) % projects.length];

    root.innerHTML = `
      <header class="project-head">
        <h1 class="project-title">${p.title}</h1>
        <dl class="project-meta">
          ${p.client ? `<dt>Client</dt><dd>${p.client}</dd>` : ""}
          ${p.role ? `<dt>Role</dt><dd>${p.role}</dd>` : ""}
          ${p.year ? `<dt>Year</dt><dd>${p.year}</dd>` : ""}
        </dl>
      </header>

      <div class="hero">${heroMarkup(p.hero, p.title)}</div>

      ${(p.credits || []).length || (p.description || []).length ? `
      <section class="project-body">
        <ul class="credits">${(p.credits || []).map((c) => `<li>${c}</li>`).join("")}</ul>
        <div class="project-desc">${(p.description || []).map((t) => `<p>${t}</p>`).join("")}</div>
      </section>` : ""}

      ${(p.gallery || []).length ? `<section class="gallery">${p.gallery.map(galleryItem).join("")}</section>` : ""}

      <nav class="project-nav" aria-label="More projects">
        <a href="project.html?p=${prev.slug}"><span class="label">← Previous</span><span class="title">${prev.title}</span></a>
        <a href="project.html?p=${next.slug}"><span class="label">Next →</span><span class="title">${next.title}</span></a>
      </nav>`;

    wireAutoplayLoops(root);
  }

  /* ---------- Contact form ---------- */
  function wireForm() {
    const form = $("#contact-form");
    if (!form) return;
    const note = $("#form-note");
    const btn = $("button[type=submit]", form);
    const configured = site.formEndpoint && !site.formEndpoint.includes("YOUR_FORM_ID");
    if (configured) form.action = site.formEndpoint;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if ($("[name=_gotcha]", form)?.value) return; // honeypot
      const data = new FormData(form);

      if (!configured) {
        // No backend yet: hand off to the visitor's email client.
        const subject = encodeURIComponent(`Portfolio enquiry from ${data.get("name") || ""}`);
        const body = encodeURIComponent(`${data.get("message") || ""}\n\n— ${data.get("name")} (${data.get("email")})`);
        location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
        return;
      }

      btn.disabled = true;
      note.textContent = "Sending…";
      try {
        const res = await fetch(site.formEndpoint, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(res.statusText);
        form.reset();
        note.textContent = "Rendered ✓ Thanks, I'll get back to you soon.";
      } catch (err) {
        note.textContent = `Something went wrong. Email me instead at ${site.email}`;
      } finally {
        btn.disabled = false;
      }
    });
  }

  renderChrome();
  renderGrid();
  renderProject();
  wireForm();
})();
