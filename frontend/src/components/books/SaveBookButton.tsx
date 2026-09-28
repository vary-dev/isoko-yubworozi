"use client";

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchSavedBooks, toggleSavedBook } from '@/lib/api';
import { getSession } from '@/lib/session';
import Toast from '@/components/ui/Toast';

export default function SaveBookButton({ bookId }: { bookId: string }) {
  const [signedIn, setSignedIn] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const session = getSession();
      setSignedIn(Boolean(session));
      if (session) fetchSavedBooks().then(({ data }) => setSaved(data.some((book: { _id: string }) => book._id === bookId))).catch(() => undefined);
    });
    return () => cancelAnimationFrame(frame);
  }, [bookId]);

  if (!signedIn) return <Link href={`/account?next=${encodeURIComponent(`/books/${bookId}`)}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-isoko-dark/10 px-4 text-sm font-extrabold text-isoko-dark"><i className="fa-regular fa-bookmark" />Save after sign in</Link>;

  const toggle = async () => {
    setBusy(true);
    try {
      const { data } = await toggleSavedBook(bookId);
      setSaved(data.saved);
      setToast({ message: data.saved ? 'Book saved to your account.' : 'Book removed from saved books.', tone: 'success' });
    } catch (error) {
      setToast({ message: axios.isAxiosError(error) ? error.response?.data?.message || 'Could not update saved books.' : 'Could not update saved books.', tone: 'error' });
    } finally { setBusy(false); }
  };

  return <><button type="button" disabled={busy} onClick={toggle} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-isoko-dark/10 px-4 text-sm font-extrabold text-isoko-dark disabled:opacity-50"><i className={`${saved ? 'fa-solid' : 'fa-regular'} fa-bookmark text-isoko-accent`} />{saved ? 'Saved' : 'Save book'}</button>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</>;
}
