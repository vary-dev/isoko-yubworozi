"use client";

import { AnimatePresence, motion } from 'framer-motion';

export default function Toast({ message, tone = 'success', onClose }: { message: string; tone?: 'success' | 'error' | 'info'; onClose: () => void }) {
  const colors = tone === 'error' ? 'border-red-200 bg-red-50 text-red-800' : tone === 'info' ? 'border-blue-200 bg-blue-50 text-blue-900' : 'border-emerald-200 bg-emerald-50 text-emerald-900';
  return <AnimatePresence>{message && <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} role="status" aria-live="polite" className={`fixed bottom-5 right-5 z-[150] flex max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-2xl ${colors}`}><i className={`fa-solid mt-0.5 ${tone === 'error' ? 'fa-circle-exclamation' : tone === 'info' ? 'fa-circle-info' : 'fa-circle-check'}`} /><p className="flex-1 text-sm font-bold leading-5">{message}</p><button type="button" aria-label="Close notification" onClick={onClose} className="opacity-60 hover:opacity-100"><i className="fa-solid fa-xmark" /></button></motion.div>}</AnimatePresence>;
}
