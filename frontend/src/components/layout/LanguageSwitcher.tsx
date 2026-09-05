"use client";

import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useI18n, type Locale } from "@/lib/i18n";

const languages: { code: Locale; short: string; name: string; flag: string }[] = [
  { code: "rw", short: "KIN", name: "Kinyarwanda", flag: "🇷🇼" },
  { code: "en", short: "EN", name: "English", flag: "🇬🇧" },
  { code: "fr", short: "FR", name: "Français", flag: "🇫🇷" },
];

export default function LanguageSwitcher({ isScrolled }: { isScrolled: boolean }) {
  const { locale, setLocale, t } = useI18n();
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const active = languages.find((language) => language.code === locale)!;

  return (
    <>
      <button type="button" onClick={(event) => setAnchor(event.currentTarget)} aria-haspopup="menu" aria-expanded={Boolean(anchor)} aria-label={`${t("language.choose")}: ${active.name}`}
        className={`min-h-10 flex items-center gap-2 px-3 rounded-xl text-xs font-black tracking-wider transition border ${isScrolled ? "border-gray-200 bg-white text-isoko-dark hover:border-isoko-accent" : "border-white/25 bg-white/10 text-white hover:bg-white/20"}`}>
        <span aria-hidden="true">{active.flag}</span><span>{active.short}</span><i aria-hidden="true" className="fa-solid fa-chevron-down text-[8px] opacity-60" />
      </button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)} slotProps={{ paper: { sx: { mt: 1, minWidth: 190, borderRadius: 3, boxShadow: "0 18px 50px rgba(0,0,0,.16)" } } }}>
        {languages.map((language) => (
          <MenuItem key={language.code} selected={locale === language.code} onClick={() => { setLocale(language.code); setAnchor(null); }} sx={{ gap: 1.5, py: 1.25, fontWeight: 800 }}>
            <span aria-hidden="true">{language.flag}</span><span>{language.name}</span><span className="ml-auto text-[10px] text-gray-400">{language.short}</span>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
