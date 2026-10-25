"use client";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* Future hero media seam: when the owner approves a short premium clip, set
   `videoSrc` (muted, playsInline, looped, lazy poster fallback) below and render it
   as an extra layer inside this section. Until then the polished forest-green
   gradient is the finished, intentional composition — no video is downloaded. */
const heroMedia: { videoSrc?: string; posterSrc?: string } = {
  videoSrc: undefined,
  posterSrc: undefined, // e.g. the existing brand banner remains available in Cloudinary
};

export default function Hero() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  return (
    <section
      aria-labelledby="hero-title"
      className="hero-gradient relative isolate flex min-h-[min(720px,100svh)] items-center overflow-hidden pt-24 sm:min-h-[640px] lg:min-h-[760px]"
    >
      {/* Reserved seam for the approved future video/poster — intentionally empty this phase */}
      {heroMedia.videoSrc ? null : null}

      {/* Restrained abstract glows, part of the gradient composition */}
      <div aria-hidden="true" className="absolute -left-40 top-1/3 -z-10 h-96 w-96 rounded-full bg-isoko-lime/10 blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-isoko-emerald/20 blur-3xl" />

      <div className="section-shell w-full py-16 sm:py-20 lg:py-24">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <span className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-white/90 backdrop-blur-xl">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-isoko-lime" />
            {t("hero.eyebrow")}
          </span>
          <h1
            id="hero-title"
            className="max-w-3xl text-[clamp(2.4rem,6.5vw,5rem)] font-extrabold leading-[1.05] text-white text-balance"
          >
            <span className="block">{t("hero.title")}</span>
            <span className="block text-isoko-lime">{t("hero.titleAccent")}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:mt-7 sm:text-xl sm:leading-8">
            {t("hero.body")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <Link href="/videos" className={cn(buttonVariants({ variant: "primary", size: "lg" }))}>
              <i aria-hidden="true" className="fa-solid fa-play text-xs" />
              {t("hero.watch")}
            </Link>
            <Link href="/blog" className={cn(buttonVariants({ variant: "glass", size: "lg" }))}>
              {t("hero.read")}
              <i aria-hidden="true" className="fa-solid fa-arrow-right text-xs" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
