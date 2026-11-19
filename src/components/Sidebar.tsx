import { useEffect, useState } from "react";
import type { NavChapter } from "../data";

interface Props {
  nav: NavChapter[];
  path: string;
  onNavigate?: () => void;
}

export default function Sidebar({ nav, path, onNavigate }: Props) {
  const current = nav.find((c) => path.startsWith(c.href));
  const [openSet, setOpenSet] = useState<Set<number>>(() => new Set(current ? [current.number] : []));
  const [activeHash, setActiveHash] = useState("");

  // Highlight the section currently in view on the chapter page.
  useEffect(() => {
    if (!current) return;
    const ids = current.sections.map((s) => s.href.split("#")[1]);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveHash(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [current]);

  const toggle = (n: number) =>
    setOpenSet((s) => {
      const next = new Set(s);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });

  return (
    <nav aria-label="Capítulos">
      <div className="mb-3 flex items-center justify-between px-2">
        <span className="text-xs font-extrabold tracking-wider text-muted uppercase">Kapitel</span>
        <button
          className="text-xs font-semibold text-muted hover:text-ink"
          onClick={() => setOpenSet((s) => (s.size === nav.length ? new Set() : new Set(nav.map((c) => c.number))))}
        >
          {openSet.size === nav.length ? "Cerrar todo" : "Abrir todo"}
        </button>
      </div>
      <ul className="space-y-0.5">
        {nav.map((c) => {
          const isCurrent = current?.number === c.number;
          const isOpen = openSet.has(c.number);
          return (
            <li key={c.number}>
              <div className={`flex items-center rounded-lg ${isCurrent ? "bg-surface-2" : "hover:bg-surface-2/60"}`}>
                <a
                  href={c.href}
                  onClick={onNavigate}
                  className="flex min-w-0 flex-1 items-baseline gap-2 px-2 py-2"
                  aria-current={isCurrent ? "page" : undefined}
                >
                  <span className="w-5 shrink-0 text-right text-xs font-bold text-muted tabular-nums">{c.number}</span>
                  <span className={`truncate text-sm ${isCurrent ? "font-extrabold" : "font-semibold"}`}>{c.title}</span>
                </a>
                <button
                  onClick={() => toggle(c.number)}
                  className="grid size-8 shrink-0 place-items-center rounded-md text-muted hover:text-ink"
                  aria-expanded={isOpen}
                  aria-label={`${isOpen ? "Cerrar" : "Abrir"} secciones del capítulo ${c.number}`}
                >
                  <svg
                    className={`size-4 transition-transform ${isOpen ? "rotate-90" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  >
                    <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
              {isOpen && (
                <ul className="mt-0.5 mb-2 ml-[1.15rem] border-l border-line pl-3">
                  {c.sections.map((s) => {
                    const active = isCurrent && s.href.endsWith(`#${activeHash}`);
                    return (
                      <li key={s.href}>
                        <a
                          href={s.href}
                          onClick={onNavigate}
                          className={`-ml-[13px] block border-l py-1 pl-3 text-[13px] leading-snug ${
                            active ? "border-ink font-bold text-ink" : "border-transparent text-muted hover:text-ink"
                          }`}
                        >
                          {s.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
