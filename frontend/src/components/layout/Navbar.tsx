"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";
import { clearSession, getSession, type Session } from "@/lib/session";
import { fetchCart } from "@/lib/api";

const navLinks = [
  { key: "nav.home" as const, href: "/" },
  { key: "nav.videos" as const, href: "/videos" },
  { key: "nav.blog" as const, href: "/blog" },
  { key: "nav.library" as const, href: "/books" },
  { key: "nav.market" as const, href: "/eguriro" },
  { key: "nav.about" as const, href: "/about" },
  { key: "nav.contact" as const, href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const syncSession = () => setSession(getSession());
    const frame = requestAnimationFrame(syncSession);
    window.addEventListener("isoko-session-change", syncSession);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("isoko-session-change", syncSession);
    };
  }, []);

  useEffect(() => {
    const syncCart = () => getSession() ? fetchCart().then(({ data }) => setCartCount(data.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0))).catch(() => setCartCount(0)) : setCartCount(0);
    const frame = requestAnimationFrame(syncCart);
    window.addEventListener("isoko-cart-change", syncCart);
    window.addEventListener("isoko-session-change", syncCart);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("isoko-cart-change", syncCart); window.removeEventListener("isoko-session-change", syncCart); };
  }, []);

  const logout = () => {
    clearSession();
    setSession(null);
    setCartCount(0);
    setMobileOpen(false);
  };

  return (
    <nav aria-label="Primary navigation"
      className={`fixed top-0 w-full z-50 nav-transition ${
        isScrolled || mobileOpen
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
        <div className="hidden xl:flex items-center gap-4 2xl:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`text-[13px] font-bold uppercase tracking-widest transition-colors hover:text-isoko-accent ${
                isScrolled || mobileOpen ? "text-isoko-dark" : "text-white/90"
              } ${pathname === link.href ? "text-isoko-accent" : ""}`}
            >
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher isScrolled={isScrolled || mobileOpen} />

          <Link href="/cart" aria-label="Marketplace cart" title="Marketplace cart" className={`relative grid h-10 w-10 place-items-center rounded-xl border transition hover:-translate-y-0.5 hover:border-isoko-accent ${isScrolled || mobileOpen ? "border-black/10 bg-white text-isoko-dark" : "border-white/20 bg-white/10 text-white backdrop-blur-xl"}`}>
            <i className="fa-solid fa-basket-shopping" />{cartCount > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-isoko-gold px-1 text-[9px] font-black text-isoko-dark">{cartCount > 99 ? '99+' : cartCount}</span>}
          </Link>

          <Link
            href="/account"
            aria-label={t("nav.account")}
            title={t("nav.account")}
            className={`grid h-10 w-10 place-items-center overflow-hidden rounded-xl border transition hover:-translate-y-0.5 hover:border-isoko-accent hover:text-isoko-accent ${isScrolled || mobileOpen ? "border-black/10 bg-white text-isoko-dark" : "border-white/20 bg-white/10 text-white backdrop-blur-xl"}`}
          >
            {session?.avatar ? <Image src={session.avatar} alt="" width={40} height={40} className="h-full w-full object-cover" /> : session ? <span className="text-xs font-black">{session.name.slice(0, 2).toUpperCase()}</span> : <i aria-hidden="true" className="fa-regular fa-user" />}
          </Link>

          {session && <button type="button" onClick={logout} title={t("account.logout")} aria-label={t("account.logout")} className={`hidden h-10 items-center gap-2 rounded-xl border px-3 text-[11px] font-black uppercase tracking-wider transition xl:flex ${isScrolled ? "border-black/10 bg-white text-isoko-dark" : "border-white/20 bg-white/10 text-white"}`}><i className="fa-solid fa-arrow-right-from-bracket" />{t("account.logout")}</button>}

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
            className={`xl:hidden w-10 h-10 rounded-lg flex items-center justify-center transition ${
              isScrolled || mobileOpen
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
              className="fixed inset-0 bg-black/50 z-40 xl:hidden"
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
              className="fixed top-0 right-0 w-[min(88vw,22rem)] h-dvh bg-white z-50 xl:hidden flex flex-col shadow-2xl opacity-100"
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
                <Link href="/cart" onClick={() => setMobileOpen(false)} className="mb-3 flex items-center justify-between rounded-xl bg-isoko-light/60 p-3 text-xs font-black text-isoko-dark"><span><i className="fa-solid fa-basket-shopping mr-2 text-isoko-accent" />{t("nav.cart")}</span><span className="rounded-full bg-isoko-dark px-2 py-1 text-[9px] text-white">{cartCount}</span></Link>
                <Link href="/account" onClick={() => setMobileOpen(false)} className="mb-3 flex items-center gap-3 rounded-xl border border-isoko-dark/10 p-3 text-isoko-dark">
                  <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-isoko-light text-xs font-black text-isoko-primary">{session?.avatar ? <Image fill sizes="40px" src={session.avatar} alt="" className="object-cover" /> : session ? session.name.slice(0, 2).toUpperCase() : <i className="fa-regular fa-user" />}</span>
                  <span className="min-w-0 text-left"><span className="block truncate text-xs font-black">{session?.name || t("nav.account")}</span>{session && <span className="block truncate text-[10px] text-slate-500">{session.email}</span>}</span>
                </Link>
                {session && <button type="button" onClick={logout} className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-3 text-xs font-black uppercase tracking-wider text-red-700"><i className="fa-solid fa-arrow-right-from-bracket" />{t("account.logout")}</button>}
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
