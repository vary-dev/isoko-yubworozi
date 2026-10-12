"use client";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Hero() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[min(760px,100svh)] items-center overflow-hidden bg-isoko-dark pt-24 sm:min-h-[680px] lg:min-h-[780px]">
      <div className="absolute inset-0 -z-30 bg-[url('https://res.cloudinary.com/dydg39ukk/image/upload/v1788949829/isoko-yubworozi-banner_txy0cd.png')] bg-cover bg-[center_top] lg:bg-center" role="img" aria-label="Rwandan poultry farmer caring for healthy chickens in a modern farm" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(100deg,rgba(3,38,19,.96)_4%,rgba(6,59,31,.78)_62%,rgba(6,59,31,.42)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_24%,rgba(125,205,87,.22),transparent_32%)]" />
      <div className="section-shell w-full py-16 sm:py-20 lg:py-24">
        <motion.div initial={reduced ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="max-w-4xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-isoko-gold" />{t("hero.eyebrow")}
          </span>
          <h1 id="hero-title" className="max-w-4xl text-[clamp(2.45rem,7vw,5.25rem)] font-extrabold leading-[1.04] text-white text-balance">
            {t("hero.title")} <span className="bg-gradient-to-r from-[#a7e879] to-isoko-gold bg-clip-text text-transparent">{t("hero.titleAccent")}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/85 sm:mt-7 sm:text-xl sm:leading-8">{t("hero.body")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <Link href="/videos" className={cn(buttonVariants({ variant: "youtube", size: "lg" }))}><i className="fa-brands fa-youtube text-lg" />{t("hero.watch")}</Link>
            <Link href="/blog" className={cn(buttonVariants({ variant: "glass", size: "lg" }))}>{t("hero.read")}<i className="fa-solid fa-arrow-right text-xs" /></Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
