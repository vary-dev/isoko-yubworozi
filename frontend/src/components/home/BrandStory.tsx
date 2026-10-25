"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function BrandStory() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const pillars = [["fa-shield-virus","story.health"],["fa-wheat-awn","story.feed"],["fa-chart-line","story.business"]] as const;
  return (
    <section className="relative overflow-hidden bg-isoko-canvas py-20 sm:py-24">
      <div className="section-shell grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow mb-3 text-isoko-emerald">{t("story.eyebrow")}</p>
          <h2 className="text-3xl font-bold text-isoko-forest text-balance sm:text-5xl">{t("story.title")}</h2>
          <p className="mt-6 text-lg leading-8 text-isoko-muted">{t("story.body")}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {pillars.map(([icon,key], index) => <motion.div key={key} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .1 }}
            className="rounded-[1.5rem] bg-white p-6 shadow-soft">
            <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-2xl bg-isoko-lime-soft/45 text-isoko-emerald"><i className={`fa-solid ${icon}`} /></span>
            <h3 className="mt-5 text-lg font-bold text-isoko-forest">{t(key)}</h3>
          </motion.div>)}
        </div>
      </div>
    </section>
  );
}
