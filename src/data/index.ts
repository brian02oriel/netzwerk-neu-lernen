import type { Chapter, Noun, Verb } from "./types";
import { chapters01to04 } from "./chapters/01-04";
import { chapters05to08 } from "./chapters/05-08";
import { chapters09to12 } from "./chapters/09-12";
import { getVerb, VERBS } from "./verbs";
import { url } from "../lib/url";

export const CHAPTERS: Chapter[] = [...chapters01to04, ...chapters05to08, ...chapters09to12];

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const chapterHref = (c: Chapter) => url(`/kapitel/${c.slug}`);
export const anchor = {
  theme: (id: string) => `thema-${id}`,
  grammar: (id: string) => `grammatik-${id}`,
  verb: (inf: string) => `verb-${slugify(inf)}`,
  noun: (de: string) => `nomen-${slugify(de)}`,
};

/** First chapter in which each verb appears. */
export const VERB_CHAPTER: Record<string, Chapter> = {};
for (const c of CHAPTERS) {
  for (const inf of c.verbs) {
    getVerb(inf); // throws on typos at build time
    VERB_CHAPTER[inf] ??= c;
  }
}

export interface NounEntry extends Noun {
  chapter: Chapter;
  themeTitle: string;
}

export const ALL_NOUNS: NounEntry[] = (() => {
  const seen = new Set<string>();
  const out: NounEntry[] = [];
  for (const c of CHAPTERS)
    for (const t of c.themes)
      for (const n of t.nouns) {
        const key = `${n.article} ${n.de}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ ...n, chapter: c, themeTitle: t.title });
      }
  return out.sort((a, b) => a.de.localeCompare(b.de, "de"));
})();

export const ALL_VERBS: Array<Verb & { chapter: Chapter }> = VERBS.filter((v) => VERB_CHAPTER[v.inf])
  .map((v) => ({ ...v, chapter: VERB_CHAPTER[v.inf] }))
  .sort((a, b) => a.inf.localeCompare(b.inf, "de"));

/* ——— Navigation & search ——— */

export interface NavChapter {
  number: number;
  title: string;
  titleEs: string;
  href: string;
  sections: { label: string; href: string }[];
}

export const NAV: NavChapter[] = CHAPTERS.map((c) => ({
  number: c.number,
  title: c.title,
  titleEs: c.titleEs,
  href: chapterHref(c),
  sections: [
    ...c.themes.map((t) => ({ label: t.title, href: `${chapterHref(c)}#${anchor.theme(t.id)}` })),
    { label: "Verben", href: `${chapterHref(c)}#verben` },
    ...c.grammar.map((g) => ({ label: g.title, href: `${chapterHref(c)}#${anchor.grammar(g.id)}` })),
    { label: "Aussprache", href: `${chapterHref(c)}#aussprache` },
    { label: "Übungen", href: `${chapterHref(c)}#uebungen` },
  ],
}));

export type SearchKind = "Kapitel" | "Thema" | "Grammatik" | "Verb" | "Nomen" | "Redemittel";

export interface SearchItem {
  kind: SearchKind;
  title: string;
  subtitle: string;
  href: string;
  /** Extra text that should match but is not displayed. */
  keywords: string;
  chapter: number;
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const c of CHAPTERS) {
    const base = chapterHref(c);
    items.push({
      kind: "Kapitel",
      title: `${c.number}. ${c.title}`,
      subtitle: c.titleEs,
      href: base,
      keywords: `kapitel ${c.number} capítulo ${c.summary}`,
      chapter: c.number,
    });
    for (const t of c.themes) {
      items.push({
        kind: "Thema",
        title: t.title,
        subtitle: `${t.titleEs} · Kapitel ${c.number}`,
        href: `${base}#${anchor.theme(t.id)}`,
        keywords: t.intro,
        chapter: c.number,
      });
      for (const n of t.nouns)
        items.push({
          kind: "Nomen",
          title: `${n.article} ${n.de}`,
          subtitle: `${n.es}${n.plural ? ` · Pl. die ${n.plural}` : ""}`,
          href: `${base}#${anchor.noun(n.de)}`,
          keywords: `${n.de} ${n.plural ?? ""}`,
          chapter: c.number,
        });
      for (const p of t.phrases)
        items.push({
          kind: "Redemittel",
          title: p.de,
          subtitle: p.es,
          href: `${base}#${anchor.theme(t.id)}`,
          keywords: "",
          chapter: c.number,
        });
    }
    for (const g of c.grammar)
      items.push({
        kind: "Grammatik",
        title: g.title,
        subtitle: `${g.titleEs} · Kapitel ${c.number}`,
        href: `${base}#${anchor.grammar(g.id)}`,
        keywords: g.explanation.join(" ").replace(/\*\*/g, ""),
        chapter: c.number,
      });
  }
  for (const v of ALL_VERBS)
    items.push({
      kind: "Verb",
      title: v.inf,
      subtitle: `${v.es} · ${v.aux === "sein" ? "ist" : "hat"} ${v.partizip || "—"}`,
      href: `${chapterHref(v.chapter)}#${anchor.verb(v.inf)}`,
      keywords: `${(v.tags ?? []).join(" ")} ${v.present?.join(" ") ?? ""}`,
      chapter: v.chapter.number,
    });
  return items;
}
