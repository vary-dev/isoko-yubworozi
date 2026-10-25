"use client";

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { type FormEvent, useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { whatsappUrl } from '@/lib/marketplace';

const copy = {
  en: { label: 'Talk to us', title: 'Isoko support', greeting: 'Hello! How can we help you today?', placeholder: 'Write your message…', send: 'Send', sent: 'WhatsApp is ready with your message. Tap Send in WhatsApp to deliver it.', open: 'Continue in WhatsApp', close: 'Close chat' },
  rw: { label: 'Tuganirize', title: 'Ubufasha bwa Isoko', greeting: 'Muraho! Twabafasha iki uyu munsi?', placeholder: 'Andika ubutumwa…', send: 'Ohereza', sent: 'WhatsApp yafungutse irimo ubutumwa bwawe. Kanda Ohereza muri WhatsApp kugira ngo bugere ku boherejwe.', open: 'Komeza muri WhatsApp', close: 'Funga ikiganiro' },
  fr: { label: 'Écrivez-nous', title: 'Assistance Isoko', greeting: 'Bonjour ! Comment pouvons-nous vous aider ?', placeholder: 'Écrivez votre message…', send: 'Envoyer', sent: 'WhatsApp est ouvert avec votre message. Appuyez sur Envoyer dans WhatsApp pour le transmettre.', open: 'Continuer dans WhatsApp', close: 'Fermer la discussion' },
};

export default function WhatsAppButton() {
  const { locale } = useI18n();
  const reduced = useReducedMotion();
  const words = copy[locale];
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [handoffMessage, setHandoffMessage] = useState('');

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;
    window.open(whatsappUrl(trimmed), '_blank', 'noopener,noreferrer');
    setHandoffMessage(trimmed);
    setMessage('');
  };

  return <>
    <AnimatePresence>
      {open && <motion.section role="dialog" aria-label={words.title} aria-modal="false" initial={{ opacity: 0, y: 14, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: .96 }} transition={{ duration: .18 }} className="fixed bottom-24 right-4 z-[80] flex h-[min(31rem,calc(100dvh-8rem))] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl bg-white shadow-lift sm:bottom-28 sm:right-7">
        <header className="flex items-center justify-between bg-[#075e54] px-4 py-3 text-white">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-xl"><i className="fa-brands fa-whatsapp" /></span><div><h2 className="text-sm font-extrabold">{words.title}</h2><p className="mt-0.5 text-[10px] text-white/75">WhatsApp</p></div></div>
          <button type="button" onClick={() => setOpen(false)} aria-label={words.close} className="grid h-9 w-9 place-items-center rounded-full transition hover:bg-white/15"><i className="fa-solid fa-xmark" /></button>
        </header>
        <div className="flex-1 space-y-3 overflow-y-auto bg-[radial-gradient(circle_at_15%_12%,rgba(255,255,255,.86),transparent_38%)] p-4">
          <p className="max-w-[88%] rounded-2xl rounded-tl-sm bg-white p-3 text-sm leading-6 text-slate-700 shadow-sm">{words.greeting}</p>
          {handoffMessage && <div role="status" className="ml-auto max-w-[92%] space-y-2 rounded-2xl rounded-tr-sm bg-[#dcf8c6] p-3 text-sm leading-6 text-slate-700 shadow-sm"><p>{handoffMessage}</p><p className="text-xs font-semibold">{words.sent}</p><a href={whatsappUrl(handoffMessage)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-2 rounded-lg bg-[#075e54] px-3 text-xs font-bold text-white"><i className="fa-brands fa-whatsapp" />{words.open}</a></div>}
        </div>
        <form onSubmit={sendMessage} className="flex items-end gap-2 border-t border-isoko-dark/8 bg-white p-3">
          <label className="min-w-0 flex-1"><span className="sr-only">{words.placeholder}</span><textarea rows={1} value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} placeholder={words.placeholder} className="max-h-24 min-h-11 w-full resize-y rounded-2xl bg-isoko-neutral px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#25D366]" /></label>
          <button type="submit" disabled={!message.trim()} aria-label={words.send} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#25D366] text-white transition hover:bg-[#1eae53] disabled:cursor-not-allowed disabled:opacity-50"><i className="fa-solid fa-paper-plane" /></button>
        </form>
      </motion.section>}
    </AnimatePresence>
    <motion.button type="button" onClick={() => setOpen((current) => !current)} aria-label={open ? words.close : words.label} aria-expanded={open} initial={reduced ? false : { opacity: 0, y: 16 }} animate={reduced ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: [1, 1.045, 1] }} transition={reduced ? undefined : { opacity: { duration: .3 }, y: { duration: .3 }, scale: { duration: 2.2, repeat: Infinity, repeatDelay: 2.8 } }} className="group fixed bottom-5 right-4 z-[70] flex h-14 items-center rounded-full bg-[#25D366] p-1.5 text-white shadow-[0_14px_40px_rgba(15,80,43,.28)] transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#075e54] sm:bottom-7 sm:right-7">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/16 text-2xl"><i className="fa-brands fa-whatsapp" /></span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-extrabold opacity-0 transition-all duration-300 group-hover:max-w-32 group-hover:pr-4 group-hover:opacity-100 group-focus-visible:max-w-32 group-focus-visible:pr-4 group-focus-visible:opacity-100">{words.label}</span>
    </motion.button>
  </>;
}
