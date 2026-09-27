"use client";

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createManualBookPayment, fetchBookAccess, fetchBookPaymentStatus, verifyBookPaymentPin } from '@/lib/api';
import { getSession } from '@/lib/session';
import { useI18n } from '@/lib/i18n';

type PaymentMethod = 'mtn' | 'airtel';
type Purchase = { _id: string; status: string; txRef: string; paymentMethod: PaymentMethod; payerPhone: string; verificationCodeExpiresAt?: string };

const copy = {
  en: {
    signIn: 'Create an account or sign in to continue', owned: 'Read your premium book', start: 'Unlock with mobile money', checking: 'Checking access…',
    title: 'Pay with mobile money', body: 'Send the exact book price, then call the administrator for a one-time website access PIN.', method: 'Choose your network',
    phone: 'Number used to pay', continue: 'Create payment request', recipient: 'Send payment to', amount: 'Exact amount', reference: 'Payment reference',
    mtn1: 'Dial *182# on your MTN line', mtn2: 'Choose Send Money and follow the prompts', airtel1: 'Dial *500# on your Airtel line', airtel2: 'Choose Transfer Money and follow the prompts',
    call: 'After paying, call the administrator', waiting: 'Waiting for administrator confirmation', waitingBody: 'The administrator will check the received payment and give you a six-digit access PIN.',
    pin: 'Website access PIN', verify: 'Verify PIN and unlock book', expires: 'PIN expires in', noPin: 'Do not enter or share your MoMo/Airtel wallet PIN here. Enter only the six-digit website access PIN given by the administrator.',
    error: 'We could not complete that request. Please try again.', expired: 'The website PIN has expired. Contact the administrator for a new PIN.',
  },
  rw: {
    signIn: 'Fungura konti cyangwa winjire kugira ngo ukomeze', owned: 'Soma igitabo cyawe', start: 'Fungura ukoresheje mobile money', checking: 'Turagenzura uburenganzira…',
    title: 'Ishyura ukoresheje mobile money', body: 'Ohereza igiciro nyacyo cy’igitabo, hanyuma uhamagare umuyobozi aguhe PIN ikoreshwa rimwe kuri uru rubuga.', method: 'Hitamo umurongo',
    phone: 'Nomero wishyuriyeho', continue: 'Tangira ubusabe bw’ubwishyu', recipient: 'Ohereza amafaranga kuri', amount: 'Amafaranga nyayo', reference: 'Nomero y’ubusabe',
    mtn1: 'Kanda *182# ku murongo wa MTN', mtn2: 'Hitamo Kohereza Amafaranga ukurikize amabwiriza', airtel1: 'Kanda *500# ku murongo wa Airtel', airtel2: 'Hitamo Transfer Money ukurikize amabwiriza',
    call: 'Umaze kwishyura, hamagara umuyobozi', waiting: 'Dutegereje ko umuyobozi yemeza', waitingBody: 'Umuyobozi aragenzura amafaranga yakiriwe maze aguhe PIN y’imibare itandatu.',
    pin: 'PIN yo gufungura ku rubuga', verify: 'Emeza PIN ufungure igitabo', expires: 'PIN irarangira mu', noPin: 'Ntukandike cyangwa ngo utange PIN ya MoMo/Airtel yawe hano. Andika gusa PIN y’imibare itandatu wahawe n’umuyobozi.',
    error: 'Ntitwashoboye kubikora. Ongera ugerageze.', expired: 'PIN yo ku rubuga yarangiye. Hamagara umuyobozi aguhe indi.',
  },
  fr: {
    signIn: 'Créez un compte ou connectez-vous pour continuer', owned: 'Lire votre livre premium', start: 'Débloquer par mobile money', checking: 'Vérification de l’accès…',
    title: 'Payer par mobile money', body: 'Envoyez le prix exact du livre, puis appelez l’administrateur pour recevoir un code d’accès unique.', method: 'Choisissez votre réseau',
    phone: 'Numéro utilisé pour payer', continue: 'Créer la demande de paiement', recipient: 'Envoyer le paiement à', amount: 'Montant exact', reference: 'Référence de paiement',
    mtn1: 'Composez *182# sur votre ligne MTN', mtn2: 'Choisissez Envoyer de l’argent et suivez les instructions', airtel1: 'Composez *500# sur votre ligne Airtel', airtel2: 'Choisissez Transfer Money et suivez les instructions',
    call: 'Après le paiement, appelez l’administrateur', waiting: 'En attente de confirmation', waitingBody: 'L’administrateur vérifiera le paiement reçu et vous donnera un code d’accès à six chiffres.',
    pin: 'Code d’accès au site', verify: 'Vérifier et débloquer le livre', expires: 'Le code expire dans', noPin: 'Ne saisissez et ne partagez jamais votre code secret MoMo/Airtel ici. Utilisez uniquement le code du site remis par l’administrateur.',
    error: 'Impossible de terminer cette demande. Veuillez réessayer.', expired: 'Le code du site a expiré. Contactez l’administrateur pour un nouveau code.',
  },
};

