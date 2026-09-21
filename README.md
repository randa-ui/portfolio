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

### Current projects and their file names

Every project already has an entry and placeholder files. Drop your real exports in with these exact names and nothing else needs editing:

| # | Title | Tile still (`assets/thumbs/`) | Hover loop (`assets/videos/`) | Main video (`assets/videos/`) |
|---|---|---|---|---|
| 01 | Showreel 26 | `showreel.jpg` (see note in projects.js) | `showreel-preview.mp4` | `showreel-hero.mp4` ✓ |
| 02 | Abandoned Office | `abandoned-office.jpg` | `abandoned-office-preview.mp4` | `abandoned-office-hero.mp4` |
| 03 | Your CRM is old | `your-crm-is-old.jpg` | `your-crm-is-old-preview.mp4` | `your-crm-is-old-hero.mp4` |
| 04 | Truth Bomb | `truth-bomb.jpg` | `truth-bomb-preview.mp4` | `truth-bomb-hero.mp4` |
| 05 | Wordtune | `wordtune.jpg` | `wordtune-preview.mp4` | `wordtune-hero.mp4` |
| 06 | The biggest deal | `the-biggest-deal.jpg` | `the-biggest-deal-preview.mp4` | `the-biggest-deal-hero.mp4` |
| 07 | I'm an actor | `im-an-actor.jpg` | `im-an-actor-preview.mp4` | `im-an-actor-hero.mp4` |
| 08 | monday CRM Agents | `monday-crm-agents.jpg` | `monday-crm-agents-preview.mp4` | `monday-crm-agents-hero.mp4` |
| 09 | S.A.L.T | `salt.jpg` | `salt-preview.mp4` | `salt-hero.mp4` |
| 10 | monday Service | `monday-service.jpg` | `monday-service-preview.mp4` | `monday-service-hero.mp4` |
| 11 | monday CRM demo | `monday-crm-demo.jpg` | `monday-crm-demo-preview.mp4` | `monday-crm-demo-hero.mp4` |
| 12 | Fortis | `fortis.jpg` | `fortis-preview.mp4` | `fortis-hero.mp4` |
| 13 | The worst about IT | `the-worst-about-it.jpg` | `the-worst-about-it-preview.mp4` | `the-worst-about-it-hero.mp4` |
| 14 | The president | `the-president.jpg` | `the-president-preview.mp4` | `the-president-hero.mp4` |
| 15 | CRM Nightmare | `crm-nightmare.jpg` | `crm-nightmare-preview.mp4` | `crm-nightmare-hero.mp4` |
| 16 | Art of work | `art-of-work.jpg` | `art-of-work-preview.mp4` | `art-of-work-hero.mp4` |

Each project also has a `-hero.jpg` poster in `assets/thumbs/` shown before the main video loads. Main videos on Vimeo/YouTube instead? Replace the `hero` line with `{ vimeo: "ID" }`.

Empty `client`, `role` and `year` fields are hidden automatically, so fill them in as you go.

## Your details

Edit the `site` object at the top of `js/projects.js`: name, tagline, email, location, Instagram and LinkedIn URLs.

The About page text is plain HTML in `about.html` — edit the paragraphs and lists directly, and replace `assets/portrait.jpg` with a photo (4:5 ratio looks best; a short muted `<video>` works too).

## Contact form

The form needs somewhere to send to, since there's no server.

- Create a free form at https://formspree.io (50 submissions/month on the free plan), and paste the endpoint into `site.formEndpoint` in `js/projects.js`.
- Until you do, pressing Send opens the visitor's email client with the message pre-filled, so nothing is lost.

Netlify Forms, Basin or Getform work the same way if you prefer them.

## Publishing

The site is live on GitHub Pages:

- **URL:** https://randaskal.com (www.randaskal.com redirects here; so does randa-ui.github.io/portfolio)
- **Repo:** https://github.com/randa-ui/portfolio
- **Domain:** bought at Wix; its DNS points at GitHub (four A records → 185.199.108–111.153, `www` CNAME → randa-ui.github.io). The `CNAME` file in this folder tells GitHub which domain to serve — don't delete it.

To publish changes, commit and push from this folder. GitHub rebuilds the site in about a minute:

```bash
git add -A && git commit -m "Update site" && git push
```

Files listed in `.gitignore` are never uploaded. The 217 MB master reel (`Showreel25.mp4`) is excluded on purpose: GitHub refuses files over 100 MB, and the site plays the web-sized `showreel-hero.mp4` instead. Keep future masters out of `assets` or add them to `.gitignore`.

**Note for the monday.com office network:** the corporate proxy caches DNS, so the domain may show an old Wix page there for a while after DNS changes. Check from a phone on mobile data if in doubt.

## The animations

The concept: the site behaves like an After Effects comp. All of it lives in `js/fx.js` plus the "FX" block at the end of `css/style.css`, and every effect turns itself off when the visitor has "reduce motion" enabled.

- **Hover scrub** on the grid. Moving across a thumbnail scrubs its loop; a timecode tag rides with the pointer. Stop moving and it plays from there. Phones get autoplay-in-view instead.
- **Keyframe cursor.** A small diamond, hollow "easy ease" shape over links. Only on mouse/trackpad devices; hidden over form fields.
- **Text-animator entrance** on every big headline: words rise in with a stagger and a touch of blur.
- **Reveal** of cards and gallery items as they scroll in.
- **Render bar** page transition. Internal links run a 2px bar labelled "rendering…" for ~0.35s before the next page.
- **Layer selection** on the About portrait: hover shows an AE-style bounding box, handles and anchor point; the photo nudges like a selected layer. Edit the `portrait.jpg` label text in `about.html`.
- **Rainbow** on the home headline: hovering fades the words into a flowing gradient, word by word. Colours are the gradient stops in the "rainbow" block of `css/style.css`.
- **Bits**: the plus in the headline spins while hovered, the Send button becomes "Render →", and a keyframe appears next to a focused form label.

To remove any one effect, delete its function call at the bottom of `js/fx.js`. To remove them all, delete the `fx.js` script tag from the four HTML files.

## Notes

- Colours and fonts are CSS variables at the top of `css/style.css`. The site is always dark; add `data-theme="light"` on `<html>` if you ever want the light palette.
- Thumbnails are 4:3 (`.card-media { aspect-ratio: 4 / 3 }`). Change that one line for 16:9 or 1:1.
- The grid is two columns on desktop and one on phones. On phones, previews play automatically as they scroll into view since there's no hover.
