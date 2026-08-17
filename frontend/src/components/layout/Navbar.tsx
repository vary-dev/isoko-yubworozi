"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Videos", href: "/videos" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 nav-transition ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black ${
              isScrolled
                ? "bg-isoko-dark text-isoko-accent"
                : "bg-white/15 text-isoko-accent backdrop-blur-sm"
            }`}
          >
            <i className="fa-solid fa-seedling"></i>
          </div>
          <span
            className={`text-xl font-black tracking-tight ${
              isScrolled ? "text-isoko-dark" : "text-white"
            }`}
          >
            ISOKO
            <span className="text-isoko-accent">.</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-[13px] font-bold uppercase tracking-widest transition-colors hover:text-isoko-accent ${
                isScrolled ? "text-isoko-dark" : "text-white/90"
              }`}
            >
              {link.name}
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
            <i className="fa-brands fa-youtube text-sm"></i>
            Subscribe
          </a>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden w-10 h-10 rounded-lg flex items-center justify-center transition ${
              isScrolled
                ? "bg-gray-100 text-isoko-dark"
                : "bg-white/10 text-white"
            }`}
          >
            <i
              className={`fa-solid ${
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
              className="fixed top-0 right-0 w-72 h-full bg-white z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <span className="text-lg font-black text-isoko-dark tracking-tight">
                  ISOKO<span className="text-isoko-accent">.</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <nav className="flex-1 p-6 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 rounded-lg text-sm font-bold text-isoko-dark uppercase tracking-wider hover:bg-isoko-light/40 hover:text-isoko-primary transition"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="p-6 border-t border-gray-100">
                <a
                  href="https://youtube.com/@Isokoyubworozi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#FF0000] text-white w-full py-3 rounded-lg font-black text-xs uppercase tracking-wider"
                >
                  <i className="fa-brands fa-youtube"></i>
                  Subscribe on YouTube
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
