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
     preview     optional 4:3 muted hover loop (mp4). Leave "" for a still-only tile.
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
    title: "Showreel 26",
    client: "Reel",
    role: "Art direction, Motion design",
    year: "2026",
    thumb: "assets/thumbs/showreel.jpg",
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
    slug: "abandoned-office",
    title: "Abandoned Office",
    client: "",
    role: "",
    year: "",
    thumb: "assets/thumbs/abandoned-office.jpg",
    preview: "",
    hero: { video: "assets/videos/abandoned-office-hero.mp4", poster: "assets/thumbs/abandoned-office-hero.jpg" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "your-crm-is-old",
    title: "Your CRM is old",
    client: "monday.com",
    role: "",
    year: "",
    thumb: "assets/thumbs/your-crm-is-old.jpg",
    preview: "",
    hero: { video: "assets/videos/your-crm-is-old-hero.mp4", poster: "assets/thumbs/your-crm-is-old-hero.jpg" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "truth-bomb",
    title: "Truth Bomb",
    client: "",
    role: "",
    year: "",
    thumb: "assets/thumbs/truth-bomb.jpg",
    preview: "",
    hero: { video: "assets/videos/truth-bomb-hero.mp4", poster: "assets/thumbs/truth-bomb-hero.jpg" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "wordtune",
    title: "Wordtune",
    client: "Wordtune",
    role: "",
    year: "",
    thumb: "assets/thumbs/wordtune.jpg",
    preview: "",
    hero: { vimeo: "790074777" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "fortis",
    title: "Fortis",
    client: "Fortis",
    role: "",
    year: "",
    thumb: "assets/thumbs/fortis.jpg",
    preview: "",
    hero: { vimeo: "364596073" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "monday-service",
    title: "monday Service",
    client: "monday.com",
    role: "",
    year: "",
    thumb: "assets/thumbs/monday-service.jpg",
    preview: "",
    hero: { video: "assets/videos/monday-service-hero.mp4", poster: "assets/thumbs/monday-service-hero.jpg" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "the-menorah",
    title: "The Menorah",
    client: "KAN",
    role: "",
    year: "",
    thumb: "assets/thumbs/the-menorah.jpg",
    preview: "",
    hero: { vimeo: "364597229" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "crm-nightmare",
    title: "CRM Nightmare",
    client: "monday.com",
    role: "",
    year: "",
    thumb: "assets/thumbs/crm-nightmare.jpg",
    preview: "",
    hero: { video: "assets/videos/crm-nightmare-hero.mp4", poster: "assets/thumbs/crm-nightmare-hero.jpg" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "life-of-the-dead",
    title: "Life of the dead",
    client: "",
    role: "",
    year: "",
    thumb: "assets/thumbs/life-of-the-dead.jpg",
    preview: "",
    hero: { video: "assets/videos/life-of-the-dead-hero.mp4", poster: "assets/thumbs/life-of-the-dead-hero.jpg" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "im-an-actor",
    title: "I'm an actor",
    client: "",
    role: "",
    year: "",
    thumb: "assets/thumbs/im-an-actor.jpg",
    preview: "",
    hero: { video: "assets/videos/im-an-actor-hero.mp4", poster: "assets/thumbs/im-an-actor-hero.jpg" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "the-biggest-deal",
    title: "The biggest deal",
    client: "",
    role: "",
    year: "",
    thumb: "assets/thumbs/the-biggest-deal.jpg",
    preview: "",
    hero: { video: "assets/videos/the-biggest-deal-hero.mp4", poster: "assets/thumbs/the-biggest-deal-hero.jpg" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "monday-crm-agents",
    title: "monday CRM Agents",
    client: "monday.com",
    role: "",
    year: "",
    thumb: "assets/thumbs/monday-crm-agents.jpg",
    preview: "",
    hero: { video: "assets/videos/monday-crm-agents-hero.mp4", poster: "assets/thumbs/monday-crm-agents-hero.jpg" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "salt",
    title: "S.A.L.T",
    client: "KAN",
    role: "",
    year: "",
    thumb: "https://i.vimeocdn.com/video/820069563-15f8d975aec27236a3809dc18779e6c37c004da140220e96118bf0902d2335f5-d_1280",
    preview: "",
    hero: { vimeo: "364595929" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "monday-crm-demo",
    title: "monday CRM demo",
    client: "monday.com",
    role: "",
    year: "",
    thumb: "assets/thumbs/monday-crm-demo.jpg",
    preview: "",
    hero: { youtube: "J4jRLn2wfyc" },
    description: [],
    credits: [],
    gallery: [],
  },
  {
    slug: "the-worst-about-it",
    title: "The worst about IT",
    client: "",
    role: "",
    year: "",
    thumb: "assets/thumbs/the-worst-about-it.jpg",
    preview: "",
    hero: { video: "assets/videos/the-worst-about-it-hero.mp4", poster: "assets/thumbs/the-worst-about-it-hero.jpg" },
    description: [],
    credits: [],
    gallery: [],
  },
];
