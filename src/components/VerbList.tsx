import { useMemo, useState } from "react";
import type { VerbView } from "../lib/verbView";
import VerbCard from "./VerbCard";

const fold = (s: string) =>
  s.toLowerCase().replace(/ß/g, "ss").normalize("NFD").replace(/[̀-ͯ]/g, "");

const FILTERS = [
  { id: "alle", label: "Todos" },
  { id: "unregelmäßig", label: "Irregulares" },
  { id: "trennbar", label: "Separables" },
  { id: "modal", label: "Modales" },
  { id: "sein", label: "Perfekt con sein" },
] as const;

export default function VerbList({ verbs }: { verbs: VerbView[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("alle");
  const [chapter, setChapter] = useState(0);

  const list = useMemo(() => {
    const fq = fold(q.trim());
    return verbs.filter((v) => {
      if (chapter && v.chapter !== chapter) return false;
      if (filter === "sein" && v.aux !== "sein") return false;
      if (filter !== "alle" && filter !== "sein" && !v.tags.includes(filter)) return false;
      if (!fq) return true;
      return [v.inf, v.es, v.partizip, ...v.present].some((s) => fold(s).includes(fq));
    });
  }, [verbs, q, filter, chapter]);

  return (
    <div>
      <div className="sticky top-16 z-10 -mx-4 mb-6 border-b border-line bg-bg/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filtrar: infinitivo, forma conjugada o español…"
            className="h-10 flex-1 rounded-lg border border-line bg-surface px-3 text-sm font-medium outline-none focus:border-ink"
            aria-label="Filtrar verbos"
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
        <div className="mt-3 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3 py-1 text-xs font-bold ${filter === f.id ? "bg-ink text-bg" : "bg-surface-2 text-muted hover:text-ink"}`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto self-center text-xs font-semibold text-muted">{list.length} verbos</span>
        </div>
      </div>
      {list.length === 0 ? (
        <p className="py-16 text-center text-muted">Ningún verbo coincide con el filtro.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((v) => (
            <VerbCard key={v.inf} verb={v} showChapter />
          ))}
        </div>
      )}
    </div>
  );
}
