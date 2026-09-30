"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { whatsappUrl } from '@/lib/marketplace';

const labels = { en: 'Talk to us', rw: 'Tuganirize', fr: 'Écrivez-nous' };

export default function WhatsAppButton() {
  const { locale } = useI18n();
  const reduced = useReducedMotion();
  return <motion.a href={whatsappUrl('Hello Isoko y’Ubworozi, I would like your help.')} target="_blank" rel="noopener noreferrer" aria-label={labels[locale]}
    initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
    className="group fixed bottom-5 right-5 z-[70] flex h-14 items-center rounded-full bg-[#25D366] p-1.5 text-white shadow-[0_14px_40px_rgba(15,80,43,.28)] transition hover:-translate-y-1 sm:bottom-7 sm:right-7">
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/16 text-2xl"><i className="fa-brands fa-whatsapp" /></span>
    <motion.span initial={reduced ? false : { width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} transition={{ delay: .7, duration: .45 }} className="overflow-hidden whitespace-nowrap pr-4 text-sm font-extrabold">{labels[locale]}</motion.span>
  </motion.a>;
}
