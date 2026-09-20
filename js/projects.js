/* =====================================================================
   SITE CONTENT — this is the only file you need to edit.
   - `site`     : your name, tagline, email, social links
   - `projects` : one entry per project. The order here is the order
                  of the grid on the home page.

   Each project:
     slug        URL id, e.g. project.html?p=woohoo  (letters, dashes)
     title       shown on the card and the project page
     client      small label under the title
     role        e.g. "Art direction, Animation"
     year        "2025"
     thumb       4:3 poster image shown before the hover video loads
     preview     4:3 muted loop that plays on hover (mp4/webm)
     hero        the big player. Use ONE of:
                   { vimeo: "123456789" }
                   { youtube: "dQw4w9WgXcQ" }
                   { video: "assets/videos/xxx.mp4", poster: "assets/thumbs/xxx.jpg" }
     description one or two short paragraphs (array of strings)
     credits     optional array of "Label — Value" strings
     gallery     more clips/GIFs/stills from the project. Each item:
                   { type: "video", src: "...mp4", span: 2 }   // span 2 = full width
                   { type: "gif",   src: "...gif",  span: 1 }
                   { type: "image", src: "...jpg",  span: 1, caption: "..." }
   ===================================================================== */

const site = {
  name: "Ran",
  fullName: "Ran Daskal",
  role: "Art director + motion expert",
  tagline:
    "I specialize in delivering creative solutions across the entire production pipeline, from concept development to final delivery.",
  email: "hello@randaskal.com",
  location: "Tel Aviv, Israel",
  instagram: "https://www.instagram.com/your-handle",
  linkedin: "https://www.linkedin.com/in/your-handle",
  // Contact form: create a free form at https://formspree.io and paste the endpoint here.
  // Until you do, the form falls back to opening your email client.
  formEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
};

