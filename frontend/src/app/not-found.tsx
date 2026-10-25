"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

/**
 * 404 page. Localized (rw first) and uses the same gradient hero identity as
 * every other inner page so a dead end still looks like the platform.
 */
export default function NotFound() {
  const { t } = useI18n();

  return (
    <main id="main-content">
      <Navbar />
      <PageHero
        eyebrow={t("notFound.eyebrow")}
        title={t("notFound.title")}
        body={t("notFound.body")}
        icon="fa-solid fa-compass"
      />
      <section className="bg-isoko-canvas py-16 sm:py-20">
        <div className="section-shell">
          <div className="rounded-3xl bg-white p-8 text-center shadow-soft sm:p-12">
            <p className="font-display text-6xl font-black text-isoko-lime sm:text-7xl">404</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/" className={buttonVariants({ variant: "primary" })}>
                <i aria-hidden="true" className="fa-solid fa-house" />
                {t("notFound.home")}
              </Link>
              <Link href="/blog" className={buttonVariants({ variant: "outline" })}>
                <i aria-hidden="true" className="fa-solid fa-newspaper" />
                {t("notFound.blog")}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
