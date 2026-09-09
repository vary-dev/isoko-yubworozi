"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import { loginUser, registerUser } from "@/lib/api";
import { useI18n } from "@/lib/i18n";

type Session = { _id: string; name: string; email: string; role: string; token: string };

export default function AccountPage() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("isoko-session");
    if (!saved) return;
    const frame = requestAnimationFrame(() => { try { setSession(JSON.parse(saved)); } catch { sessionStorage.removeItem("isoko-session"); } });
    return () => cancelAnimationFrame(frame);
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError("");
    const data = new FormData(event.currentTarget);
    try {
      const response = mode === "register"
        ? await registerUser({ name: String(data.get("name")), email: String(data.get("email")), password: String(data.get("password")) })
        : await loginUser({ email: String(data.get("email")), password: String(data.get("password")) });
      setSession(response.data); sessionStorage.setItem("isoko-session", JSON.stringify(response.data));
    } catch { setError(t("account.error")); } finally { setLoading(false); }
  };

  const logout = () => { sessionStorage.removeItem("isoko-session"); setSession(null); };

  return (
    <main id="main-content">
      <Navbar />
      <PageHero eyebrow={t("account.eyebrow")} title={t("account.title")} body={t("account.body")} icon="fa-solid fa-user-shield" image="https://res.cloudinary.com/dydg39ukk/image/upload/v1788949829/isoko-yubworozi-banner_txy0cd.png" />
      <section className="bg-[#f4f8f5] py-16 sm:py-20">
        <div className="mx-auto w-[min(100%-2.5rem,34rem)]">
          {session ? <div className="rounded-3xl border border-isoko-dark/8 bg-white p-7 shadow-[0_20px_70px_rgba(6,59,31,.08)] sm:p-9"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-isoko-light text-xl text-isoko-primary"><i className="fa-solid fa-user-check" /></span><p className="mt-6 text-sm font-extrabold uppercase tracking-[.15em] text-isoko-accent">{t("account.member")}</p><h2 className="mt-2 text-2xl font-bold text-isoko-dark">{session.name}</h2><p className="mt-1 text-slate-500">{session.email}</p><p className="mt-6 rounded-2xl bg-[#f5faf6] p-5 text-base leading-7 text-slate-600">{t("account.future")}</p><button onClick={logout} className="mt-6 min-h-11 rounded-xl border border-isoko-dark/12 px-5 text-sm font-bold text-isoko-dark hover:border-isoko-accent">{t("account.logout")}</button></div> :
          <div className="rounded-3xl border border-isoko-dark/8 bg-white p-7 shadow-[0_20px_70px_rgba(6,59,31,.08)] sm:p-9">
            <div className="grid grid-cols-2 rounded-xl bg-[#f2f7f3] p-1"><button type="button" onClick={() => { setMode("login"); setError(""); }} className={`min-h-11 rounded-lg text-sm font-bold ${mode === "login" ? "bg-white text-isoko-dark shadow-sm" : "text-slate-500"}`}>{t("account.login")}</button><button type="button" onClick={() => { setMode("register"); setError(""); }} className={`min-h-11 rounded-lg text-sm font-bold ${mode === "register" ? "bg-white text-isoko-dark shadow-sm" : "text-slate-500"}`}>{t("account.register")}</button></div>
            <form onSubmit={submit} className="mt-7 space-y-5">
              {mode === "register" && <label className="block text-sm font-bold text-isoko-dark">{t("account.name")}<input required name="name" autoComplete="name" minLength={2} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-isoko-accent" /></label>}
              <label className="block text-sm font-bold text-isoko-dark">{t("account.email")}<input required type="email" name="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-isoko-accent" /></label>
              <label className="block text-sm font-bold text-isoko-dark">{t("account.password")}<input required type="password" name="password" autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={6} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-isoko-accent" /></label>
              {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
              <button disabled={loading} className="min-h-12 w-full rounded-xl bg-isoko-accent px-5 text-sm font-extrabold text-white transition hover:bg-isoko-primary disabled:cursor-wait disabled:opacity-60">{loading ? t("account.loading") : mode === "register" ? t("account.submitRegister") : t("account.submitLogin")}</button>
            </form>
            <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="mt-5 w-full text-sm font-bold text-isoko-primary hover:underline">{mode === "login" ? t("account.switchRegister") : t("account.switchLogin")}</button>
          </div>}
        </div>
      </section>
      <Footer />
    </main>
  );
}
