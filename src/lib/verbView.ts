import type { Verb } from "../data/types";
import { imperativForms, perfektForms, presentForms } from "./conjugate";

export interface VerbView {
  inf: string;
  es: string;
  tags: string[];
  aux: "haben" | "sein";
  partizip: string;
  example: { de: string; es: string };
  chapter: number;
  chapterHref: string;
  anchor: string;
  present: string[];
  perfekt: string[] | null;
  praeteritum: string[] | null;
  imperativ: { du: string; ihr: string; Sie: string } | null;
}

export function toVerbView(v: Verb, chapter: { number: number; href: string }, anchor: string): VerbView {
  return {
    inf: v.inf,
    es: v.es,
    tags: v.tags ?? [],
    aux: v.aux,
    partizip: v.partizip,
    example: v.example,
    chapter: chapter.number,
    chapterHref: chapter.href,
    anchor,
    present: presentForms(v),
    perfekt: perfektForms(v),
    praeteritum: v.praeteritum ?? null,
    imperativ: imperativForms(v),
  };
}
