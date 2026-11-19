import Fuse from "fuse.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SearchItem, SearchKind } from "../data";

const KINDS: SearchKind[] = ["Kapitel", "Thema", "Grammatik", "Verb", "Nomen", "Redemittel"];
const KIND_ES: Record<SearchKind, string> = {
  Kapitel: "Capítulos",
  Thema: "Temas",
  Grammatik: "Gramática",
  Verb: "Verbos",
  Nomen: "Sustantivos",
  Redemittel: "Frases",
};
const OPEN_EVENT = "open-search";

/** Lowercase, ß→ss, strip diacritics and umlaut spellings so "ae", "ä" and "a" all match. */
function fold(s: string): string {
  return s
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/ae/g, "a")
    .replace(/oe/g, "o")
    .replace(/ue/g, "u")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/** Per-character fold that keeps string length, used only for highlighting. */
const foldChar = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function Highlight({ text, query }: { text: string; query: string }) {
  const tokens = query.trim().split(/\s+/).filter((t) => t.length > 1).map(foldChar);
  if (!tokens.length) return <>{text}</>;
  const folded = foldChar(text);
  const marks = new Array(text.length).fill(false);
  for (const t of tokens) {
    let i = folded.indexOf(t);
    while (i !== -1) {
      for (let k = i; k < i + t.length; k++) marks[k] = true;
      i = folded.indexOf(t, i + t.length);
    }
  }
  const out: React.ReactNode[] = [];
  let buf = "";
  let on = marks[0];
  for (let i = 0; i <= text.length; i++) {
    if (i === text.length || marks[i] !== on) {
      out.push(on ? <mark key={i} className="rounded-sm bg-ink/15 text-inherit">{buf}</mark> : buf);
      buf = "";
      on = marks[i];
    }
    if (i < text.length) buf += text[i];
  }
  return <>{out}</>;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-sans text-[11px] font-semibold text-muted">
      {children}
    </kbd>
  );
}

interface Props {
  items: SearchItem[];
  /** "header" owns the dialog + shortcuts; "hero" is a large trigger only. */
  variant: "header" | "hero";
}

export default function SearchBar({ items, variant }: Props) {
  if (variant === "hero") return <HeroTrigger />;
  return <SearchDialog items={items} />;
}

/** Large search field on the home page. It hands focus to the dialog immediately so no keystroke is lost. */
function HeroTrigger() {
  const open = () => window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: "" }));
  return (
    <button
      type="button"
      onClick={open}
      onFocus={open}
      aria-label="Buscar"
      className="relative flex h-16 w-full items-center rounded-2xl border border-line bg-surface pr-24 pl-14 text-left text-lg font-medium text-muted shadow-sm transition-colors outline-none hover:border-ink/40 focus:border-ink"
    >
      <SearchIcon className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2" />
      <span className="truncate">Busca un verbo, palabra, tema o capítulo…</span>
      <span className="pointer-events-none absolute top-1/2 right-5 hidden -translate-y-1/2 gap-1 sm:flex">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </span>
    </button>
  );
}

