"use client";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Hero() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  return (
    <section aria-labelledby="hero-title" className="relative isolate min-h-[780px] overflow-hidden bg-isoko-dark pt-28 lg:flex lg:min-h-[860px] lg:items-center">
      <div className="absolute inset-0 -z-30 bg-[url('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=85&w=2100&auto=format&fit=crop')] bg-cover bg-center" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(100deg,rgba(3,38,19,.98)_4%,rgba(6,59,31,.88)_52%,rgba(6,59,31,.42)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_72%_24%,rgba(125,205,87,.22),transparent_32%)]" />
      <div className="section-shell grid gap-12 py-20 lg:grid-cols-[1.18fr_.82fr] lg:items-center">
        <motion.div initial={reduced ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-isoko-gold" />{t("hero.eyebrow")}
          </span>
          <h1 id="hero-title" className="max-w-4xl text-[clamp(3rem,7vw,6.35rem)] font-extrabold leading-[.98] text-white text-balance">
            {t("hero.title")} <span className="bg-gradient-to-r from-[#a7e879] to-isoko-gold bg-clip-text text-transparent">{t("hero.titleAccent")}</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">{t("hero.body")}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/videos" className={cn(buttonVariants({ variant: "youtube", size: "lg" }))}><i className="fa-brands fa-youtube text-lg" />{t("hero.watch")}</Link>
            <Link href="/blog" className={cn(buttonVariants({ variant: "glass", size: "lg" }))}>{t("hero.read")}<i className="fa-solid fa-arrow-right text-xs" /></Link>
          </div>
        </motion.div>
        <motion.div initial={reduced ? false : { opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: .18, duration: .75 }} className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {[["100+", t("hero.videos"), "fa-circle-play"], ["5K+", t("hero.farmers"), "fa-people-group"], ["Weekly", t("hero.new"), "fa-seedling"]].map(([value, label, icon]) => (
            <Card key={label} className="group transition duration-300 hover:-translate-y-1 hover:bg-white/16">
              <CardContent className="flex items-center gap-5 p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/12 text-isoko-gold"><i className={`fa-solid ${icon}`} /></span>
                <div><strong className="font-display text-2xl text-white">{value}</strong><p className="text-sm text-white/65">{label}</p></div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
