"use client";
import { useI18n } from "@/lib/i18n";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function YouTubeCta() {
  const { t } = useI18n();
  return <section className="relative overflow-hidden bg-isoko-primary py-24 text-white">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(244,185,66,.2),transparent_34%)]" />
    <div className="section-shell relative glass-card flex flex-col gap-8 rounded-[2.2rem] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
      <div className="max-w-2xl"><span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-red-600 text-2xl"><i className="fa-brands fa-youtube" /></span><h2 className="text-3xl font-bold sm:text-5xl">{t("cta.title")}</h2><p className="mt-4 text-lg leading-8 text-white/68">{t("cta.body")}</p></div>
      <a href="https://youtube.com/@Isokoyubworozi" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "youtube", size: "lg" }), "shrink-0")}>{t("cta.visit")}<i className="fa-solid fa-arrow-up-right-from-square text-xs" /></a>
    </div>
  </section>;
}