const ADMIN_NUMBER = '0723777623';

export default function PremiumBookActions({ bookId, price }: { bookId: string; price: number }) {
  const { locale } = useI18n();
  const words = copy[locale];
  const [signedIn, setSignedIn] = useState(false);
  const [owned, setOwned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>('mtn');
  const [payerPhone, setPayerPhone] = useState('');
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [now, setNow] = useState(0);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const session = getSession();
      setSignedIn(Boolean(session));
      if (!session) { setLoading(false); return; }
      fetchBookPaymentStatus(bookId).then((response) => {
        setOwned(Boolean(response.data.owned));
        if (response.data.purchase && !response.data.owned) { setPurchase(response.data.purchase); setOpen(true); }
      }).catch(() => undefined).finally(() => setLoading(false));
    });
    return () => cancelAnimationFrame(frame);
  }, [bookId]);

  useEffect(() => {
    if (!purchase?.verificationCodeExpiresAt) return;
    const frame = requestAnimationFrame(() => setNow(Date.now()));
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => { cancelAnimationFrame(frame); window.clearInterval(timer); };
  }, [purchase?.verificationCodeExpiresAt]);

  const secondsLeft = purchase?.verificationCodeExpiresAt && now ? Math.max(0, Math.floor((new Date(purchase.verificationCodeExpiresAt).getTime() - now) / 1000)) : null;
  const countdown = secondsLeft === null ? null : `${String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:${String(secondsLeft % 60).padStart(2, '0')}`;
  const message = (requestError: unknown) => axios.isAxiosError(requestError) ? requestError.response?.data?.message || words.error : words.error;

  const createRequest = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const response = await createManualBookPayment({ bookId, paymentMethod: method, payerPhone });
      if (response.data.alreadyOwned) { setOwned(true); return; }
      setPurchase(response.data.purchase); setOpen(true);
    } catch (requestError) { setError(message(requestError)); } finally { setLoading(false); }
  };

  const verifyPin = async (event: React.FormEvent) => {
    event.preventDefault(); if (!purchase) return;
    setLoading(true); setError('');
    try {
      const response = await verifyBookPaymentPin(purchase._id, pin);
      if (response.data.verified) { setOwned(true); setOpen(false); }
    } catch (requestError) { setError(message(requestError)); } finally { setLoading(false); }
  };

  const read = async () => {
    setLoading(true); setError('');
    try { const response = await fetchBookAccess(bookId); window.open(response.data.fileUrl, '_blank', 'noopener,noreferrer'); }
    catch (requestError) { setError(message(requestError)); } finally { setLoading(false); }
  };

  if (loading && !signedIn) return <p className="text-sm font-bold text-slate-500">{words.checking}</p>;
  if (!signedIn) return <Link href={`/account?next=${encodeURIComponent(`/books/${bookId}`)}`} className="inline-flex items-center gap-2 rounded-xl bg-isoko-dark px-6 py-3.5 text-sm font-extrabold text-white transition hover:bg-isoko-primary"><i className="fa-solid fa-user-lock" />{words.signIn}</Link>;
  if (owned) return <div><button type="button" disabled={loading} onClick={read} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-isoko-accent px-6 py-3 text-sm font-extrabold text-white"><i className="fa-solid fa-book-open" />{loading ? words.checking : words.owned}</button>{error && <p className="mt-3 text-sm font-bold text-red-700">{error}</p>}</div>;

  return <div className="max-w-2xl">
    {!open && <button type="button" onClick={() => setOpen(true)} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-isoko-dark px-6 py-3 text-sm font-extrabold text-white transition hover:bg-isoko-primary"><i className="fa-solid fa-mobile-screen-button" />{words.start} — {price.toLocaleString()} RWF</button>}
    {open && <section className="overflow-hidden rounded-3xl border border-isoko-dark/10 bg-white shadow-[0_18px_55px_rgba(6,59,31,.09)]">
      <header className="bg-isoko-dark p-5 text-white sm:p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[.18em] text-isoko-light">MTN MoMo · Airtel Money</p><h2 className="mt-2 text-xl font-bold">{words.title}</h2><p className="mt-2 max-w-lg text-xs leading-5 text-white/65">{words.body}</p></div>{!purchase && <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10"><i className="fa-solid fa-xmark" /></button>}</div></header>
      {!purchase ? <form onSubmit={createRequest} className="space-y-5 p-5 sm:p-6">
        <fieldset><legend className="text-xs font-extrabold text-isoko-dark">{words.method}</legend><div className="mt-3 grid grid-cols-2 gap-3">{(['mtn', 'airtel'] as PaymentMethod[]).map((option) => <button key={option} type="button" onClick={() => setMethod(option)} className={`rounded-2xl border p-4 text-left transition ${method === option ? 'border-isoko-accent bg-isoko-light/60 ring-2 ring-isoko-accent/15' : 'border-isoko-dark/10'}`}><span className={`grid h-9 w-9 place-items-center rounded-xl text-xs font-black ${option === 'mtn' ? 'bg-[#ffcb05] text-black' : 'bg-red-600 text-white'}`}>{option === 'mtn' ? 'MTN' : 'AIR'}</span><span className="mt-3 block text-xs font-extrabold text-isoko-dark">{option === 'mtn' ? 'MTN MoMo' : 'Airtel Money'}</span></button>)}</div></fieldset>
        <label className="block text-xs font-extrabold text-isoko-dark">{words.phone}<input required inputMode="tel" value={payerPhone} onChange={(event) => setPayerPhone(event.target.value)} placeholder="078… / 073…" className="mt-2 w-full rounded-xl border border-isoko-dark/10 px-4 py-3 text-sm outline-none focus:border-isoko-accent" /></label>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}
        <button disabled={loading} className="min-h-12 w-full rounded-xl bg-isoko-accent px-5 text-sm font-extrabold text-white disabled:opacity-60">{loading ? words.checking : words.continue}</button>
      </form> : <div className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#f5faf6] p-4"><p className="text-[10px] font-black uppercase text-slate-500">{words.recipient}</p><a href="tel:+250723777623" className="mt-2 block text-base font-black text-isoko-dark">{ADMIN_NUMBER}</a></div><div className="rounded-2xl bg-[#f5faf6] p-4"><p className="text-[10px] font-black uppercase text-slate-500">{words.amount}</p><p className="mt-2 text-base font-black text-isoko-dark">{price.toLocaleString()} RWF</p></div><div className="rounded-2xl bg-[#f5faf6] p-4"><p className="text-[10px] font-black uppercase text-slate-500">{words.reference}</p><p className="mt-2 break-all text-xs font-black text-isoko-dark">{purchase.txRef}</p></div></div>
        <ol className="mt-5 space-y-3 rounded-2xl border border-isoko-dark/8 p-4 text-sm text-slate-600"><li><span className="mr-2 font-black text-isoko-accent">1.</span>{purchase.paymentMethod === 'airtel' ? words.airtel1 : words.mtn1}</li><li><span className="mr-2 font-black text-isoko-accent">2.</span>{purchase.paymentMethod === 'airtel' ? words.airtel2 : words.mtn2}</li><li><span className="mr-2 font-black text-isoko-accent">3.</span>{words.recipient}: <strong className="text-isoko-dark">{ADMIN_NUMBER}</strong></li><li><span className="mr-2 font-black text-isoko-accent">4.</span>{words.call}: <a href="tel:+250723777623" className="font-black text-isoko-primary">{ADMIN_NUMBER}</a></li></ol>
        <div className="mt-5 rounded-2xl bg-amber-50 p-4"><p className="text-xs font-extrabold text-amber-900"><i className="fa-solid fa-clock mr-2" />{purchase.status === 'pin_issued' ? (countdown && secondsLeft ? `${words.expires} ${countdown}` : words.expired) : words.waiting}</p><p className="mt-1 text-xs leading-5 text-amber-800">{words.waitingBody}</p></div>
        <form onSubmit={verifyPin} className="mt-5"><label className="text-xs font-extrabold text-isoko-dark">{words.pin}<input required inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={pin} onChange={(event) => setPin(event.target.value.replace(/\D/g, ''))} placeholder="••••••" className="mt-2 w-full rounded-xl border border-isoko-dark/10 px-4 py-3 text-center text-xl font-black tracking-[.4em] outline-none focus:border-isoko-accent" /></label><p className="mt-3 text-[11px] leading-5 text-red-700"><i className="fa-solid fa-shield-halved mr-1.5" />{words.noPin}</p>{error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-bold text-red-700">{error}</p>}<button disabled={loading || pin.length !== 6 || secondsLeft === 0} className="mt-4 min-h-12 w-full rounded-xl bg-isoko-dark px-5 text-sm font-extrabold text-white disabled:opacity-50">{loading ? words.checking : words.verify}</button></form>
      </div>}
    </section>}
  </div>;
}
