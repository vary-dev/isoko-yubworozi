"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    google?: any;
  }
}

const languages = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "rw", label: "KINY", flag: "🇷🇼" },
  { code: "fr", label: "FR", flag: "🇫🇷" },
];

export default function LanguageSwitcher({ isScrolled }: { isScrolled: boolean }) {
  const [current, setCurrent] = useState("en");
  const [open, setOpen] = useState(false);

  const changeLanguage = (code: string) => {
    const selectEl = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement | null;
    if (selectEl) {
      selectEl.value = code;
      selectEl.dispatchEvent(new Event("change"));
      setCurrent(code);
    }
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
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
        <i className="fa-solid fa-chevron-down text-[8px] ml-0.5 opacity-60"></i>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 bg-white shadow-xl rounded-lg border border-gray-100 py-1 z-50 min-w-[120px]">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition ${
                  current === lang.code
                    ? "text-isoko-accent"
                    : "text-gray-600"
                }`}
              >
                <span className="text-sm leading-none">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
