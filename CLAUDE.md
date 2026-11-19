# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A project for learning German based on the *Netzwerk neu* textbook series (see `README.md`).

## Stack & commands

Astro 7 + React 19 islands + Tailwind CSS v4 (via `@tailwindcss/vite`), font Hubot Sans (`@fontsource-variable/hubot-sans`), search with Fuse.js. Package manager: **pnpm**.

- `pnpm dev` — dev server (runs detached; `pnpm astro dev stop` to stop)
- `pnpm build` — `astro check` (type-check) + static build to `dist/`

## Architecture

- `src/data/types.ts` — content model (Chapter → Themes → Nouns/Phrases, Grammar, Exercises).
- `src/data/chapters/*.ts` — chapter content. All study content is original (not copied from the textbook); UI and explanations are in Spanish.
- `src/data/verbs.ts` — single verb dictionary; chapters reference verbs by infinitive (a typo throws at build time).
- `src/lib/conjugate.ts` — generates Präsens/Perfekt/Imperativ from rules (`stemChange`, `prefix`, overrides). Check generated forms after adding verbs.
- `src/data/index.ts` — nav, anchors and the search index. Pages in `src/pages/`; interactive pieces are React in `src/components/`.
- Colors: monochrome zinc tokens (`bg`, `surface`, `ink`, `muted`, `line`) in `src/styles/global.css`; dark mode via `.dark` class.

## Repository layout quirk

There is a nested directory `netzwerk-neu-lernen/` that contains its own `.git` (an empty repo with no commits, same `origin` remote as the outer repo). The outer git repo shows it as untracked. It is likely an accidental second `git init`/clone; confirm with the user before adding code there, deleting it, or committing it, since committing it would create an embedded repository rather than regular files.
