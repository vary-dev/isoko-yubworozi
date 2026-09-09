"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";

const navLinks = [
  { key: "nav.home" as const, href: "/" },
  { key: "nav.videos" as const, href: "/videos" },
  { key: "nav.blog" as const, href: "/blog" },
  { key: "nav.library" as const, href: "/books" },
  { key: "nav.about" as const, href: "/about" },
  { key: "nav.contact" as const, href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav aria-label="Primary navigation"
      className={`fixed top-0 w-full z-50 nav-transition ${
        isScrolled
          ? "bg-white/82 backdrop-blur-2xl border-b border-white/60 shadow-[0_10px_40px_rgba(4,44,24,.08)] py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" aria-label="Isoko y'Ubworozi home" className="shrink-0 rounded-2xl bg-white/95 px-2.5 py-1 shadow-lg shadow-black/10">
          <Image src="https://res.cloudinary.com/dydg39ukk/image/upload/v1788943683/isoko-yubworozi-logo_ijbygk.png" alt="Isoko y'Ubworozi" width={220} height={72} priority className="h-12 w-auto sm:h-14" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`text-[13px] font-bold uppercase tracking-widest transition-colors hover:text-isoko-accent ${
                isScrolled ? "text-isoko-dark" : "text-white/90"
              } ${pathname === link.href ? "text-isoko-accent" : ""}`}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher isScrolled={isScrolled} />

          <a
            href="https://youtube.com/@Isokoyubworozi"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-[#FF0000] text-white px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider hover:bg-[#CC0000] transition-all shadow-md"
          >
            <i aria-hidden="true" className="fa-brands fa-youtube text-sm"></i>
            {t("nav.subscribe")}
          </a>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("nav.close") : t("nav.open")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className={`lg:hidden w-10 h-10 rounded-lg flex items-center justify-center transition ${
              isScrolled
                ? "bg-gray-100 text-isoko-dark"
                : "bg-white/10 text-white"
            }`}
          >
            <i
              aria-hidden="true" className={`fa-solid ${
                mobileOpen ? "fa-xmark" : "fa-bars"
              } text-lg`}
            ></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              id="mobile-navigation"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              className="fixed top-0 right-0 w-[min(88vw,22rem)] h-full bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <span className="text-lg font-black text-isoko-dark tracking-tight">
                  ISOKO<span className="text-isoko-accent">.</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label={t("nav.close")}
                  className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div role="navigation" aria-label="Mobile links" className="flex-1 p-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    aria-current={pathname === link.href ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-isoko-light/40 hover:text-isoko-primary transition ${pathname === link.href ? "bg-isoko-light/60 text-isoko-primary" : "text-isoko-dark"}`}
                  >
                    {t(link.key)}
                  </Link>
                ))}
              </div>
              <div className="p-6 border-t border-gray-100">
                <a
                  href="https://youtube.com/@Isokoyubworozi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#FF0000] text-white w-full py-3 rounded-lg font-black text-xs uppercase tracking-wider"
                >
                  <i className="fa-brands fa-youtube"></i>
                  {t("nav.subscribe")} YouTube
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
