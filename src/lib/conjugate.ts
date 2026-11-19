import type { SixForms, Verb } from "../data/types";

const HABEN: SixForms = ["habe", "hast", "hat", "haben", "habt", "haben"];
const SEIN: SixForms = ["bin", "bist", "ist", "sind", "seid", "sind"];

/** Base verb without separable prefix: "aufstehen" -> "stehen". */
function baseInfinitive(v: Verb): string {
  return v.prefix ? v.inf.slice(v.prefix.length) : v.inf;
}

/** Stem used for endings plus the type of infinitive ending. */
function splitStem(inf: string): { stem: string; kind: "en" | "eln" | "ern" | "n" } {
  if (inf.endsWith("eln")) return { stem: inf.slice(0, -1), kind: "eln" };
  if (inf.endsWith("ern")) return { stem: inf.slice(0, -1), kind: "ern" };
  if (inf.endsWith("en")) return { stem: inf.slice(0, -2), kind: "en" };
  return { stem: inf.slice(0, -1), kind: "n" };
}

/** Stems ending in -t, -d, or consonant + m/n (öffnen, atmen, regnen) need an extra -e-. */
function needsE(stem: string): boolean {
  return /[td]$/.test(stem) || /[^aeiouäöülrhmn][mn]$/.test(stem);
}

/** Stems ending in s, ß, z, x only add -t in the du-form (du heißt). */
function sibilant(stem: string): boolean {
  return /(s|ß|z|x)$/.test(stem);
}

export function presentForms(v: Verb): SixForms {
  let forms: SixForms;
  if (v.present) {
    forms = [...v.present] as SixForms;
  } else {
    const inf = baseInfinitive(v);
    const { stem, kind } = splitStem(inf);
    if (kind === "eln") {
      // sammeln: ich sammle, du sammelst
      const short = stem.slice(0, -2) + "l";
      forms = [short + "e", stem + "st", stem + "t", inf, stem + "t", inf];
    } else if (kind === "ern" || kind === "n") {
      forms = [stem + "e", stem + "st", stem + "t", inf, stem + "t", inf];
    } else {
      const e = needsE(stem) ? "e" : "";
      const changed = v.stemChange;
      let du: string;
      let er: string;
      if (changed) {
        // With a vowel change there is no extra -e- (du hältst, er hält)
        du = sibilant(changed) ? changed + "t" : changed + "st";
        er = /t$/.test(changed) ? changed : changed + "t";
      } else {
        du = sibilant(stem) ? stem + e + "t" : stem + e + "st";
        er = stem + e + "t";
      }
      forms = [stem + "e", du, er, inf, stem + e + "t", inf];
    }
  }
  return v.prefix ? (forms.map((f) => `${f} ${v.prefix}`) as SixForms) : forms;
}

export function perfektForms(v: Verb): SixForms | null {
  if (!v.partizip) return null;
  const aux = v.aux === "sein" ? SEIN : HABEN;
  return aux.map((a) => `${a} ${v.partizip}`) as SixForms;
}

export function imperativForms(v: Verb): { du: string; ihr: string; Sie: string } | null {
  if (v.imperativ !== undefined) return v.imperativ;
  if (v.tags?.includes("modal")) return null;
  const inf = baseInfinitive(v);
  const { stem, kind } = splitStem(inf);
  const present = presentForms({ ...v, inf, prefix: undefined });
  const p = v.prefix ? ` ${v.prefix}` : "";
  let du: string;
  if (kind === "eln") du = stem.slice(0, -2) + "le";
  else if (kind === "ern" || kind === "n") du = stem + "e";
  // e -> i / ie changes are kept in the imperative (nimm!, lies!); a -> ä is not (fahr!)
  else if (v.stemChange && /i/.test(v.stemChange) && !/i/.test(stem)) du = v.stemChange;
  // -e is required after t/d (Arbeite!) and sounds natural after -s/-ß, -ig, -nn (Reise!, Besichtige!, Beginne!)
  else du = needsE(stem) || /(s|ß|ig|nn)$/.test(stem) ? stem + "e" : stem;
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return {
    du: `${cap(du)}${p}!`,
    ihr: `${cap(present[4])}${p}!`,
    Sie: `${cap(inf)} Sie${p}!`,
  };
}