function SearchDialog({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<SearchKind | "Alle">("Alle");
  const [chapter, setChapter] = useState<number | 0>(0);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(items, {
        keys: [
          { name: "title", weight: 3 },
          { name: "subtitle", weight: 2 },
          { name: "keywords", weight: 0.4 },
        ],
        threshold: 0.32,
        ignoreLocation: true,
        includeScore: true,
        getFn: (obj, path) => {
          const v = Fuse.config.getFn(obj, path);
          if (typeof v === "string") return fold(v);
          return v ? v.map(fold) : "";
        },
      }),
    [items],
  );

  const results = useMemo(() => {
    const scoped = (i: SearchItem) => (kind === "Alle" || i.kind === kind) && (!chapter || i.chapter === chapter);
    const q = query.trim();
    if (!q) {
      const base = items.filter(scoped);
      return kind === "Alle" && !chapter ? base.filter((i) => i.kind === "Kapitel") : base.slice(0, 60);
    }
    const found = fuse.search(fold(q)).map((r) => r.item).filter(scoped);
    if (kind !== "Alle") return found.slice(0, 60);
    // Group by kind, best-scoring groups first, a few per group
    const groups = new Map<SearchKind, SearchItem[]>();
    for (const r of found) {
      const g = groups.get(r.kind) ?? [];
      if (g.length < 6) g.push(r);
      groups.set(r.kind, g);
    }
    return [...groups.values()].flat();
  }, [query, kind, chapter, fuse, items]);

  const show = useCallback((q = "") => {
    setQuery(q);
    setActive(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.closest("input, textarea, [contenteditable=true]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        show();
      }
    };
    const onOpen = (e: Event) => show((e as CustomEvent<string>).detail ?? "");
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, [show]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => setActive(0), [query, kind, chapter]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (item: SearchItem | undefined) => {
    if (!item) return;
    setOpen(false);
    window.location.href = item.href;
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  let lastKind: SearchKind | null = null;

  return (
    <>
      <button
        type="button"
        onClick={() => show()}
        className="flex h-10 w-full min-w-0 items-center gap-2 rounded-lg border border-line bg-surface px-3 text-sm text-muted transition-colors hover:border-ink/40 sm:w-72"
        aria-label="Buscar (Ctrl+K)"
      >
        <SearchIcon className="size-4 shrink-0" />
        <span className="truncate">Buscar…</span>
        <span className="ml-auto hidden gap-1 sm:flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-zinc-950/50 p-3 pt-[8vh] backdrop-blur-sm sm:p-6 sm:pt-[12vh]"
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Buscar"
            className="flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <SearchIcon className="size-5 shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="z. B. nehmen, Küche, Akkusativ, comer…"
                className="h-14 w-full bg-transparent text-base font-medium outline-none placeholder:text-muted"
                role="combobox"
                aria-expanded="true"
                aria-controls="search-results"
                aria-activedescendant={results[active] ? `sr-${active}` : undefined}
                autoComplete="off"
                spellCheck={false}
              />
              <button onClick={() => setOpen(false)} className="shrink-0" aria-label="Cerrar">
                <Kbd>Esc</Kbd>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 border-b border-line px-4 py-2.5">
              {(["Alle", ...KINDS] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    setKind(k);
                    inputRef.current?.focus();
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                    kind === k ? "bg-ink text-bg" : "bg-surface-2 text-muted hover:text-ink"
                  }`}
                >
                  {k === "Alle" ? "Todo" : KIND_ES[k]}
                </button>
              ))}
              <select
                value={chapter}
                onChange={(e) => setChapter(Number(e.target.value))}
                className="ml-auto rounded-full border border-line bg-surface px-2 py-1 text-xs font-bold text-muted outline-none"
                aria-label="Filtrar por capítulo"
              >
                <option value={0}>Todos los capítulos</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Kapitel {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div ref={listRef} id="search-results" role="listbox" className="overflow-y-auto p-2">
              {results.length === 0 && (
                <p className="px-3 py-10 text-center text-sm text-muted">
                  Sin resultados para «{query}». Prueba con la palabra en español o sin artículo.
                </p>
              )}
              {results.map((item, i) => {
                const header = item.kind !== lastKind;
                lastKind = item.kind;
                return (
                  <div key={`${item.href}-${item.title}-${i}`}>
                    {header && (
                      <div className="px-3 pt-3 pb-1 text-[11px] font-extrabold tracking-wider text-muted uppercase">
                        {KIND_ES[item.kind]}
                      </div>
                    )}
                    <a
                      id={`sr-${i}`}
                      data-index={i}
                      role="option"
                      aria-selected={i === active}
                      href={item.href}
                      onMouseMove={() => setActive(i)}
                      onClick={(e) => {
                        e.preventDefault();
                        go(item);
                      }}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${i === active ? "bg-surface-2" : ""}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-bold">
                          <Highlight text={item.title} query={query} />
                        </div>
                        <div className="truncate text-sm text-muted">
                          <Highlight text={item.subtitle} query={query} />
                        </div>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-muted">K{item.chapter}</span>
                    </a>
                  </div>
                );
              })}
            </div>

            <div className="hidden items-center gap-4 border-t border-line px-4 py-2 text-xs text-muted sm:flex">
              <span className="flex items-center gap-1">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> navegar
              </span>
              <span className="flex items-center gap-1">
                <Kbd>↵</Kbd> abrir
              </span>
              <span className="ml-auto">Busca en alemán o en español</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}
