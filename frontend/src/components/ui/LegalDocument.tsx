"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useI18n } from "@/lib/i18n";

export default function LegalDocument({ type }: { type: "privacy" | "terms" }) {
  const { t } = useI18n();
  const sections = [1,2,3,4,5] as const;
  const key = (value: string) => value as Parameters<typeof t>[0];
  return <main id="main-content"><Navbar /><header className="bg-isoko-dark px-5 pb-16 pt-32 text-white"><div className="mx-auto max-w-4xl"><p className="text-sm font-extrabold uppercase tracking-[.17em] text-isoko-gold">{t(key(`${type}.eyebrow`))}</p><h1 className="mt-3 text-3xl font-bold sm:text-5xl">{t(key(`${type}.title`))}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-white/70">{t(key(`${type}.intro`))}</p><p className="mt-4 text-sm text-white/45">{t(key(`${type}.updated`))}</p></div></header><section className="bg-[#f4f8f5] py-16"><article className="mx-auto max-w-4xl rounded-3xl border border-isoko-dark/8 bg-white p-6 shadow-sm sm:p-10">{sections.map(number => <section key={number} className="border-b border-black/6 py-7 first:pt-0 last:border-0 last:pb-0"><h2 className="text-xl font-bold text-isoko-dark">{t(key(`${type}.s${number}`))}</h2><p className="mt-3 text-base leading-8 text-slate-600">{t(key(`${type}.p${number}`))}</p></section>)}</article></section><Footer /></main>;
}
