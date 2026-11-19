import { useEffect, useState } from "react";
import type { NavChapter } from "../data";
import Sidebar from "./Sidebar";

const LINKS = [
  { href: "/", label: "Kapitel" },
  { href: "/verben", label: "Verben" },
  { href: "/wortschatz", label: "Wortschatz" },
  { href: "/grammatik", label: "Grammatik" },
];

export default function MobileNav({ nav, path }: { nav: NavChapter[]; path: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="-ml-2 grid size-10 place-items-center rounded-lg hover:bg-surface-2 lg:hidden"
        aria-label="Abrir menú"
        aria-expanded={open}
      >
        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-zinc-950/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm flex-col bg-bg shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <span className="font-extrabold">Menú</span>
              <button
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-lg hover:bg-surface-2"
                aria-label="Cerrar menú"
              >
                <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6 grid grid-cols-2 gap-2">
                {LINKS.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="rounded-lg border border-line bg-surface px-3 py-2.5 text-sm font-bold"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
              <Sidebar nav={nav} path={path} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
