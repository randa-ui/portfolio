# Ran Daskal — portfolio site

A static portfolio: no build step, no framework, no CMS. Open `index.html` or drop the folder on any static host.

```
index.html      Home: intro + 4:3 grid of hover-play videos
project.html    One template for every project (project.html?p=<slug>)
about.html      About page
contact.html    Contact page with a small form + Instagram / LinkedIn
js/projects.js  ← ALL your content lives here (name, links, projects)
js/main.js      Renders the grid / project pages, hover-play + scrub, form
js/fx.js        The fun layer: keyframe cursor, text entrances, render bar, layer box
css/style.css   Styles (colours + fonts are tokens at the top; FX styles at the bottom)
assets/         thumbs/ (posters), videos/ (previews + heroes), gifs/ (project extras)
tools/          make-placeholders.sh — the gradient dummies; delete once you have real footage
```

## Preview locally

Any static server works. From this folder:

```bash
python3 -m http.server 8765
```

then open http://localhost:8765. (Opening `index.html` directly from Finder also works, but some browsers block hover-video on `file://`.)

## Adding a project

1. Export from After Effects / Premiere:
   - **Preview loop** — 4:3, e.g. 1200×900, muted, 3–6 s, H.264 MP4, aim for < 1.5 MB. Plays on hover in the grid.
   - **Poster** — a JPG of the first frame of the preview (shown before the video loads).
   - **Hero** — the full piece. Either upload to Vimeo / YouTube and use the ID, or export a 1920×1080 MP4 and put it in `assets/videos/`.
   - **Extras** — GIFs, short MP4 loops or stills for the gallery. MP4 is much lighter than GIF for the same clip; both work.
2. Put the files in `assets/thumbs`, `assets/videos`, `assets/gifs`.
3. Add an entry to the `projects` array in `js/projects.js`. The comment block at the top of that file documents every field. The grid order is the array order.

That's it. The project page, the previous/next links and the page title are generated from that entry.

## Your details

Edit the `site` object at the top of `js/projects.js`: name, tagline, email, location, Instagram and LinkedIn URLs.

The About page text is plain HTML in `about.html` — edit the paragraphs and lists directly, and replace `assets/portrait.jpg` with a photo (4:5 ratio looks best; a short muted `<video>` works too).

## Contact form

The form needs somewhere to send to, since there's no server.

- Create a free form at https://formspree.io (50 submissions/month on the free plan), and paste the endpoint into `site.formEndpoint` in `js/projects.js`.
- Until you do, pressing Send opens the visitor's email client with the message pre-filled, so nothing is lost.

Netlify Forms, Basin or Getform work the same way if you prefer them.

## Publishing

Any of these are free and take a few minutes:

- **Netlify** — drag the folder onto https://app.netlify.com/drop.
- **Vercel** — `npx vercel` in this folder.
- **GitHub Pages** — push the folder to a repo, enable Pages in Settings.
- **Cloudflare Pages** — connect the repo or upload the folder.

Then point your domain at it in the host's dashboard.

## The animations

The concept: the site behaves like an After Effects comp. All of it lives in `js/fx.js` plus the "FX" block at the end of `css/style.css`, and every effect turns itself off when the visitor has "reduce motion" enabled.

- **Hover scrub** on the grid. Moving across a thumbnail scrubs its loop; a timecode tag rides with the pointer. Stop moving and it plays from there. Phones get autoplay-in-view instead.
- **Keyframe cursor.** A small diamond, hollow "easy ease" shape over links. Only on mouse/trackpad devices; hidden over form fields.
- **Text-animator entrance** on every big headline: words rise in with a stagger and a touch of blur.
- **Reveal** of cards and gallery items as they scroll in.
- **Render bar** page transition. Internal links run a 2px bar labelled "rendering…" for ~0.35s before the next page.
- **Layer selection** on the About portrait: hover shows an AE-style bounding box, handles and anchor point; the photo nudges like a selected layer. Edit the `portrait.jpg` label text in `about.html`.
- **Rainbow** on the home headline: hovering fades the words into a flowing gradient, word by word. Colours are the gradient stops in the "rainbow" block of `css/style.css`.
- **Bits**: the ampersand swings on hover, the Send button becomes "Render →", and a keyframe appears next to a focused form label.

To remove any one effect, delete its function call at the bottom of `js/fx.js`. To remove them all, delete the `fx.js` script tag from the four HTML files.

## Notes

- Colours and fonts are CSS variables at the top of `css/style.css`. It has a dark mode that follows the visitor's system setting; add `data-theme="light"` on `<html>` to force light.
- Thumbnails are 4:3 (`.card-media { aspect-ratio: 4 / 3 }`). Change that one line for 16:9 or 1:1.
- The grid is two columns on desktop and one on phones. On phones, previews play automatically as they scroll into view since there's no hover.
