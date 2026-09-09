"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function MarketplacePreview() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const items = [["fa-shield-halved", "market.verify"], ["fa-stethoscope", "market.guidance"], ["fa-lock", "market.secure"]] as const;
  return (
    <section className="bg-[#f3f8f4] py-20 sm:py-24" aria-labelledby="marketplace-title">
      <div className="section-shell">
        <motion.div initial={reduced ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-[2rem] bg-isoko-dark px-6 py-10 text-white shadow-[0_28px_90px_rgba(3,45,22,.18)] sm:px-10 lg:grid lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:gap-12 lg:px-14 lg:py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(244,185,66,.2),transparent_30%),radial-gradient(circle_at_5%_90%,rgba(76,159,56,.32),transparent_35%)]" />
          <div className="relative">
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[.17em] text-isoko-gold">{t("market.eyebrow")}</p>
            <h2 id="marketplace-title" className="max-w-2xl text-3xl font-bold text-balance sm:text-4xl">{t("market.title")}</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">{t("market.body")}</p>
            <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-isoko-gold/30 bg-isoko-gold/10 px-4 py-2 text-sm font-bold text-isoko-gold"><i className="fa-solid fa-clock" />{t("market.badge")}</span>
          </div>
          <div className="relative mt-8 grid gap-3 lg:mt-0">
            {items.map(([icon, key]) => <div key={key} className="glass-card flex items-center gap-4 rounded-2xl px-5 py-4"><span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-isoko-gold"><i className={`fa-solid ${icon}`} /></span><span className="font-bold">{t(key)}</span></div>)}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
