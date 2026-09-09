"use client";

import { motion } from "framer-motion";

export default function PageHero({ eyebrow, title, body, image, icon }: { eyebrow: string; title: string; body: string; image: string; icon: string }) {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-16 sm:pb-20 bg-isoko-dark">
      <div className="absolute inset-0 -z-20 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-isoko-dark via-isoko-dark/90 to-isoko-primary/55" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="max-w-2xl">
          <div className="inline-flex items-center gap-2.5 mb-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
            <i aria-hidden="true" className={`${icon} text-isoko-accent`} />
            <span className="text-white/85 uppercase font-black tracking-[0.18em] text-[10px]">{eyebrow}</span>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="text-white/75 max-w-xl text-base sm:text-lg leading-relaxed">{body}</p>
        </motion.div>
      </div>
    </section>
  );
}
