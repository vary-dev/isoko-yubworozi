"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Shared inner-page hero. Uses the forest-green gradient composition so every page
 * carries the same identity without loading heavy or unverifiable imagery.
 * An approved brand image can still be layered via the optional `image` prop.
 */
export default function PageHero({ eyebrow, title, body, image, icon }: { eyebrow: string; title: string; body: string; image?: string; icon: string }) {
  const reduced = useReducedMotion();
  return (
    <section className="page-gradient relative isolate overflow-hidden pt-32 pb-16 sm:pb-20">
      {image && <div className="absolute inset-0 -z-20 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${image})` }} aria-hidden="true" />}
      <div aria-hidden="true" className="absolute -right-32 top-0 -z-10 h-80 w-80 rounded-full bg-isoko-lime/10 blur-3xl" />
      <div className="section-shell">
        <motion.div initial={reduced ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55 }} className="max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
            <i aria-hidden="true" className={`${icon} text-isoko-lime`} />
            <span className="text-white/85 uppercase font-black tracking-[0.18em] text-[10px]">{eyebrow}</span>
          </div>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-white text-balance sm:text-4xl lg:text-5xl">{title}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">{body}</p>
        </motion.div>
      </div>
    </section>
  );
}
