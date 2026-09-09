"use client";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function BrandStory() {
  const { t } = useI18n();
  const pillars = [["fa-shield-virus","story.health"],["fa-wheat-awn","story.feed"],["fa-chart-line","story.business"]] as const;
  return (
    <section className="relative overflow-hidden bg-[#edf5ef] py-24">
      <div className="section-shell grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="mb-3 text-sm font-extrabold uppercase tracking-[.18em] text-isoko-primary">{t("story.eyebrow")}</p>
          <h2 className="text-4xl font-bold text-isoko-dark text-balance sm:text-5xl">{t("story.title")}</h2>
          <p className="mt-6 text-lg leading-8 text-isoko-dark/68">{t("story.body")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {pillars.map(([icon,key], index) => <motion.div key={key} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .1 }}
            className="rounded-[1.75rem] border border-white/80 bg-white/70 p-6 shadow-[0_20px_60px_rgba(5,52,27,.08)] backdrop-blur-xl">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-isoko-dark text-isoko-gold"><i className={`fa-solid ${icon}`} /></span>
            <h3 className="mt-5 text-lg font-bold text-isoko-dark">{t(key)}</h3>
          </motion.div>)}
        </div>
      </div>
    </section>
  );
}
