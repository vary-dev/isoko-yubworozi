"use client";
import { useEffect, useRef, useState } from "react";

const languages = [
  { code: "rw", label: "KIN", name: "Kinyarwanda", flag: "🇷🇼" },
  { code: "en", label: "EN", name: "English", flag: "🇬🇧" },
  { code: "fr", label: "FR", name: "Français", flag: "🇫🇷" },
];

function persistLanguage(code: string) {
  document.documentElement.setAttribute("lang", code);
  document.cookie = `googtrans=/en/${code};path=/;SameSite=Lax`;
}

export default function LanguageSwitcher({ isScrolled }: { isScrolled: boolean }) {
  const [current, setCurrent] = useState("en");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("isoko-language");
    const frame = window.requestAnimationFrame(() => {
      if (saved && languages.some((language) => language.code === saved)) setCurrent(saved);
    });

    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", close);
    };
  }, []);

  const changeLanguage = (code: string) => {
    setCurrent(code);
    window.localStorage.setItem("isoko-language", code);
    persistLanguage(code);

    // Google Translate loads lazily; retry briefly instead of silently dropping a selection.
    let attempts = 0;
    const applyTranslation = () => {
      const selectEl = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (selectEl) {
        selectEl.value = code;
        selectEl.dispatchEvent(new Event("change", { bubbles: true }));
        return;
      }
      if (++attempts < 20) window.setTimeout(applyTranslation, 250);
    };
    applyTranslation();
    setOpen(false);
  };

  return (
    <div className="relative notranslate" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Language: ${languages.find((language) => language.code === current)?.name}`}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
          isScrolled
            ? "border-gray-200 text-isoko-dark hover:border-isoko-accent"
            : "border-white/20 text-white hover:border-white/50"
        }`}
      >
        <span className="text-sm leading-none">
          {languages.find((l) => l.code === current)?.flag}
        </span>
        <span>{languages.find((l) => l.code === current)?.label}</span>
        <i aria-hidden="true" className={`fa-solid fa-chevron-down text-[8px] ml-0.5 opacity-60 transition-transform ${open ? "rotate-180" : ""}`}></i>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" aria-hidden="true" onClick={() => setOpen(false)} />
          <div role="listbox" aria-label="Choose language" className="absolute right-0 top-full mt-2 bg-white shadow-xl rounded-xl border border-gray-100 py-1 z-50 min-w-[170px] overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={current === lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition ${
                  current === lang.code
                    ? "text-isoko-accent"
                    : "text-gray-600"
                }`}
              >
                <span className="text-sm leading-none">{lang.flag}</span>
                <span>{lang.name}</span>
                <span className="ml-auto text-[10px] text-gray-400">{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
