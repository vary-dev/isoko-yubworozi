"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

const features = [
  { title: "guidance.videoTitle" as const, description: "guidance.videoBody" as const,
    icon: "fa-brands fa-youtube",
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
  return (
    <section className="relative overflow-hidden bg-isoko-dark py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(76,159,56,.3),transparent_32%),radial-gradient(circle_at_90%_80%,rgba(244,185,66,.12),transparent_28%)]" />
      <div className="section-shell relative">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[.18em] text-isoko-gold">{t("guidance.eyebrow")}</p>
          <h2 className="text-3xl font-bold text-white text-balance sm:text-5xl">{t("guidance.title")}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href={item.link} className="group block h-full">
                <Card className="h-full transition duration-300 hover:-translate-y-1.5 hover:border-white/30 hover:bg-white/15">
                <CardContent className="p-7">
                <div
                  className="mb-6 flex h-13 w-13 items-center justify-center rounded-2xl bg-white/12 text-xl text-isoko-gold transition-transform group-hover:scale-110"
                >
                  <i className={item.icon}></i>
                </div>
                <CardTitle className="mb-3 text-white">{t(item.title)}</CardTitle>
                <CardDescription className="mb-6">{t(item.description)}</CardDescription>
                <span className="flex items-center gap-2 text-sm font-extrabold text-isoko-gold transition-all group-hover:gap-3">
                  {t("common.explore")} <i className="fa-solid fa-arrow-right text-[10px]"></i>
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
