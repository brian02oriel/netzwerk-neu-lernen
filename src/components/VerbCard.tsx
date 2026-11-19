import { useState } from "react";
import type { VerbView } from "../lib/verbView";

const PERSONS = ["ich", "du", "er/sie/es", "wir", "ihr", "sie/Sie"];
type Tab = "Präsens" | "Perfekt" | "Präteritum" | "Imperativ";

const TAG_ES: Record<string, string> = {
  modal: "modal",
  trennbar: "separable",
  unregelmäßig: "irregular",
  reflexiv: "reflexivo",
};

export default function VerbCard({ verb, showChapter = false }: { verb: VerbView; showChapter?: boolean }) {
  const tabs: Tab[] = ["Präsens"];
  if (verb.perfekt) tabs.push("Perfekt");
  if (verb.praeteritum) tabs.push("Präteritum");
  if (verb.imperativ) tabs.push("Imperativ");
  const [tab, setTab] = useState<Tab>("Präsens");

  const rows: [string, string][] =
    tab === "Imperativ" && verb.imperativ
      ? [
          ["du", verb.imperativ.du],
          ["ihr", verb.imperativ.ihr],
          ["Sie", verb.imperativ.Sie],
        ]
      : PERSONS.map((p, i) => {
          const list = tab === "Präsens" ? verb.present : tab === "Perfekt" ? verb.perfekt : verb.praeteritum;
          return [p, list?.[i] ?? ""];
        });

  return (
    <article id={verb.anchor} className="flex scroll-mt-24 flex-col rounded-2xl border border-line bg-surface p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-xl font-extrabold">{verb.inf}</h3>
          <p className="text-muted">{verb.es}</p>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1">
          {verb.tags.map((t) => (
            <span key={t} className="rounded-full border border-line px-2 py-0.5 text-[11px] font-bold text-muted">
              {TAG_ES[t] ?? t}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-4 flex gap-1 overflow-x-auto rounded-lg bg-surface-2 p-1" role="tablist" aria-label={`Formas de ${verb.inf}`}>
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-md px-2 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
              tab === t ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <table className="mt-3 w-full text-sm" role="tabpanel">
        <tbody>
          {rows.map(([p, f]) => (
            <tr key={p} className="border-b border-line last:border-0">
              <td className="w-24 py-1.5 pr-3 text-muted">{p}</td>
              <td className="py-1.5 font-semibold">{f}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-auto pt-4">
        <p className="border-l-2 border-ink pl-3 text-sm">
          <span className="font-semibold">{verb.example.de}</span>
          <br />
          <span className="text-muted">{verb.example.es}</span>
        </p>
        {showChapter && (
          <a href={verb.chapterHref} className="mt-3 inline-block text-xs font-bold text-muted hover:text-ink">
            Kapitel {verb.chapter} →
          </a>
        )}
      </div>
    </article>
  );
}
