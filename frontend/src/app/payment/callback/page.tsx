"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { verifyBookPayment } from '@/lib/api';
import { getSession } from '@/lib/session';
import { useI18n } from '@/lib/i18n';

const copy = {
  en: { checking: 'Verifying your payment…', success: 'Payment verified', successBody: 'Your premium book is now available in your account.', failed: 'Payment not completed', failedBody: 'No access was granted. You can return to the book and try again safely.', account: 'Open my account', library: 'Back to library', login: 'Sign in to verify this payment' },
  rw: { checking: 'Turimo kugenzura ubwishyu…', success: 'Ubwishyu bwemejwe', successBody: 'Igitabo cyawe cyishyurwa ubu kiri kuri konti yawe.', failed: 'Ubwishyu ntibwarangiye', failedBody: 'Nta burenganzira bwatanzwe. Subira ku gitabo wongere ugerageze.', account: 'Fungura konti yanjye', library: 'Subira mu isomero', login: 'Injira kugira ngo ubwishyu bugenzurwe' },
  fr: { checking: 'Vérification de votre paiement…', success: 'Paiement vérifié', successBody: 'Votre livre premium est maintenant disponible dans votre compte.', failed: 'Paiement non finalisé', failedBody: 'Aucun accès n’a été accordé. Retournez au livre et réessayez.', account: 'Ouvrir mon compte', library: 'Retour à la bibliothèque', login: 'Connectez-vous pour vérifier ce paiement' },
};

export default function PaymentCallbackPage() {
  const { locale } = useI18n(); const words = copy[locale];
  const [state, setState] = useState<'checking' | 'success' | 'failed' | 'login'>('checking');
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const transactionId = params.get('transaction_id'); const txRef = params.get('tx_ref'); const status = params.get('status');
    if (!getSession()) { queueMicrotask(() => setState('login')); return; }
    if (!transactionId || !txRef || status === 'cancelled') { queueMicrotask(() => setState('failed')); return; }
    verifyBookPayment(transactionId, txRef).then((response) => setState(response.data.verified ? 'success' : 'failed')).catch(() => setState('failed'));
  }, []);
  const success = state === 'success'; const title = state === 'checking' ? words.checking : state === 'login' ? words.login : success ? words.success : words.failed;
  return <main id="main-content"><Navbar /><section className="grid min-h-[82vh] place-items-center bg-[#f4f8f5] px-5 pb-16 pt-32"><div className="w-full max-w-lg rounded-[2rem] border border-isoko-dark/8 bg-white p-8 text-center shadow-[0_25px_80px_rgba(6,59,31,.1)] sm:p-11"><span className={`mx-auto grid h-16 w-16 place-items-center rounded-2xl text-2xl ${state === 'checking' ? 'bg-isoko-light text-isoko-primary' : success ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}><i className={`fa-solid ${state === 'checking' ? 'fa-spinner fa-spin' : success ? 'fa-circle-check' : state === 'login' ? 'fa-user-lock' : 'fa-circle-exclamation'}`} /></span><h1 className="mt-6 text-2xl font-bold text-isoko-dark">{title}</h1>{state !== 'checking' && <p className="mt-3 text-sm leading-6 text-slate-600">{success ? words.successBody : words.failedBody}</p>}<div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/account" className="rounded-xl bg-isoko-accent px-5 py-3 text-sm font-extrabold text-white">{state === 'login' ? words.login : words.account}</Link><Link href="/books" className="rounded-xl border border-isoko-dark/10 px-5 py-3 text-sm font-extrabold text-isoko-dark">{words.library}</Link></div></div></section><Footer /></main>;
}
