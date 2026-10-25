"use client";
/* eslint-disable @next/next/no-img-element -- media library assets can use arbitrary remote hosts */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiCheck, FiCopy, FiExternalLink } from 'react-icons/fi';
import AdminPageHeader from '@/components/ui/AdminPageHeader';
import { getMedia } from '@/lib/api';
import type { MediaAsset } from '@/components/media/MediaPicker';

export default function MediaPage() {
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [copied, setCopied] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMedia().then((response) => setItems(response.data)).catch(() => setError('Could not load the media library. Check the backend connection.')).finally(() => setLoading(false));
  }, []);

  return <div className="space-y-8">
    <AdminPageHeader eyebrow="Assets" title="Media library" description="View images and the content that uses them. Reuse trusted assets to avoid duplicate uploads." />
    {error && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}
    {loading ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{[1, 2, 3].map((index) => <div key={index} className="aspect-[4/3] animate-pulse rounded-3xl bg-white" />)}</div> : <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => <article key={item.id} className="surface overflow-hidden rounded-3xl">
        <img src={item.url} alt={item.title} className="aspect-[16/10] w-full bg-mist object-cover" />
        <div className="p-5"><span className="text-[10px] font-extrabold uppercase tracking-wider text-leaf">{item.source}</span><h2 className="mt-2 truncate text-sm font-semibold">{item.title}</h2>
          {item.updatedAt && <p className="mt-2 text-xs text-slate">Last updated {new Date(item.updatedAt).toLocaleString()}</p>}
          <div className="mt-4 flex gap-2"><button type="button" onClick={async () => { await navigator.clipboard.writeText(item.url); setCopied(item.id); }} className="secondary-button flex-1">{copied === item.id ? <FiCheck /> : <FiCopy />}{copied === item.id ? 'Copied' : 'Copy URL'}</button>
            {item.usageHref ? <Link href={item.usageHref} className="secondary-button flex-1"><FiExternalLink />Manage source</Link> : <a href={item.url} target="_blank" rel="noreferrer" aria-label="Open asset" className="secondary-button"><FiExternalLink /></a>}
          </div>
        </div>
      </article>)}
      {!items.length && !error && <p className="col-span-full rounded-3xl border border-dashed border-ink/15 bg-white py-16 text-center text-sm text-slate">No media assets are available yet.</p>}
    </div>}
  </div>;
}
