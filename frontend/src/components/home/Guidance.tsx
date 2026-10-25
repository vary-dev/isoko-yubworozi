"use client";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const features = [
  { title: "guidance.videoTitle" as const, description: "guidance.videoBody" as const,
    icon: "fa-solid fa-circle-play",
    link: "/videos",
  },
  {
    title: "guidance.articleTitle" as const, description: "guidance.articleBody" as const,
    icon: "fa-solid fa-newspaper",
    link: "/blog",
  },
  {
    title: "guidance.bookTitle" as const, description: "guidance.bookBody" as const,
    icon: "fa-solid fa-book-open",
    link: "/books",
  },
];

export default function Guidance() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  return (
    <section className="relative overflow-hidden bg-isoko-canvas py-20 sm:py-24" aria-labelledby="guidance-title">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(42rem_24rem_at_8%_0%,rgba(163,230,53,.1),transparent_60%),radial-gradient(38rem_22rem_at_100%_100%,rgba(22,101,52,.07),transparent_62%)]" />
      <div className="section-shell relative">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3 text-isoko-emerald">{t("guidance.eyebrow")}</p>
          <h2 id="guidance-title" className="text-3xl font-bold text-isoko-forest text-balance sm:text-5xl">{t("guidance.title")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              viewport={{ once: true }}
              className="min-w-0"
            >
              <Link href={item.link} className="group block h-full">
                <Card className="h-full transition duration-200 hover:-translate-y-1 hover:shadow-lift">
                <CardContent className="p-7">
                <span
                  aria-hidden="true"
                  className="mb-6 grid h-13 w-13 place-items-center rounded-2xl bg-isoko-lime-soft/45 text-xl text-isoko-emerald transition-transform duration-200 group-hover:scale-105"
                >
                  <i className={item.icon}></i>
                </span>
                <CardTitle className="mb-3">{t(item.title)}</CardTitle>
                <CardDescription className="mb-6">{t(item.description)}</CardDescription>
                <span className="mt-auto inline-flex items-center gap-2 text-sm font-extrabold text-isoko-emerald transition-all duration-200 group-hover:gap-3">
                  {t("common.explore")} <i aria-hidden="true" className="fa-solid fa-arrow-right text-[10px]"></i>
                </span>
                </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
