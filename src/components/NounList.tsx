import { useMemo, useState } from "react";
import type { Article } from "../data/types";

export interface NounRow {
  de: string;
  article: Article;
  plural: string | null;
  es: string;
  chapter: number;
  href: string;
  theme: string;
}

const fold = (s: string) =>
  s.toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[̀-ͯ]/g, "");

const ARTICLES: Array<Article | "alle"> = ["alle", "der", "die", "das"];

export default function NounList({ nouns }: { nouns: NounRow[] }) {
  const [q, setQ] = useState("");
  const [article, setArticle] = useState<Article | "alle">("alle");
  const [chapter, setChapter] = useState(0);
  const [hideEs, setHideEs] = useState(false);

  const list = useMemo(() => {
    const fq = fold(q.trim());
    return nouns.filter(
      (n) =>
        (article === "alle" || n.article === article) &&
        (!chapter || n.chapter === chapter) &&
        (!fq || [n.de, n.es, n.plural ?? ""].some((s) => fold(s).includes(fq))),
    );
  }, [nouns, q, article, chapter]);

  return (
    <div>
      <div className="sticky top-16 z-10 -mx-4 mb-6 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filtrar en alemán o español…"
            className="h-10 flex-1 rounded-lg border border-line bg-surface px-3 text-sm font-medium outline-none focus:border-ink"
            aria-label="Filtrar sustantivos"
          />
          <select
            value={chapter}
            onChange={(e) => setChapter(Number(e.target.value))}
            className="h-10 rounded-lg border border-line bg-surface px-2 text-sm font-semibold"
            aria-label="Capítulo"
          >
            <option value={0}>Todos los capítulos</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i + 1}>
                Kapitel {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {ARTICLES.map((a) => (
            <button
              key={a}
              onClick={() => setArticle(a)}
              className={`rounded-full px-3 py-1 text-xs font-bold ${article === a ? "bg-ink text-bg" : "bg-surface-2 text-muted hover:text-ink"}`}
            >
              {a === "alle" ? "Todos" : a}
            </button>
          ))}
          <label className="ml-2 flex items-center gap-1.5 text-xs font-semibold text-muted">
            <input type="checkbox" checked={hideEs} onChange={(e) => setHideEs(e.target.checked)} className="accent-zinc-900 dark:accent-zinc-100" />
            Ocultar traducción (modo repaso)
          </label>
          <span className="ml-auto text-xs font-semibold text-muted">{list.length} palabras</span>
        </div>
      </div>
      <NounTable nouns={list} hideEs={hideEs} showChapter />
    </div>
  );
}

export function NounTable({ nouns, hideEs = false, showChapter = false }: { nouns: NounRow[]; hideEs?: boolean; showChapter?: boolean }) {
  if (!nouns.length) return <p className="py-16 text-center text-muted">Ninguna palabra coincide con el filtro.</p>;
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-2 text-xs font-extrabold tracking-wide text-muted uppercase">
          <tr>
            <th className="px-4 py-2.5">Singular</th>
            <th className="hidden px-4 py-2.5 sm:table-cell">Plural</th>
            <th className="px-4 py-2.5">Español</th>
            {showChapter && <th className="hidden px-4 py-2.5 text-right md:table-cell">Kap.</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {nouns.map((n) => (
            <tr key={`${n.article}-${n.de}`}>
              <td className="px-4 py-2.5">
                <span className="inline-block w-8 font-medium text-muted">{n.article}</span>
                <span className="font-bold">{n.de}</span>
                <span className="block text-xs text-muted sm:hidden">{n.plural ? `die ${n.plural}` : "sin plural"}</span>
              </td>
              <td className="hidden px-4 py-2.5 sm:table-cell">{n.plural ? `die ${n.plural}` : <span className="text-muted">—</span>}</td>
              <td className="px-4 py-2.5">
                {hideEs ? (
                  <details>
                    <summary className="cursor-pointer text-muted select-none">mostrar</summary>
                    {n.es}
                  </details>
                ) : (
                  n.es
                )}
              </td>
              {showChapter && (
                <td className="hidden px-4 py-2.5 text-right md:table-cell">
                  <a href={n.href} className="font-semibold text-muted hover:text-ink">
                    {n.chapter}
                  </a>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
