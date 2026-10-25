"use client";
/* eslint-disable @next/next/no-img-element -- media library assets can use arbitrary remote hosts */

import { useEffect, useState } from 'react';
import { FiCheck, FiCopy, FiImage, FiX } from 'react-icons/fi';
import { getApiErrorMessage, getMedia } from '@/lib/api';

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  type: string;
  source: string;
  usageHref?: string;
  updatedAt?: string;
}

export default function MediaPicker({ open, onClose, onSelect }: {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
}) {
  if (!open) return null;
  return <MediaPickerDialog onClose={onClose} onSelect={onSelect} />;
}

function MediaPickerDialog({ onClose, onSelect }: {
  onClose: () => void;
  onSelect: (asset: MediaAsset) => void;
}) {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    let active = true;
    getMedia()
      .then((response) => { if (active) setItems(response.data); })
      .catch((requestError: unknown) => { if (active) setError(getApiErrorMessage(requestError, 'Could not load the media library.')); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return <div className="fixed inset-0 z-[120] grid place-items-center p-2 sm:p-4">
    <button className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close media library" onClick={onClose} />
    <section role="dialog" aria-modal="true" aria-label="Media library" className="surface relative z-10 flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl sm:max-h-[82vh] sm:rounded-[2rem]">
      <header className="flex items-start justify-between gap-3 border-b border-ink/8 p-4 sm:p-6">
        <div><h2 className="text-lg font-semibold sm:text-xl">Choose reusable media</h2><p className="mt-1 text-xs text-slate">Brand assets and media already used across the platform.</p></div>
        <button type="button" onClick={onClose} aria-label="Close media library" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl hover:bg-mist"><FiX size={22} /></button>
      </header>
      {error && <p role="alert" className="m-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800 sm:m-6">{error}</p>}
      <div className="grid grid-cols-2 gap-3 overflow-y-auto p-4 sm:grid-cols-3 sm:gap-4 sm:p-6 lg:grid-cols-4">
        {loading && [1, 2, 3, 4].map((index) => <div key={index} className="aspect-square animate-pulse rounded-2xl bg-mist" />)}
        {!loading && !error && items.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
          <button type="button" onClick={() => { onSelect(item); onClose(); }} className="block aspect-[4/3] w-full bg-mist">
            <img src={item.url} alt={item.title} className="h-full w-full object-cover" />
          </button>
          <div className="p-3"><p className="truncate text-xs font-bold">{item.title}</p><div className="mt-2 flex items-center justify-between gap-2">
            <span className="truncate text-[10px] uppercase text-slate">{item.source}</span>
            <button type="button" aria-label={`Copy ${item.title} media URL`} onClick={async () => { await navigator.clipboard.writeText(item.url); setCopied(item.id); }} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate hover:bg-mist">
              {copied === item.id ? <FiCheck className="text-leaf" /> : <FiCopy />}
            </button>
          </div></div>
        </article>)}
        {!loading && !error && !items.length && <div className="col-span-full py-12 text-center text-slate sm:py-16"><FiImage className="mx-auto mb-3" size={28} /><p>No media is available yet.</p></div>}
      </div>
    </section>
  </div>;
}
