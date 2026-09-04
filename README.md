# ZenithRank SEO Sandbox

An interactive, hands-on **SEO learning sandbox** built with Next.js. Instead of reading abstract lessons, you write real HTML in a live code editor and watch as an automatic SEO validator grades your work against a rule engine. Each module teaches one core on-page SEO concept with instant feedback and real-time search-result previews.

## Features

- **Guided lessons** — a structured curriculum covering H1 tags, meta descriptions, image alts, viewport, Open Graph, JSON-LD schema, robots, titles, and canonical URLs.
- **Live code editor** — write HTML with CodeMirror (syntax highlighting, line numbers, folding).
- **Real-time validation** — a browser-based rule engine scores your markup as you type.
- **Live previews** — split view, mobile view, and full-screen editor; plus search-result, social-card (Open Graph), structured-data (Schema), and robots previews.
- **Progress tracking** — lesson completion and current-lesson state persist in `localStorage`.
- **Dark/light theme** — modern, responsive Tailwind UI.

## Curriculum

| # | Lesson | What you practice |
| - | ------ | ----------------- |
| 1 | The Power of the H1 | A single `<h1>` in the body |
| 2 | Mastering Meta Descriptions | Meta description + title tag |
| 3 | Visual SEO: Image Alts | `alt` attributes + viewport |
| 4 | Social Cards: Open Graph | `og:title`, `og:description`, `og:image` |
| 5 | Structured Data: JSON-LD | Valid `application/ld+json` schema |
| 6 | Robots & Indexing | `robots` meta directives |

## Getting Started

### Prerequisites

- Node.js 18+

### Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build & start

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

## How it works

- `src/app/SEOContext.js` — the validation rule engine. It parses the current HTML and evaluates each SEO rule (H1, meta, title, alt, canonical, viewport, Open Graph, JSON-LD, robots), marking each as `pending`, `active` (needs fixing), or `completed`.
- `src/data/lessons.json` — defines the curriculum: each lesson declares its `requiredRules` and a starting `initialHtml`.
- `src/app/LessonContext.js` — manages lessons, the current lesson, progress persistence, and lesson validation.
- `src/components/previews/*` — render live previews of how search engines and social platforms would interpret the current markup.

## Directory Structure

```
src/
├── app/
│   ├── layout.js          # Root layout with providers
│   ├── page.js            # Main sandbox (editor + preview + validation)
│   ├── SEOContext.js      # HTML state + SEO rule engine
│   └── LessonContext.js   # Lesson/progress state
├── components/
│   ├── Navbar.js, Sidebar.js
│   ├── RuleCard.js, RuleItem.js, RuleList.js
│   └── previews/          # Meta/OG/Schema/Robots live previews
├── data/lessons.json      # Curriculum data
└── styles/globals.css     # Tailwind + theme styles
```

## Deploy on Vercel

The easiest way is the [Vercel Platform](https://vercel.com/new) (a `vercel.json` is already included):

```bash
npx vercel
```

## License

MIT License. See [LICENSE](LICENSE) for details.

---

**Happy optimizing — climb to the top of the SERPs!**