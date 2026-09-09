"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { useI18n } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";

export default function AboutPage() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const values = [
    ["fa-graduation-cap", "about.valueEducation", "about.valueEducationBody"],
    ["fa-microscope", "about.valueEvidence", "about.valueEvidenceBody"],
    ["fa-seedling", "about.valueSustainability", "about.valueSustainabilityBody"],
  ] as const;
  const faqs = [["faq.q1","faq.a1"],["faq.q2","faq.a2"],["faq.q3","faq.a3"],["faq.q4","faq.a4"],["faq.q5","faq.a5"]] as const;

  return (
    <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: t(question), acceptedAnswer: { "@type": "Answer", text: t(answer) } })) }) }} />
      <Navbar />
      <PageHero eyebrow={t("about.eyebrow")} title={t("about.title")} body={t("about.body")} icon="fa-solid fa-people-group" image="https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1800&auto=format&fit=crop" />

      <section className="bg-white py-20 sm:py-24">
        <div className="section-shell grid items-start gap-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
          <motion.div initial={reduced ? false : { opacity: 0, x: -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="mb-3 text-sm font-extrabold uppercase tracking-[.17em] text-isoko-accent">{t("about.missionEyebrow")}</p>
            <h2 className="max-w-2xl text-3xl font-bold text-isoko-dark text-balance sm:text-4xl">{t("about.missionTitle")}</h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-600"><p>{t("about.missionBody1")}</p><p>{t("about.missionBody2")}</p></div>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {[["100+","about.statLessons"],["5K+","about.statFarmers"],["3","about.statLanguages"],["Weekly","about.statUpdates"]].map(([number,key]) => <div key={key} className="rounded-2xl border border-isoko-dark/8 bg-[#f5faf6] p-5 sm:p-6"><strong className="font-display text-2xl text-isoko-dark sm:text-3xl">{number}</strong><p className="mt-1 text-sm text-slate-500">{t(key as Parameters<typeof t>[0])}</p></div>)}
          </div>
        </div>
      </section>

      <section className="bg-isoko-dark py-20 text-white sm:py-24">
        <div className="section-shell">
          <div className="mb-10 max-w-2xl"><p className="mb-3 text-sm font-extrabold uppercase tracking-[.17em] text-isoko-gold">{t("about.valuesEyebrow")}</p><h2 className="text-3xl font-bold text-balance sm:text-4xl">{t("about.valuesTitle")}</h2></div>
          <div className="grid gap-5 md:grid-cols-3">{values.map(([icon,title,body], index) => <motion.article key={title} initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * .08 }} viewport={{ once: true }} className="glass-card rounded-3xl p-7"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-isoko-gold"><i className={`fa-solid ${icon}`} /></span><h3 className="mt-6 text-xl font-bold">{t(title)}</h3><p className="mt-3 text-base leading-7 text-white/68">{t(body)}</p></motion.article>)}</div>
        </div>
      </section>

      <section className="bg-[#f4f8f5] py-20 sm:py-24" aria-labelledby="faq-title">
        <div className="section-shell grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
          <div><p className="mb-3 text-sm font-extrabold uppercase tracking-[.17em] text-isoko-accent">{t("faq.eyebrow")}</p><h2 id="faq-title" className="text-3xl font-bold text-isoko-dark text-balance sm:text-4xl">{t("faq.title")}</h2></div>
          <div className="space-y-3">{faqs.map(([question,answer]) => <details key={question} className="group rounded-2xl border border-isoko-dark/8 bg-white p-5 shadow-sm open:shadow-md"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-base font-bold text-isoko-dark sm:text-lg"><span>{t(question)}</span><i aria-hidden="true" className="fa-solid fa-plus text-sm text-isoko-accent transition-transform group-open:rotate-45" /></summary><p className="mt-4 border-t border-black/5 pt-4 text-base leading-7 text-slate-600">{t(answer)}</p></details>)}</div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="section-shell rounded-[2rem] bg-gradient-to-br from-isoko-dark to-isoko-primary px-6 py-12 text-center text-white sm:px-10"><h2 className="text-3xl font-bold">{t("about.ctaTitle")}</h2><p className="mx-auto mt-4 max-w-xl text-white/70">{t("about.ctaBody")}</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/videos" className={buttonVariants({variant:"youtube",size:"lg"})}>{t("about.ctaVideo")}</Link><Link href="/books" className={buttonVariants({variant:"glass",size:"lg"})}>{t("about.ctaLibrary")}</Link></div></div>
      </section>
      <Footer />
    </main>
  );
}
