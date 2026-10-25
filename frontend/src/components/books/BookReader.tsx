"use client";

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchBookAccess } from '@/lib/api';
import { useI18n } from '@/lib/i18n';

const copy = {
  en: {
    openError: 'This book could not be opened.',
    accessTitle: 'Access required',
    returnToPayment: 'Return to payment',
    signIn: 'Sign in',
    eyebrow: 'Secure online reader',
    details: 'Book details',
    openPdf: 'Open PDF',
    read: 'Read',
    hint: 'If the document does not appear, use “Open PDF”. Access remains protected by your verified account.',
  },
  rw: {
    openError: 'Iki gitabo ntikwabashije gufunguka.',
    accessTitle: 'Uburenganzira burakenewe',
    returnToPayment: 'Subira ku kwishyura',
    signIn: 'Injira',
    eyebrow: 'Isomero ryo kuri interineti',
    details: 'Ibisobanuro by’igitabo',
    openPdf: 'Fungura PDF',
    read: 'Soma',
    hint: 'Niba inyandiko itagaragara, koresha “Fungura PDF”. Uburenganzira bukomeza kurindwa na konti yawe yemejwe.',
  },
  fr: {
    openError: 'Ce livre n’a pas pu être ouvert.',
    accessTitle: 'Accès requis',
    returnToPayment: 'Retour au paiement',
    signIn: 'Se connecter',
    eyebrow: 'Lecteur en ligne sécurisé',
    details: 'Détails du livre',
    openPdf: 'Ouvrir le PDF',
    read: 'Lire',
    hint: 'Si le document n’apparaît pas, utilisez « Ouvrir le PDF ». L’accès reste protégé par votre compte vérifié.',
  },
};

export default function BookReader({ bookId, title, isPremium }: { bookId: string; title: string; isPremium: boolean }) {
  const { locale } = useI18n();
  const words = copy[locale];
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookAccess(bookId).then(({ data }) => setFileUrl(data.fileUrl)).catch((requestError) => setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || words.openError : words.openError));
  }, [bookId, words.openError]);

  if (error) return <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl"><i className="fa-solid fa-lock text-3xl text-red-600" /><h1 className="mt-4 text-2xl font-bold text-isoko-dark">{words.accessTitle}</h1><p className="mt-3 text-sm leading-6 text-slate-600">{error}</p><Link href={isPremium ? `/books/${bookId}` : '/account'} className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-isoko-dark px-5 text-sm font-extrabold text-white">{isPremium ? words.returnToPayment : words.signIn}</Link></div>;
  if (!fileUrl) return <div className="mx-auto max-w-4xl animate-pulse rounded-3xl bg-white p-8"><div className="h-6 w-56 rounded bg-slate-200" /><div className="mt-6 h-[65vh] rounded-2xl bg-slate-100" /></div>;

  return <div className="mx-auto w-full max-w-7xl"><header className="mb-4 flex flex-col gap-3 rounded-2xl bg-isoko-forest-deep p-4 text-white sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[.16em] text-isoko-light">{words.eyebrow}</p><h1 className="mt-1 truncate text-lg font-bold">{title}</h1></div><div className="flex gap-2"><Link href={`/books/${bookId}`} className="inline-flex min-h-10 items-center rounded-xl border border-white/15 px-4 text-xs font-bold">{words.details}</Link><a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-xl bg-white px-4 text-xs font-extrabold text-isoko-dark">{words.openPdf}</a></div></header><div className="overflow-hidden rounded-2xl border border-isoko-dark/10 bg-white shadow-2xl"><iframe title={`${words.read} ${title}`} src={`${fileUrl}#toolbar=1&navpanes=0&view=FitH`} className="h-[78vh] min-h-[620px] w-full" /></div><p className="mt-3 text-center text-xs text-slate-500">{words.hint}</p></div>;
}
