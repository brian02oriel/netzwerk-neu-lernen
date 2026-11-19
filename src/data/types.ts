export type Article = "der" | "die" | "das";

/** Persons in the fixed order: ich, du, er/sie/es, wir, ihr, sie/Sie */
export type SixForms = [string, string, string, string, string, string];

export const PERSONS = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"] as const;

export interface Noun {
  de: string;
  article: Article;
  /** Plural form without article. `null` = only singular. */
  plural: string | null;
  es: string;
}

export interface Phrase {
  de: string;
  es: string;
}

export interface Verb {
  inf: string;
  es: string;
  /** Separable prefix, e.g. "auf" for "aufstehen". */
  prefix?: string;
  /** Changed stem for du / er-sie-es, e.g. "nimm" (nehmen), "fähr" (fahren). */
  stemChange?: string;
  /** Full Präsens override for irregular verbs. */
  present?: SixForms;
  aux: "haben" | "sein";
  partizip: string;
  /** Only given where it matters at A1 (sein, haben, modal verbs …). */
  praeteritum?: SixForms;
  /** Override for imperative; `null` = verb has no usual imperative (modals). */
  imperativ?: { du: string; ihr: string; Sie: string } | null;
  tags?: Array<"modal" | "trennbar" | "unregelmäßig" | "reflexiv">;
  example: Phrase;
}

export interface GrammarTable {
  headers: string[];
  rows: string[][];
}

export interface Grammar {
  id: string;
  title: string;
  titleEs: string;
  /** Explanation in Spanish, one string per paragraph. Supports **bold**. */
  explanation: string[];
  table?: GrammarTable;
  examples: Phrase[];
  tip?: string;
}

export interface Theme {
  id: string;
  title: string;
  titleEs: string;
  intro: string;
  nouns: Noun[];
  phrases: Phrase[];
}

export interface Exercise {
  /** Sentence with a gap written as "___". */
  prompt: string;
  answer: string;
  hint?: string;
}

export interface Chapter {
  number: number;
  slug: string;
  title: string;
  titleEs: string;
  summary: string;
  /** Can-do goals (Kursbuch), in Spanish. */
  goals: string[];
  themes: Theme[];
  /** Infinitives referencing the shared verb dictionary. */
  verbs: string[];
  grammar: Grammar[];
  pronunciation: { title: string; text: string; examples: string[] };
  /** Practice items in the spirit of the Übungsbuch (original). */
  exercises: Exercise[];
}
