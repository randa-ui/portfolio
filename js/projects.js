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
     loop        optional 4:3 muted mp4 that plays continuously in the tile (a "GIF" tile).
                 The thumb is used as its poster.
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
  tagline: "I specialize in delivering creative solutions across the entire production pipeline, from concept development to final delivery.",
  email: "randaskal@gmail.com",
  location: "Tel Aviv, Israel",
  instagram: "https://www.instagram.com/randaskal/",
  linkedin: "https://www.linkedin.com/in/ran-daskal-80521525/",
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
    hero: { video: "assets/videos/showreel-hero.mp4", poster: "assets/thumbs/showreel-hero.jpg" },
    description: [
      "A minute of selected work: brand films, product motion, character pieces and live-action compositing.",
    ],
    credits: [
      "Direction & animation — Ran Daskal",
    ],
    gallery: [],
  },
  {
    slug: "abandoned-office",
    title: "Abandoned Office",
    client: "monday.com",
    role: "",
    year: "",
    thumb: "assets/thumbs/abandoned-office.jpg",
    preview: "",
    loop: "assets/videos/abandoned-office-loop.mp4",
    hero: { video: "assets/videos/abandoned-office-hero.mp4", poster: "assets/thumbs/abandoned-office-hero.jpg" },
    description: [
      "Example description. An empty office, and the objects left behind start doing the work themselves. Live-action plates with hand-animated faces composited onto real props.",
      "Replace this text with your own, or leave the file empty to hide it.",
    ],
    credits: [
      "Client — monday.com",
      "Director — Ari Kuchar",
      "Art Director — Noam Locker",
      "Motion & Compositing — Ran Daskal",
      "Set Design & Character Development — Noam Locker & Ran Daskal",
      "Color — Dvir Aviram",
    ],
    gallery: [
      {"type": "video", "src": "assets/gallery/abandoned-office/01.mp4", "span": 1, "caption": "Frame from the film"},
      {"type": "image", "src": "assets/gallery/abandoned-office/02.jpg", "span": 1, "caption": "The light switch character"},
      {"type": "image", "src": "assets/gallery/abandoned-office/03.jpg", "span": 2, "caption": "Character Visual Development"},
      {"type": "video", "src": "assets/gallery/abandoned-office/04.mp4", "span": 1, "caption": ""},
      {"type": "image", "src": "assets/gallery/abandoned-office/05.jpg", "span": 1, "caption": ""},
    ],
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
    description: [
      "A dialogue piece for monday CRM: two colleagues argue about their outdated CRM until the product steps in to settle it, with the UI animated into the live-action scene.",
    ],
    credits: [
      "Client — monday.com",
      "Motion & Compositing — Ran Daskal",
    ],
    gallery: [],
  },
  {
    slug: "wordtune",
    title: "Wordtune Spices",
    client: "AI21 Labs",
    role: "",
    year: "",
    thumb: "assets/thumbs/wordtune.jpg",
    preview: "",
    loop: "assets/videos/wordtune-loop.mp4",
    hero: { vimeo: "790074777" },
    description: [
      "Product film for Wordtune Spices, told through a needle-felted cat at its desk discovering what AI writing tools can do.",
    ],
    credits: [
      "Client — AI21 Labs",
      "Motion Design & Animation — Ran Daskal",
    ],
    gallery: [],
  },
  {
    slug: "truth-bomb",
    title: "Truth Bomb",
    client: "monday.com",
    role: "",
    year: "",
    thumb: "assets/thumbs/truth-bomb.jpg",
    preview: "",
    hero: { video: "assets/videos/truth-bomb-hero.mp4", poster: "assets/thumbs/truth-bomb-hero.jpg" },
    description: [
      "A presenter delivers hard truths about CRM customisation while kinetic type wraps around the live-action frame.",
    ],
    credits: [
      "Client — monday.com",
      "Motion & Compositing — Ran Daskal",
    ],
    gallery: [],
  },
  {
    slug: "fortis",
    title: "Sophia",
    client: "Fortis",
    role: "",
    year: "",
    thumb: "assets/thumbs/fortis.jpg",
    preview: "",
    loop: "assets/videos/fortis-loop.mp4",
    hero: { vimeo: "364596073" },
    description: [
      "Illustrated opening sequence for Sophia, a Fortis production: ink-drawn insects and figures animated over soft pastel backdrops.",
    ],
    credits: [
      "Client — Fortis",
      "Design & Animation — Ran Daskal",
    ],
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
    loop: "assets/videos/monday-service-loop.mp4",
    hero: { video: "assets/videos/monday-service-hero.mp4", poster: "assets/thumbs/monday-service-hero.jpg" },
    description: [
      "Explainer for monday Service: tickets, service requests and AI agents, mixing office live action with animated product screens.",
    ],
    credits: [
      "Client — monday.com",
      "Motion & Compositing — Ran Daskal",
    ],
    gallery: [],
  },
  {
    slug: "the-biggest-deal",
    title: "The biggest deal",
    client: "monday.com",
    role: "",
    year: "",
    thumb: "assets/thumbs/the-biggest-deal.jpg",
    preview: "",
    loop: "assets/videos/the-biggest-deal-loop.mp4",
    hero: { video: "assets/videos/the-biggest-deal-hero.mp4", poster: "assets/thumbs/the-biggest-deal-hero.jpg" },
    description: [
      "A sales-team story for monday CRM, following one deal from proposal to Won, with the product UI animated into the office scenes.",
    ],
    credits: [
      "Client — monday.com",
      "Motion & Compositing — Ran Daskal",
    ],
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
    description: [
      "Title sequence for the KAN History documentary on the Menorah, the state emblem of Israel.",
    ],
    credits: [
      "Client — KAN",
      "Design & Animation — Ran Daskal",
    ],
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
    description: [
      "Launch film introducing AI agents in monday CRM, from sourcing leads to closing deals.",
    ],
    credits: [
      "Client — monday.com",
      "Motion & Compositing — Ran Daskal",
    ],
    gallery: [],
  },
  {
    slug: "salt",
    title: "S.A.L.T",
    client: "KAN",
    role: "",
    year: "",
    thumb: "assets/thumbs/salt.jpg",
    preview: "",
    hero: { vimeo: "364595929" },
    description: [
      "Opening titles for the KAN History film on S.A.L.T, the Strategic Arms Limitation Talks: archive photography, torn paper and typewriter type.",
    ],
    credits: [
      "Client — KAN",
      "Design & Animation — Ran Daskal",
    ],
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
    loop: "assets/videos/crm-nightmare-loop.mp4",
    hero: { video: "assets/videos/crm-nightmare-hero.mp4", poster: "assets/thumbs/crm-nightmare-hero.jpg" },
    description: [
      "A CRM horror story: one salesperson's nightmares of lost leads and messy pipelines, until monday CRM lets her sleep.",
    ],
    credits: [
      "Client — monday.com",
      "Motion & Compositing — Ran Daskal",
    ],
    gallery: [],
  },
  {
    slug: "life-of-the-dead",
    title: "Life of the dead",
    client: "KAN",
    role: "",
    year: "",
    thumb: "assets/thumbs/life-of-the-dead.jpg",
    preview: "",
    hero: { video: "assets/videos/life-of-the-dead-hero.mp4", poster: "assets/thumbs/life-of-the-dead-hero.jpg" },
    description: [
      "Title sequence for the KAN History documentary Life of the Dead, built from archive footage and documents.",
    ],
    credits: [
      "Client — KAN",
      "Design & Animation — Ran Daskal",
    ],
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
    description: [
      "Product demo for monday CRM showing how AI clears the path to faster deals and better decisions.",
    ],
    credits: [
      "Client — monday.com",
      "Motion & Compositing — Ran Daskal",
    ],
    gallery: [],
  },
  {
    slug: "im-an-actor",
    title: "I'm an actor",
    client: "monday.com",
    role: "",
    year: "",
    thumb: "assets/thumbs/im-an-actor.jpg",
    preview: "",
    hero: { video: "assets/videos/im-an-actor-hero.mp4", poster: "assets/thumbs/im-an-actor-hero.jpg" },
    description: [
      "A presenter on a green-screen set walks through the monday.com product, with the animated UI composited around the performance.",
    ],
    credits: [
      "Client — monday.com",
      "Motion & Compositing — Ran Daskal",
    ],
    gallery: [],
  },
  {
    slug: "the-worst-about-it",
    title: "Hate Your IT Job?",
    client: "monday.com",
    role: "",
    year: "",
    thumb: "assets/thumbs/the-worst-about-it.jpg",
    preview: "",
    loop: "assets/videos/the-worst-about-it-loop.mp4",
    hero: { video: "assets/videos/the-worst-about-it-hero.mp4", poster: "assets/thumbs/the-worst-about-it-hero.jpg" },
    description: [
      "A testimonial-style spot for monday Service: an IT director on what makes the job hard, and what fixes it.",
    ],
    credits: [
      "Client — monday.com",
      "Motion & Compositing — Ran Daskal",
    ],
    gallery: [],
  },
];
