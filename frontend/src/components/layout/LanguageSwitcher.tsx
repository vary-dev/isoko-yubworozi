"use client";
import { useState } from "react";
import { useI18n, type Locale } from "@/lib/i18n";

const languages: { code: Locale; short: string; name: string }[] = [
  { code: "rw", short: "KIN", name: "Kinyarwanda" }, { code: "en", short: "EN", name: "English" }, { code: "fr", short: "FR", name: "Français" },
];

export default function LanguageSwitcher({ isScrolled }: { isScrolled: boolean }) {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const active = languages.find((item) => item.code === locale)!;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(!open)} aria-haspopup="listbox" aria-expanded={open} aria-label={`${t("language.choose")}: ${active.name}`}
        className={`flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-xs font-extrabold transition ${isScrolled ? "border-isoko-dark/10 bg-white text-isoko-dark shadow-sm" : "border-white/20 bg-white/10 text-white backdrop-blur-xl"}`}>
        <i aria-hidden="true" className="fa-solid fa-globe" />{active.short}<i aria-hidden="true" className="fa-solid fa-chevron-down text-[8px] opacity-60" />
      </button>
      {open && <>
        <button type="button" aria-label="Close" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
        <div role="listbox" className="absolute right-0 top-full z-50 mt-2 min-w-48 rounded-2xl border border-white/60 bg-white/90 p-1.5 shadow-2xl backdrop-blur-2xl">
          {languages.map((item) => <button key={item.code} role="option" aria-selected={locale === item.code} onClick={() => { setLocale(item.code); setOpen(false); }}
            className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-bold ${locale === item.code ? "bg-isoko-light text-isoko-dark" : "text-gray-600 hover:bg-gray-50"}`}>
            {item.name}<span className="text-xs text-gray-400">{item.short}</span>
          </button>)}
        </div>
      </>}
    </div>
  );
}
