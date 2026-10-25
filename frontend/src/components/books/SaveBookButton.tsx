"use client";

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchSavedBooks, toggleSavedBook } from '@/lib/api';
import { getSession } from '@/lib/session';
import Toast from '@/components/ui/Toast';
import { useI18n } from '@/lib/i18n';

const copy = {
  en: {
    signIn: 'Save after sign in',
    saved: 'Saved',
    save: 'Save book',
    savedToast: 'Book saved to your account.',
    removedToast: 'Book removed from saved books.',
    error: 'Could not update saved books.',
  },
  rw: {
    signIn: 'Bika nyuma yo kwinjira',
    saved: 'Byabitswe',
    save: 'Bika igitabo',
    savedToast: 'Igitabo kibitswe kuri konti yawe.',
    removedToast: 'Igitabo gikuritswe mu byabitswe.',
    error: 'Ntibyashobotse kuvugurura ibitabo byabitswe.',
  },
  fr: {
    signIn: 'Enregistrer après connexion',
    saved: 'Enregistré',
    save: 'Enregistrer le livre',
    savedToast: 'Livre enregistré dans votre compte.',
    removedToast: 'Livre retiré de vos livres enregistrés.',
    error: 'Impossible de mettre à jour vos livres enregistrés.',
  },
};

export default function SaveBookButton({ bookId }: { bookId: string }) {
  const { locale } = useI18n();
  const words = copy[locale];
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

  if (!signedIn) return <Link href={`/account?next=${encodeURIComponent(`/books/${bookId}`)}`} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-isoko-dark/10 px-4 text-sm font-extrabold text-isoko-dark"><i className="fa-regular fa-bookmark" />{words.signIn}</Link>;

  const toggle = async () => {
    setBusy(true);
    try {
      const { data } = await toggleSavedBook(bookId);
      setSaved(data.saved);
      setToast({ message: data.saved ? words.savedToast : words.removedToast, tone: 'success' });
    } catch (error) {
      setToast({ message: axios.isAxiosError(error) ? error.response?.data?.message || words.error : words.error, tone: 'error' });
    } finally { setBusy(false); }
  };

  return <><button type="button" disabled={busy} onClick={toggle} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-isoko-dark/10 px-4 text-sm font-extrabold text-isoko-dark disabled:opacity-50"><i className={`${saved ? 'fa-solid' : 'fa-regular'} fa-bookmark ${saved ? 'text-isoko-emerald' : 'text-isoko-muted'}`} />{saved ? words.saved : words.save}</button>{toast && <Toast {...toast} onClose={() => setToast(null)} />}</>;
}