const projects = [
  {
    slug: "showreel",
    title: "Showreel 2026",
    client: "Reel",
    role: "Art direction, Motion design",
    year: "2026",
    // Tile: Vimeo still, no hover loop. Swap for your own 4:3 still + loop when ready:
    //   thumb: "assets/thumbs/showreel.jpg", preview: "assets/videos/showreel-preview.mp4",
    thumb: "https://i.vimeocdn.com/video/708532681-7bf820edad248459ebab170b35dd9e218a2e21fc61dc2f37323a9908dcf86c77-d_1280",
    preview: "",
    // showreel-hero.mp4 is a web-sized encode of Showreel25.mp4 (the 227 MB master is too heavy to serve)
    hero: { video: "assets/videos/showreel-hero.mp4", poster: "assets/thumbs/showreel-hero.jpg" },
    description: [
      "A minute of selected work: brand films, product motion, character pieces and live-action compositing.",
    ],
    credits: ["Direction & animation — Ran Daskal"],
    gallery: [],
  },
  {
    slug: "woohoo",
    title: "WooHoo Glue Stick",
    client: "WooHoo",
    role: "Art direction, Character animation",
    year: "2025",
    thumb: "assets/thumbs/woohoo.jpg",
    preview: "assets/videos/woohoo-preview.mp4",
    hero: { video: "assets/videos/woohoo-hero.mp4", poster: "assets/thumbs/woohoo-hero.jpg" },
    description: [
      "A live-action product spot with a hand-animated face composited onto a real glue stick. The character had to feel physically present on the desk: matching light, grain and camera drift shot by shot.",
      "I led the art direction, designed the character's expressions and handled compositing and final grade.",
    ],
    credits: ["Client — WooHoo", "Director — Ran Daskal", "DOP — Studio Team", "Sound — Freelance"],
    gallery: [
      { type: "video", src: "assets/gifs/woohoo-01.mp4", span: 1 },
      { type: "video", src: "assets/gifs/woohoo-02.mp4", span: 1 },
      { type: "video", src: "assets/gifs/woohoo-03.mp4", span: 2, caption: "Expression tests before compositing" },
    ],
  },
  {
    slug: "monday-crm",
    title: "monday CRM Launch",
    client: "monday.com",
    role: "Motion design, Brand system",
    year: "2025",
    thumb: "assets/thumbs/monday-crm.jpg",
    preview: "assets/videos/monday-crm-preview.mp4",
    hero: { video: "assets/videos/monday-crm-hero.mp4", poster: "assets/thumbs/monday-crm-hero.jpg" },
    description: [
      "Launch film and modular motion toolkit for monday CRM. Circular portraits, product UI and the connection-shape system come together in a language that scales from a 60s hero to 6s social cuts.",
      "I built the rig for the connection shapes in After Effects and defined the timing rules the wider team used across the campaign.",
    ],
    credits: ["Client — monday.com", "Creative direction — Brand Studio", "Motion — Ran Daskal"],
    gallery: [
      { type: "video", src: "assets/gifs/monday-crm-01.mp4", span: 2 },
      { type: "video", src: "assets/gifs/monday-crm-02.mp4", span: 1 },
      { type: "video", src: "assets/gifs/monday-crm-03.mp4", span: 1 },
    ],
  },
  {
    slug: "green-room",
    title: "Green Room Series",
    client: "monday.com",
    role: "Art direction, Compositing",
    year: "2024",
    thumb: "assets/thumbs/green-room.jpg",
    preview: "assets/videos/green-room-preview.mp4",
    hero: { video: "assets/videos/green-room-hero.mp4", poster: "assets/thumbs/green-room-hero.jpg" },
    description: [
      "An explainer series shot on green screen where the presenter interacts with animated product UI. Every gesture was pre-planned with animatics so the motion could be timed to the performance, not the other way around.",
    ],
    credits: ["Client — monday.com", "Presenter — In-house", "Motion & comp — Ran Daskal"],
    gallery: [
      { type: "video", src: "assets/gifs/green-room-01.mp4", span: 1 },
      { type: "video", src: "assets/gifs/green-room-02.mp4", span: 1 },
    ],
  },
  {
    slug: "felt-cat",
    title: "The Accountant",
    client: "Personal",
    role: "Direction, Stop motion",
    year: "2024",
    thumb: "assets/thumbs/felt-cat.jpg",
    preview: "assets/videos/felt-cat-preview.mp4",
    hero: { video: "assets/videos/felt-cat-hero.mp4", poster: "assets/thumbs/felt-cat-hero.jpg" },
    description: [
      "A needle-felted cat with a very serious job. A short stop-motion piece exploring how far a tiny keyboard and a pair of glasses can carry a character.",
    ],
    credits: ["Direction & animation — Ran Daskal", "Puppet — Handmade"],
    gallery: [
      { type: "video", src: "assets/gifs/felt-cat-01.mp4", span: 2 },
      { type: "video", src: "assets/gifs/felt-cat-02.mp4", span: 1 },
      { type: "video", src: "assets/gifs/felt-cat-03.mp4", span: 1 },
    ],
  },
  {
    slug: "logo-mitosis",
    title: "Logo Mitosis",
    client: "monday.com",
    role: "Motion design",
    year: "2025",
    thumb: "assets/thumbs/logo-mitosis.jpg",
    preview: "assets/videos/logo-mitosis-preview.mp4",
    hero: { video: "assets/videos/logo-mitosis-hero.mp4", poster: "assets/thumbs/logo-mitosis-hero.jpg" },
    description: [
      "A logo ident where the mark divides and recombines like a cell. Built as a procedural rig so the same motion could be re-timed for stingers, loaders and transitions.",
    ],
    gallery: [
      { type: "video", src: "assets/gifs/logo-mitosis-01.mp4", span: 1 },
      { type: "video", src: "assets/gifs/logo-mitosis-02.mp4", span: 1 },
    ],
  },
  {
    slug: "lower-thirds",
    title: "Lower Third System",
    client: "monday.com",
    role: "Motion design, Templates",
    year: "2024",
    thumb: "assets/thumbs/lower-thirds.jpg",
    preview: "assets/videos/lower-thirds-preview.mp4",
    hero: { video: "assets/videos/lower-thirds-hero.mp4", poster: "assets/thumbs/lower-thirds-hero.jpg" },
    description: [
      "A family of lower thirds and title cards delivered as editable templates for the video team. Type sizes, safe zones and reveal timing are all driven from a handful of controls.",
    ],
    gallery: [
      { type: "video", src: "assets/gifs/lower-thirds-01.mp4", span: 2 },
    ],
  },
];
