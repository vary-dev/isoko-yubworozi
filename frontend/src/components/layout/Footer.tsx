"use client";
import Link from "next/link";
import Image from "next/image";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="relative overflow-hidden bg-[#031f11] pb-8 pt-20 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(76,159,56,.22),transparent_30%)]" />
      <div className="section-shell relative">
        <div className="grid gap-12 border-b border-white/10 pb-14 lg:grid-cols-[1.35fr_.75fr_.8fr_1.1fr]">
          <div>
            <div className="inline-flex rounded-2xl bg-white p-2 shadow-xl"><Image src="https://res.cloudinary.com/dydg39ukk/image/upload/v1788943683/isoko-yubworozi-logo_ijbygk.png" alt="Isoko y'Ubworozi" width={280} height={92} className="h-16 w-auto" /></div>
            <p className="mt-6 max-w-sm text-base leading-7 text-white/62">{t("footer.body")}</p>
            <div className="mt-6 flex gap-3">
              {[
                ["fa-brands fa-youtube", "https://youtube.com/@Isokoyubworozi", "YouTube"],
                ["fa-brands fa-facebook-f", "#", "Facebook"], ["fa-brands fa-instagram", "#", "Instagram"],
              ].map(([icon, href, label]) => <a key={label} href={href} aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/8 text-white/70 transition hover:-translate-y-1 hover:bg-isoko-accent hover:text-white"><i className={icon} /></a>)}
            </div>
          </div>
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[.15em] text-isoko-gold">{t("footer.links")}</h3>
            <ul className="space-y-3 text-[15px] text-white/62">
              {[["nav.home","/"],["nav.videos","/videos"],["nav.blog","/blog"],["nav.library","/books"],["nav.about","/about"],["nav.contact","/contact"],["nav.account","/account"]].map(([key,href]) => <li key={key}><Link href={href} className="transition hover:text-white">{t(key as Parameters<typeof t>[0])}</Link></li>)}
            </ul>
          </div>
          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-[.15em] text-isoko-gold">{t("footer.resources")}</h3>
            <ul className="space-y-3 text-[15px] text-white/62"><li>{t("footer.vet")}</li><li>{t("footer.vaccine")}</li><li>{t("footer.feed")}</li><li>{t("footer.finance")}</li></ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-[.15em] text-isoko-gold">{t("footer.payments")}</h3>
            <p className="mb-5 text-sm leading-6 text-white/55">{t("footer.paymentBody")}</p>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#ffcc00] px-4 font-black text-black"><span className="grid h-7 w-7 place-items-center rounded-full border-2 border-black text-[9px]">MTN</span>MoMo</span>
              <span className="inline-flex min-h-12 items-center rounded-xl bg-white px-4 text-2xl text-[#17357c]"><i className="fa-brands fa-cc-visa" aria-label="Visa" /></span>
              <span className="inline-flex min-h-12 items-center rounded-xl bg-white px-4 text-2xl text-[#eb001b]"><i className="fa-brands fa-cc-mastercard" aria-label="Mastercard" /></span>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-white/45"><i className="fa-solid fa-lock text-isoko-accent" />{t("footer.paymentSecure")}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 pt-7 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Isoko y&apos;Ubworozi. {t("footer.rights")}</p>
          <div className="flex gap-6"><Link href="/privacy" className="hover:text-white">{t("footer.privacy")}</Link><Link href="/terms" className="hover:text-white">{t("footer.terms")}</Link></div>
        </div>
      </div>
    </footer>
  );
}
