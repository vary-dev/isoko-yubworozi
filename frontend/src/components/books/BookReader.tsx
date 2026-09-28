"use client";

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchBookAccess } from '@/lib/api';

export default function BookReader({ bookId, title, isPremium }: { bookId: string; title: string; isPremium: boolean }) {
  const [fileUrl, setFileUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookAccess(bookId).then(({ data }) => setFileUrl(data.fileUrl)).catch((requestError) => setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || 'This book could not be opened.' : 'This book could not be opened.'));
  }, [bookId]);

  if (error) return <div className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl"><i className="fa-solid fa-lock text-3xl text-red-600" /><h1 className="mt-4 text-2xl font-bold text-isoko-dark">Access required</h1><p className="mt-3 text-sm leading-6 text-slate-600">{error}</p><Link href={isPremium ? `/books/${bookId}` : '/account'} className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-isoko-dark px-5 text-sm font-extrabold text-white">{isPremium ? 'Return to payment' : 'Sign in'}</Link></div>;
  if (!fileUrl) return <div className="mx-auto max-w-4xl animate-pulse rounded-3xl bg-white p-8"><div className="h-6 w-56 rounded bg-slate-200" /><div className="mt-6 h-[65vh] rounded-2xl bg-slate-100" /></div>;

  return <div className="mx-auto w-full max-w-7xl"><header className="mb-4 flex flex-col gap-3 rounded-2xl bg-isoko-dark p-4 text-white sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-[.16em] text-isoko-light">Secure online reader</p><h1 className="mt-1 truncate text-lg font-bold">{title}</h1></div><div className="flex gap-2"><Link href={`/books/${bookId}`} className="inline-flex min-h-10 items-center rounded-xl border border-white/15 px-4 text-xs font-bold">Book details</Link><a href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center rounded-xl bg-white px-4 text-xs font-extrabold text-isoko-dark">Open PDF</a></div></header><div className="overflow-hidden rounded-2xl border border-isoko-dark/10 bg-white shadow-2xl"><iframe title={`Read ${title}`} src={`${fileUrl}#toolbar=1&navpanes=0&view=FitH`} className="h-[78vh] min-h-[620px] w-full" /></div><p className="mt-3 text-center text-xs text-slate-500">If the document does not appear, use “Open PDF”. Access remains protected by your verified account.</p></div>;
}
