"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

const features = [
  { title: "guidance.videoTitle" as const, description: "guidance.videoBody" as const,
    icon: "fa-brands fa-youtube",
    link: "/videos",
    gradient: "from-red-500 to-red-600",
    iconBg: "bg-red-50 text-red-500",
  },
  {
    title: "guidance.articleTitle" as const, description: "guidance.articleBody" as const,
    icon: "fa-solid fa-newspaper",
    link: "/blog",
    gradient: "from-isoko-primary to-isoko-dark",
    iconBg: "bg-isoko-light text-isoko-primary",
  },
  {
    title: "guidance.bookTitle" as const, description: "guidance.bookBody" as const,
    icon: "fa-solid fa-book-open",
    link: "/books",
    gradient: "from-blue-500 to-blue-600",
    iconBg: "bg-blue-50 text-blue-500",
  },
];

export default function Guidance() {
  const { t } = useI18n();
  return (
    <section className="relative z-30 -mt-16 pb-4">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center mb-9 pt-24">
          <p className="text-[11px] font-black uppercase tracking-[.2em] text-isoko-accent mb-2">{t("guidance.eyebrow")}</p>
          <h2 className="text-3xl sm:text-4xl font-black text-isoko-dark text-balance">{t("guidance.title")}</h2>
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
              <Link
                href={item.link}
                className="block p-7 bg-white rounded-xl border border-gray-100 shadow-lg hover:shadow-xl transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg mb-5 ${item.iconBg} group-hover:scale-110 transition-transform`}
                >
                  <i className={item.icon}></i>
                </div>
                <h3 className="text-lg font-black text-isoko-dark mb-2">
                  {t(item.title)}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  {t(item.description)}
                </p>
                <span className="text-isoko-accent text-xs font-black uppercase tracking-wider flex items-center gap-2 group-hover:gap-3 transition-all">
                  {t("common.explore")} <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
