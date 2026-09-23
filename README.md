# Ran Daskal — portfolio site

A static portfolio: no build step, no framework, no CMS. Open `index.html` or drop the folder on any static host.

```
index.html      Home: intro + 4:3 grid of project stills
project.html    One template for every project (project.html?p=<slug>)
about.html      About page
contact.html    Contact page with a small form + Instagram / LinkedIn
js/projects.js  ← ALL your content lives here (name, links, projects)
js/main.js      Renders the grid / project pages, form
js/fx.js        The fun layer: keyframe cursor, text entrances, render bar, layer box
css/style.css   Styles (colours + fonts are tokens at the top; FX styles at the bottom)
assets/         thumbs/ (posters), videos/ (previews + heroes), gifs/ (project extras)
tools/          ingest-video.sh (master film → web encode + poster + tile still), make-placeholders.sh (gradient dummies)
```

## Preview locally

Any static server works. From this folder:

```bash
python3 -m http.server 8765
```

then open http://localhost:8765. (Opening `index.html` directly from Finder also works, but some browsers block hover-video on `file://`.)

## Adding a project

The quick way: give Claude the master film and the project name. The script it uses is here too:

```bash
tools/ingest-video.sh truth-bomb "/path/to/04_Truth Bomb.mp4" 5
```

That writes a 1080p web encode (`assets/videos/truth-bomb-hero.mp4`, ~10–25 MB), a poster frame, and a 4:3 tile still cut from the film at 5 seconds. To use your own still instead, save it as `assets/thumbs/truth-bomb.jpg` (1200×900) and create an empty `assets/thumbs/truth-bomb.keep` so the script leaves it alone.

Then add or edit the project's entry in `js/projects.js`. The comment block at the top documents every field. The grid order is the array order.

That's it. The project page, the previous/next links and the page title are generated from that entry.

### Current projects and their file names

Every project already has an entry and placeholder files. Drop your real exports in with these exact names and nothing else needs editing:

| # | Title | Tile still (`assets/thumbs/`) | Main video (`assets/videos/`) |
|---|---|---|---|
| 01 | Showreel 26 | `showreel.jpg` (see note in projects.js) | `showreel-hero.mp4` ✓ |
| 02 | Abandoned Office | `abandoned-office.jpg` | `abandoned-office-hero.mp4` |
| 03 | Your CRM is old | `your-crm-is-old.jpg` | `your-crm-is-old-hero.mp4` |
| 04 | Truth Bomb | `truth-bomb.jpg` | `truth-bomb-hero.mp4` |
| 05 | Wordtune | `wordtune.jpg` | `wordtune-hero.mp4` |
| 06 | The biggest deal | `the-biggest-deal.jpg` | `the-biggest-deal-hero.mp4` |
| 07 | I'm an actor | `im-an-actor.jpg` | `im-an-actor-hero.mp4` |
| 08 | monday CRM Agents | `monday-crm-agents.jpg` | `monday-crm-agents-hero.mp4` |
| 09 | S.A.L.T | `salt.jpg` | `salt-hero.mp4` |
| 10 | monday Service | `monday-service.jpg` | `monday-service-hero.mp4` |
| 11 | monday CRM demo | `monday-crm-demo.jpg` | `monday-crm-demo-hero.mp4` |
| 12 | Fortis | `fortis.jpg` | `fortis-hero.mp4` |
| 13 | The worst about IT | `the-worst-about-it.jpg` | `the-worst-about-it-hero.mp4` |
| 14 | The Menorah | `the-menorah.jpg` ✓ | Vimeo 364597229 |
| 15 | CRM Nightmare | `crm-nightmare.jpg` | `crm-nightmare-hero.mp4` |
| 16 | Life of the dead | `life-of-the-dead.jpg` ✓ | `life-of-the-dead-hero.mp4` ✓ |

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

To publish changes, run the publish script from this folder. It stamps a new cache-busting version (so visitors see changes immediately instead of after GitHub's 10-minute cache), commits and pushes. GitHub rebuilds in about a minute:

```bash
tools/publish.sh "what changed"
```

(Plain `git add -A && git commit && git push` also works, but browsers may show the old version for up to 10 minutes.)

Files listed in `.gitignore` are never uploaded. The 217 MB master reel (`Showreel25.mp4`) is excluded on purpose: GitHub refuses files over 100 MB, and the site plays the web-sized `showreel-hero.mp4` instead. Keep future masters out of `assets` or add them to `.gitignore`.

**Note for the monday.com office network:** the corporate proxy caches DNS, so the domain may show an old Wix page there for a while after DNS changes. Check from a phone on mobile data if in doubt.

## The animations

The concept: the site behaves like an After Effects comp. All of it lives in `js/fx.js` plus the "FX" block at the end of `css/style.css`, and every effect turns itself off when the visitor has "reduce motion" enabled.

- **Keyframe cursor.** A small diamond, hollow "easy ease" shape over links. Only on mouse/trackpad devices; hidden over form fields.
- **Text-animator entrance** on every big headline: words rise in with a stagger and a touch of blur.
- **Reveal** of cards and gallery items as they scroll in.
- **Render bar** page transition. Internal links run a 2px bar labelled "rendering…" for ~0.35s before the next page.
- **Layer selection** on the About portrait: hover shows an AE-style bounding box and handles; the photo nudges like a selected layer.
- **Rainbow** on the home headline: hovering fades the words into a flowing gradient, word by word. Colours are the gradient stops in the "rainbow" block of `css/style.css`.
- **Bits**: the plus in the headline spins while hovered, the Send button becomes "Render →", and a keyframe appears next to a focused form label.

To remove any one effect, delete its function call at the bottom of `js/fx.js`. To remove them all, delete the `fx.js` script tag from the four HTML files.

## Notes

- Colours and fonts are CSS variables at the top of `css/style.css`. The site is always dark; add `data-theme="light"` on `<html>` if you ever want the light palette.
- Thumbnails are 4:3 (`.card-media { aspect-ratio: 4 / 3 }`). Change that one line for 16:9 or 1:1.
- The grid is two columns on desktop and one on phones. Tiles are stills by default. For an animated "GIF" tile, set the project's `loop` to a muted 4:3 mp4 (it plays continuously while on screen; the `thumb` is its poster). Make one from a GIF with:

  ```bash
  ffmpeg -i tile.gif -an -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p" -c:v libx264 -preset slow -crf 24 -movflags +faststart assets/videos/<slug>-loop.mp4
  ```

  Current animated tiles: Abandoned Office, Hate Your IT Job?, Sophia, monday Service, The biggest deal (sources: Dropbox `___THUMBS/GIF/01–05.gif`).
