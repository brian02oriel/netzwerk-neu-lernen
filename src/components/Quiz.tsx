import { useState } from "react";
import type { Exercise } from "../data/types";

type State = "idle" | "right" | "wrong" | "shown";

const norm = (s: string) => s.trim().replace(/\s+/g, " ").toLowerCase();

export default function Quiz({ exercises }: { exercises: Exercise[] }) {
  const [values, setValues] = useState<string[]>(() => exercises.map(() => ""));
  const [states, setStates] = useState<State[]>(() => exercises.map(() => "idle"));

  const check = (i: number) =>
    setStates((s) => s.map((st, k) => (k === i ? (norm(values[i]) === norm(exercises[i].answer) ? "right" : "wrong") : st)));
  const checkAll = () =>
    setStates(exercises.map((e, i) => (values[i] ? (norm(values[i]) === norm(e.answer) ? "right" : "wrong") : "idle")));
  const reveal = (i: number) => setStates((s) => s.map((st, k) => (k === i ? "shown" : st)));
  const reset = () => {
    setValues(exercises.map(() => ""));
    setStates(exercises.map(() => "idle"));
  };
  const correct = states.filter((s) => s === "right").length;

  return (
    <div className="rounded-2xl border border-line bg-surface">
      <ol className="divide-y divide-line">
        {exercises.map((ex, i) => {
          const [before, after = ""] = ex.prompt.split("___");
          const st = states[i];
          return (
            <li key={i} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
              <span className="text-sm font-bold text-muted tabular-nums">{i + 1}.</span>
              <label className="flex flex-1 flex-wrap items-center gap-x-2 gap-y-1 leading-relaxed">
                <span>{before}</span>
                <input
                  value={values[i]}
                  onChange={(e) => {
                    const v = e.target.value;
                    setValues((vals) => vals.map((x, k) => (k === i ? v : x)));
                    if (st !== "idle") setStates((s) => s.map((x, k) => (k === i ? "idle" : x)));
                  }}
                  onKeyDown={(e) => e.key === "Enter" && check(i)}
                  className={`w-36 rounded-md border bg-bg px-2 py-1 font-semibold outline-none focus:border-ink ${
                    st === "right" ? "border-ink border-2" : st === "wrong" ? "border-dashed border-muted" : "border-line"
                  }`}
                  aria-label={`Respuesta ${i + 1}`}
                  aria-invalid={st === "wrong"}
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <span>{after}</span>
                {ex.hint && <span className="text-xs text-muted">({ex.hint})</span>}
              </label>
              <div className="flex items-center gap-2 text-sm">
                {st === "right" && <span className="font-extrabold">✓ Richtig</span>}
                {st === "wrong" && <span className="font-semibold text-muted">✗ Inténtalo otra vez</span>}
                {st === "shown" && (
                  <span>
                    <span className="text-muted">Solución: </span>
                    <strong>{ex.answer}</strong>
                  </span>
                )}
                {st !== "right" && st !== "shown" && (
                  <>
                    <button onClick={() => check(i)} className="rounded-md bg-ink px-3 py-1 text-xs font-bold text-bg">
                      Comprobar
                    </button>
                    <button onClick={() => reveal(i)} className="rounded-md px-2 py-1 text-xs font-semibold text-muted hover:text-ink">
                      Ver
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      <div className="flex flex-wrap items-center gap-3 border-t border-line p-4">
        <button onClick={checkAll} className="rounded-lg bg-ink px-4 py-2 text-sm font-bold text-bg">
          Comprobar todo
        </button>
        <button onClick={reset} className="rounded-lg border border-line px-4 py-2 text-sm font-bold">
          Reiniciar
        </button>
        <span className="ml-auto text-sm font-semibold text-muted" aria-live="polite">
          {correct} / {exercises.length} correctas
        </span>
      </div>
    </div>
  );
}
