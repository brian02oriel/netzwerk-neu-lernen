# Netzwerk neu A1 · Lernhilfe

Study site for learning German at level A1, organized by the chapters and themes of the *Netzwerk neu A1* Kursbuch and Übungsbuch. It includes vocabulary with Spanish translations, verbs with their conjugations, grammar explanations and practice exercises.

> All study content is original material organized around the book's themes. It does not reproduce the textbook's texts or exercises; use it as a companion to the book.

## Features

- **12 chapters**: learning goals, vocabulary by theme, useful phrases, verbs, grammar, a pronunciation tip and self-check exercises.
- **Verbs**: Spanish translation plus Präsens, Perfekt (with haben/sein), Präteritum (where relevant at A1) and Imperativ.
- **Nouns**: article, plural and Spanish translation, with filters by article and a review mode.
- **Search** (`⌘K` / `Ctrl+K` / `/`): fuzzy, accent-insensitive (`kuche` → *Küche*), in German or Spanish, filterable by type and chapter.
- **Navigation**: collapsible chapter sidebar with active-section highlighting, and a mobile drawer.
- **Design**: Hubot Sans, a monochrome palette, and light and dark modes.

## Tech stack

| Tool | Version | Purpose |
| --- | --- | --- |
| [Astro](https://astro.build) | 7 | Static site generator, pages and routing |
| [React](https://react.dev) | 19 | Interactive islands (search, menu, verb tabs, exercises) |
| [Tailwind CSS](https://tailwindcss.com) | 4 | Styling, via `@tailwindcss/vite` |
| [Fuse.js](https://www.fusejs.io) | 7 | Fuzzy search |
| [Hubot Sans](https://github.com/github/hubot-sans) | — | Font, via `@fontsource-variable/hubot-sans` |
| TypeScript | 5 | Strict type-checking with `astro check` |

## Requirements

- **Node.js** 22 or newer (tested with 23.10)
- **pnpm** 9 or newer. If you don't have it, enable it with Corepack (bundled with Node.js):

  ```bash
  corepack enable pnpm
  ```

## Getting started

```bash
# 1. Clone the repository
git clone <repository-url>
cd netzwerk-neu-lernen

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

Open <http://localhost:4321> in your browser.

> The Astro dev server runs in the background. Use `pnpm astro dev status` to check it, `pnpm astro dev logs` to see its output, and `pnpm astro dev stop` to stop it.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the dev server with hot reload at `localhost:4321` |
| `pnpm build` | Type-check (`astro check`) and build the static site into `dist/` |
| `pnpm preview` | Serve the production build from `dist/` locally |
| `pnpm astro …` | Run any Astro CLI command |

## Deployment

`pnpm build` produces a fully static site in `dist/`, so it can be hosted on any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, …):

- **Build command:** `pnpm build`
- **Output directory:** `dist`

## Configuration files

| File | Purpose |
| --- | --- |
| `astro.config.mjs` | Registers the React integration and the Tailwind Vite plugin |
| `tsconfig.json` | Extends Astro's strict TS config; React JSX settings |
| `src/styles/global.css` | Tailwind import, Hubot Sans, monochrome color tokens, dark mode |
| `package.json` / `pnpm-lock.yaml` | Dependencies and scripts (use pnpm, not npm) |

## Project structure

```
src/
├── components/        # React islands (SearchBar, Sidebar, VerbCard, Quiz, …) and Astro blocks
├── data/
│   ├── types.ts       # Content model: Chapter → Themes → Nouns / Phrases, Grammar, Exercises
│   ├── chapters/      # Chapter content (01-04.ts, 05-08.ts, 09-12.ts)
│   ├── verbs.ts       # Shared verb dictionary (referenced by infinitive)
│   └── index.ts       # Navigation, anchors and search index
├── layouts/Layout.astro
├── lib/
│   ├── conjugate.ts   # Rule-based conjugation (Präsens, Perfekt, Imperativ)
│   └── verbView.ts    # Precomputes verb forms for the UI
├── pages/
│   ├── index.astro            # Home: search and chapter grid
│   ├── kapitel/[slug].astro   # One page per chapter
│   ├── verben.astro           # All verbs
│   ├── wortschatz.astro       # All nouns
│   └── grammatik.astro        # Grammar overview
└── styles/global.css
```

## Editing content

- **Add a word or phrase:** edit the relevant theme in `src/data/chapters/*.ts`.
- **Add a verb:** add it to `src/data/verbs.ts` and list its infinitive in the chapter's `verbs` array. An unknown infinitive fails the build.
  - Irregular stem in du/er: set `stemChange` (e.g. `"nimm"` for *nehmen*).
  - Separable verb: set `prefix` (e.g. `"auf"` for *aufstehen*).
  - Fully irregular: give `present` (six forms) and optionally `praeteritum` and `imperativ`.
  - Check the generated forms on `/verben` after adding verbs.
- **Colors:** change the tokens (`--bg`, `--surface`, `--text`, `--muted`, `--border`) in `src/styles/global.css`.
