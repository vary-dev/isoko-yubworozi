"use client";
import { useState, useEffect, useRef } from "react";
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
  { key: "nav.library" as const, href: "/books", children: [{ key: "nav.blog" as const, href: "/blog" }] },
  { key: "nav.market" as const, href: "/eguriro" },
  { key: "nav.about" as const, href: "/about" },
  { key: "nav.contact" as const, href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(pathname === "/books" || pathname.startsWith("/books/") || pathname === "/blog" || pathname.startsWith("/blog/"));
  const [session, setSession] = useState<Session | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);

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

  // Escape closes the mobile menu; focus moves into the panel when it opens.
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") setMobileOpen(false); };
    window.addEventListener("keydown", handleKey);
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>("[data-mobile-close]")?.focus());
    return () => { window.removeEventListener("keydown", handleKey); cancelAnimationFrame(frame); };
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

  const solid = isScrolled || mobileOpen;

  return (
    <nav aria-label="Primary navigation"
      className={`fixed top-0 w-full z-50 nav-transition ${
        solid
          ? "bg-white/90 py-2 shadow-[0_10px_40px_rgba(4,44,24,.07)] backdrop-blur-xl"
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
            link.children ? <div key={link.key} className="group relative py-3">
              <Link href={link.href} aria-current={pathname.startsWith("/books") || pathname.startsWith("/blog") ? "page" : undefined} className={`inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest transition-colors ${solid ? "text-isoko-forest hover:text-isoko-emerald" : "text-white/90 hover:text-isoko-lime"} ${pathname.startsWith("/books") || pathname.startsWith("/blog") ? solid ? "text-isoko-emerald" : "text-isoko-lime" : ""}`}>
                {t(link.key)}<i aria-hidden="true" className="fa-solid fa-chevron-down text-[9px]" />
              </Link>
              <div className="invisible absolute left-0 top-full z-50 min-w-48 translate-y-2 rounded-2xl bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                {link.children.map((child) => <Link key={child.href} href={child.href} aria-current={pathname === child.href || pathname.startsWith(`${child.href}/`) ? "page" : undefined} className="block rounded-xl px-4 py-3 text-xs font-extrabold text-isoko-forest transition hover:bg-isoko-neutral hover:text-isoko-emerald">{t(child.key)}</Link>)}
              </div>
            </div> : <Link key={link.key} href={link.href} aria-current={pathname === link.href ? "page" : undefined} className={`text-[13px] font-bold uppercase tracking-widest transition-colors ${solid ? "text-isoko-forest hover:text-isoko-emerald" : "text-white/90 hover:text-isoko-lime"} ${pathname === link.href ? solid ? "text-isoko-emerald" : "text-isoko-lime" : ""}`}>
              {t(link.key)}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <LanguageSwitcher isScrolled={solid} />

          <Link href="/cart" aria-label={t("nav.cart")} title={t("nav.cart")} className={`relative grid h-10 w-10 place-items-center rounded-full border transition hover:-translate-y-0.5 ${solid ? "border-black/10 bg-white text-isoko-forest hover:border-isoko-emerald" : "border-white/20 bg-white/10 text-white backdrop-blur-xl hover:border-white/50"}`}>
            <i aria-hidden="true" className="fa-solid fa-basket-shopping" />{cartCount > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-isoko-lime px-1 text-[9px] font-black text-isoko-forest-deep">{cartCount > 99 ? '99+' : cartCount}</span>}
          </Link>

          <Link
            href="/account"
            aria-label={t("nav.account")}
            title={t("nav.account")}
            className={`grid h-10 w-10 place-items-center overflow-hidden rounded-full border transition hover:-translate-y-0.5 ${solid ? "border-black/10 bg-white text-isoko-forest hover:border-isoko-emerald" : "border-white/20 bg-white/10 text-white backdrop-blur-xl hover:border-white/50"}`}
          >
            {session?.avatar ? <Image src={session.avatar} alt="" width={40} height={40} className="h-full w-full object-cover" /> : session ? <span className="text-xs font-black">{session.name.slice(0, 2).toUpperCase()}</span> : <i aria-hidden="true" className="fa-regular fa-user" />}
          </Link>

          {session && <button type="button" onClick={logout} title={t("account.logout")} aria-label={t("account.logout")} className={`hidden h-10 items-center gap-2 rounded-full border px-4 text-[11px] font-black uppercase tracking-wider transition xl:flex ${solid ? "border-black/10 bg-white text-isoko-forest hover:border-isoko-emerald" : "border-white/20 bg-white/10 text-white"}`}><i aria-hidden="true" className="fa-solid fa-arrow-right-from-bracket" />{t("account.logout")}</button>}

          {!session && <Link
            href="/account"
            className="hidden h-10 items-center rounded-full bg-isoko-lime px-5 text-[11px] font-black uppercase tracking-wider text-isoko-forest-deep shadow-[0_10px_25px_rgba(163,230,53,.28)] transition hover:-translate-y-0.5 hover:bg-isoko-lime-soft xl:flex"
          >
            {t("nav.register")}
          </Link>}

          <a
            href="https://youtube.com/@Isokoyubworozi"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            title="YouTube"
            className={`grid h-10 w-10 place-items-center rounded-full border transition hover:-translate-y-0.5 hover:text-[#e50000] ${solid ? "border-black/10 bg-white text-isoko-forest" : "border-white/20 bg-white/10 text-white backdrop-blur-xl"}`}
          >
            <i aria-hidden="true" className="fa-brands fa-youtube text-base"></i>
          </a>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("nav.close") : t("nav.open")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className={`xl:hidden grid h-10 w-10 place-items-center rounded-full transition ${
              solid
                ? "bg-isoko-neutral text-isoko-forest"
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
              ref={panelRef}
              className="fixed top-0 right-0 w-[min(88vw,22rem)] h-dvh bg-white z-50 xl:hidden flex flex-col shadow-2xl opacity-100"
            >
              <div className="p-6 border-b border-isoko-neutral flex items-center justify-between">
                <Link href="/" aria-label="Isoko y'Ubworozi home" onClick={() => setMobileOpen(false)} className="inline-flex rounded-xl bg-white p-1.5 shadow">
                  <Image src="https://res.cloudinary.com/dydg39ukk/image/upload/v1788943683/isoko-yubworozi-logo_ijbygk.png" alt="Isoko y'Ubworozi" width={180} height={60} className="h-10 w-auto" />
                </Link>
                <button
                  type="button"
                  data-mobile-close
                  onClick={() => setMobileOpen(false)}
                  aria-label={t("nav.close")}
                  className="grid h-10 w-10 place-items-center rounded-full bg-isoko-neutral text-isoko-forest"
                >
                  <i aria-hidden="true" className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div role="navigation" aria-label="Mobile links" className="flex-1 overflow-y-auto p-6 space-y-1">
                {navLinks.map((link) => (
                  link.children ? <div key={link.key}>
                    <div className="flex items-center">
                      <Link href={link.href} aria-current={pathname.startsWith("/books") ? "page" : undefined} onClick={() => setMobileOpen(false)} className={`flex-1 rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider transition hover:text-isoko-emerald ${pathname.startsWith("/books") ? "bg-isoko-neutral text-isoko-emerald" : "text-isoko-forest"}`}>{t(link.key)}</Link>
                      <button type="button" onClick={() => setLibraryOpen((current) => !current)} aria-expanded={libraryOpen} aria-label={t("nav.blog")} className="grid h-11 w-11 place-items-center rounded-lg text-isoko-forest hover:bg-isoko-neutral"><i aria-hidden="true" className={`fa-solid fa-chevron-down text-xs transition-transform ${libraryOpen ? "rotate-180" : ""}`} /></button>
                    </div>
                    <AnimatePresence initial={false}>{libraryOpen && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4">
                      {link.children.map((child) => <Link key={child.href} href={child.href} aria-current={pathname === child.href || pathname.startsWith(`${child.href}/`) ? "page" : undefined} onClick={() => setMobileOpen(false)} className={`mt-1 flex items-center gap-3 rounded-lg px-4 py-3 text-xs font-bold uppercase tracking-wider transition hover:text-isoko-emerald ${pathname.startsWith(child.href) ? "bg-isoko-neutral text-isoko-emerald" : "text-isoko-muted"}`}><i aria-hidden="true" className="fa-solid fa-newspaper text-isoko-emerald" />{t(child.key)}</Link>)}
                    </motion.div>}</AnimatePresence>
                  </div> : <Link key={link.key} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={() => setMobileOpen(false)} className={`block rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wider transition hover:text-isoko-emerald ${pathname === link.href ? "bg-isoko-neutral text-isoko-emerald" : "text-isoko-forest"}`}>
                    {t(link.key)}
                  </Link>
                ))}
              </div>
              <div className="border-t border-isoko-neutral p-6">
                <Link href="/cart" onClick={() => setMobileOpen(false)} className="mb-3 flex items-center justify-between rounded-xl bg-isoko-neutral p-3 text-xs font-black text-isoko-forest"><span><i aria-hidden="true" className="fa-solid fa-basket-shopping mr-2 text-isoko-emerald" />{t("nav.cart")}</span><span className="rounded-full bg-isoko-forest px-2 py-1 text-[9px] text-white">{cartCount}</span></Link>
                <Link href="/account" onClick={() => setMobileOpen(false)} className="mb-3 flex items-center gap-3 rounded-xl border border-isoko-dark/10 p-3 text-isoko-forest">
                  <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl bg-isoko-neutral text-xs font-black text-isoko-emerald">{session?.avatar ? <Image fill sizes="40px" src={session.avatar} alt="" className="object-cover" /> : session ? session.name.slice(0, 2).toUpperCase() : <i aria-hidden="true" className="fa-regular fa-user" />}</span>
                  <span className="min-w-0 text-left"><span className="block truncate text-xs font-black">{session?.name || t("nav.account")}</span>{session && <span className="block truncate text-[10px] text-isoko-muted">{session.email}</span>}</span>
                </Link>
                {session && <button type="button" onClick={logout} className="mb-3 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 py-3 text-xs font-black uppercase tracking-wider text-red-700"><i aria-hidden="true" className="fa-solid fa-arrow-right-from-bracket" />{t("account.logout")}</button>}
                <a
                  href="https://youtube.com/@Isokoyubworozi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-isoko-forest text-white w-full py-3 rounded-full font-black text-xs uppercase tracking-wider transition hover:bg-isoko-emerald"
                >
                  <i aria-hidden="true" className="fa-brands fa-youtube text-isoko-lime"></i>
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
