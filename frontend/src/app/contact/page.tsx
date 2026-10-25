"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { useI18n } from "@/lib/i18n";

export default function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(String(data.get("subject")));
    const body = encodeURIComponent(`${String(data.get("name"))} (${String(data.get("email"))})\n\n${String(data.get("message"))}`);
    setSent(true);
    window.location.href = `mailto:info@isokoyubworozi.rw?subject=${subject}&body=${body}`;
  };
  const contacts = [
    ["fa-brands fa-youtube", "YouTube", "@Isokoyubworozi", "https://youtube.com/@Isokoyubworozi"],
    ["fa-solid fa-envelope", t("contact.email"), "info@isokoyubworozi.rw", "mailto:info@isokoyubworozi.rw"],
    ["fa-solid fa-location-dot", t("contact.location"), "Kigali, Rwanda", ""],
  ];

  return (
    <main id="main-content">
      <Navbar />
      <PageHero eyebrow={t("contact.eyebrow")} title={t("contact.title")} body={t("contact.body")} icon="fa-solid fa-message" image="https://res.cloudinary.com/dydg39ukk/image/upload/v1788949829/isoko-yubworozi-banner_txy0cd.png" />
      <section className="bg-isoko-canvas py-20 sm:py-24">
        <div className="section-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-14">
          <div>
            <h2 className="text-2xl font-bold text-isoko-dark">{t("contact.reach")}</h2>
            <div className="mt-6 space-y-3">{contacts.map(([icon,label,value,href]) => href ? <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="flex items-center gap-4 rounded-3xl bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lift"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-isoko-lime/30 text-isoko-emerald"><i className={icon} /></span><span><small className="block text-sm text-isoko-muted">{label}</small><strong className="text-sm text-isoko-dark">{value}</strong></span></a> : <div key={label} className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-soft"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-isoko-lime/30 text-isoko-emerald"><i className={icon} /></span><span><small className="block text-sm text-isoko-muted">{label}</small><strong className="text-sm text-isoko-dark">{value}</strong></span></div>)}</div>
            <p className="eyebrow mt-8 text-isoko-emerald">{t("contact.follow")}</p>
            <div className="mt-3 flex gap-3"><a href="https://youtube.com/@Isokoyubworozi" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="grid h-11 w-11 place-items-center rounded-full bg-isoko-forest text-white transition hover:-translate-y-1 hover:bg-isoko-lime hover:text-isoko-forest-deep"><i className="fa-brands fa-youtube" /></a><a href="https://www.facebook.com/profile.php?id=100068326084091" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full bg-isoko-forest text-white transition hover:-translate-y-1 hover:bg-isoko-lime hover:text-isoko-forest-deep"><i className="fa-brands fa-facebook-f" /></a><a href="https://www.instagram.com/fabienfarmer1?igsh=MXhkNTJ0amE0Z2xydw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full bg-isoko-forest text-white transition hover:-translate-y-1 hover:bg-isoko-lime hover:text-isoko-forest-deep"><i className="fa-brands fa-instagram" /></a></div>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl bg-white p-6 shadow-soft sm:p-8">
            <h2 className="text-2xl font-bold text-isoko-dark">{t("contact.formTitle")}</h2><p className="mt-2 text-base text-isoko-muted">{t("contact.formBody")}</p>
            {sent && <div role="status" className="mt-6 rounded-xl bg-isoko-lime/25 p-4 text-sm font-bold text-isoko-forest-deep"><i className="fa-solid fa-circle-check mr-2" />{t("contact.sent")}</div>}
            <form onSubmit={submit} className="mt-7 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2"><label className="text-sm font-bold text-isoko-dark">{t("contact.name")}<input required name="name" autoComplete="name" placeholder={t("contact.namePlaceholder")} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none transition focus:border-isoko-emerald" /></label><label className="text-sm font-bold text-isoko-dark">{t("contact.email")}<input required type="email" name="email" autoComplete="email" placeholder="name@example.com" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none transition focus:border-isoko-emerald" /></label></div>
              <label className="block text-sm font-bold text-isoko-dark">{t("contact.subject")}<input required name="subject" placeholder={t("contact.subjectPlaceholder")} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none transition focus:border-isoko-emerald" /></label>
              <label className="block text-sm font-bold text-isoko-dark">{t("contact.message")}<textarea required name="message" rows={5} placeholder={t("contact.messagePlaceholder")} className="mt-2 w-full resize-none rounded-xl border border-black/10 px-4 py-3 font-normal outline-none transition focus:border-isoko-emerald" /></label>
              <button type="submit" className="min-h-12 w-full rounded-full bg-isoko-lime px-6 py-3 text-sm font-extrabold text-isoko-forest-deep transition hover:bg-isoko-lime-soft">{t("contact.send")}</button>
            </form>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
