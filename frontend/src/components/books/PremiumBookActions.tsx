"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createBookCheckout, fetchBookAccess, fetchBookPaymentStatus } from '@/lib/api';
import { getSession } from '@/lib/session';
import { useI18n } from '@/lib/i18n';

const copy = {
  en: { signIn: 'Create an account or sign in to continue', owned: 'Read your premium book', pay: 'Pay securely', checking: 'Checking access…', methods: 'Visa, MTN MoMo and Airtel Money', note: 'Payment is verified automatically before access is granted.', error: 'We could not start the payment. Please try again.' },
  rw: { signIn: 'Fungura konti cyangwa winjire kugira ngo ukomeze', owned: 'Soma igitabo cyawe', pay: 'Ishyura mu mutekano', checking: 'Turagenzura uburenganzira…', methods: 'Visa, MTN MoMo na Airtel Money', note: 'Ubwishyu bugenzurwa mbere y’uko uhabwa igitabo.', error: 'Ntitwashoboye gutangiza ubwishyu. Ongera ugerageze.' },
  fr: { signIn: 'Créez un compte ou connectez-vous pour continuer', owned: 'Lire votre livre premium', pay: 'Payer en sécurité', checking: 'Vérification de l’accès…', methods: 'Visa, MTN MoMo et Airtel Money', note: 'Le paiement est vérifié automatiquement avant l’accès.', error: 'Impossible de lancer le paiement. Veuillez réessayer.' },
};

export default function PremiumBookActions({ bookId, price }: { bookId: string; price: number }) {
  const { locale } = useI18n();
  const words = copy[locale];
  const [signedIn, setSignedIn] = useState(false);
  const [owned, setOwned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const session = getSession();
      setSignedIn(Boolean(session));
      if (!session) { setLoading(false); return; }
      fetchBookPaymentStatus(bookId).then((response) => setOwned(Boolean(response.data.owned))).catch(() => undefined).finally(() => setLoading(false));
    });
    return () => cancelAnimationFrame(frame);
  }, [bookId]);

  const checkout = async () => {
    setLoading(true); setError('');
    try {
      const response = await createBookCheckout(bookId);
      if (response.data.alreadyOwned) { setOwned(true); return; }
      if (response.data.checkoutUrl) window.location.assign(response.data.checkoutUrl);
    } catch { setError(words.error); } finally { setLoading(false); }
  };

  const read = async () => {
    setLoading(true); setError('');
    try {
      const response = await fetchBookAccess(bookId);
      window.open(response.data.fileUrl, '_blank', 'noopener,noreferrer');
    } catch { setError(words.error); } finally { setLoading(false); }
  };

  if (loading && !signedIn) return <p className="text-sm font-bold text-slate-500">{words.checking}</p>;
  if (!signedIn) return <Link href={`/account?next=${encodeURIComponent(`/books/${bookId}`)}`} className="inline-flex items-center gap-2 rounded-xl bg-isoko-dark px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-isoko-primary"><i className="fa-solid fa-user-lock" />{words.signIn}</Link>;

  return <div className="max-w-xl">
    <button type="button" disabled={loading} onClick={owned ? read : checkout} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-isoko-accent px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/15 transition hover:-translate-y-0.5 hover:bg-isoko-primary disabled:opacity-60">
      <i className={`fa-solid ${owned ? 'fa-book-open' : 'fa-lock'}`} />
      {loading ? words.checking : owned ? words.owned : `${words.pay} — ${price.toLocaleString()} RWF`}
    </button>
    {!owned && <div className="mt-4 rounded-2xl border border-isoko-dark/8 bg-[#f5faf6] p-4"><p className="text-xs font-extrabold text-isoko-dark">{words.methods}</p><p className="mt-1 text-xs leading-5 text-slate-500"><i className="fa-solid fa-shield-halved mr-1.5 text-isoko-accent" />{words.note}</p></div>}
    {error && <p role="alert" className="mt-3 text-sm font-bold text-red-700">{error}</p>}
  </div>;
}
