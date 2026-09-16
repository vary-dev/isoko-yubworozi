"use client";
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { FiCheckCircle, FiClock, FiExternalLink, FiEye, FiRefreshCw, FiYoutube } from 'react-icons/fi';
import AdminPageHeader from '@/components/ui/AdminPageHeader';
import { getYouTubeChannelVideos, syncYouTubeChannel } from '@/lib/api';

interface ChannelVideo { id:string; title:string; description:string; youtubeUrl:string; thumbnail:string; viewCount:number; likeCount:number; commentCount:number; duration:string; publishedAt:string }
const compact = (value:number) => new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(value);

export default function VideoAdmin() {
  const [videos,setVideos] = useState<ChannelVideo[]>([]);
  const [loading,setLoading] = useState(true);
  const [busy,setBusy] = useState(false);
  const [notice,setNotice] = useState('');
  const [error,setError] = useState('');
  const load = async () => { try { const {data}=await getYouTubeChannelVideos(24); setVideos(data.videos||[]); setError(''); } catch(requestError:unknown) { const err=requestError as{response?:{data?:{message?:string}}}; setError(err.response?.data?.message||'The YouTube channel could not be loaded.'); } finally { setLoading(false); } };
  useEffect(()=>{const timer=window.setTimeout(()=>void load(),0);return()=>window.clearTimeout(timer)},[]);
  const sync = async () => { setBusy(true);setNotice('');setError('');try{const{data}=await syncYouTubeChannel(24);setNotice(`${data.message}. The public video pages now use the refreshed metadata.`);await load()}catch(requestError:unknown){const err=requestError as{response?:{data?:{message?:string}}};setError(err.response?.data?.message||'Synchronization failed. Check the server-side YouTube API configuration.')}finally{setBusy(false)} };
  const metrics=useMemo(()=>({views:videos.reduce((sum,video)=>sum+video.viewCount,0),likes:videos.reduce((sum,video)=>sum+video.likeCount,0)}),[videos]);

  return <div className="space-y-8">
    <AdminPageHeader eyebrow="YouTube Data API v3" title="Channel control centre" description="Videos are managed on YouTube. This workspace previews the live channel and refreshes the website's resilient metadata cache—there is no duplicate manual upload workflow." action={<button onClick={sync} disabled={busy} className="primary-button"><FiRefreshCw className={busy?'animate-spin':''}/>{busy?'Refreshing…':'Refresh channel data'}</button>} />
    {notice&&<div role="status" className="flex items-start gap-3 rounded-2xl border border-leaf/15 bg-leaf/5 p-4 text-sm text-forest"><FiCheckCircle className="mt-0.5 shrink-0"/>{notice}</div>}
    {error&&<div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    <section className="grid gap-4 sm:grid-cols-3">
      {[{label:'Latest videos loaded',value:videos.length,icon:FiYoutube},{label:'Combined views',value:compact(metrics.views),icon:FiEye},{label:'Combined likes',value:compact(metrics.likes),icon:FiCheckCircle}].map(item=><article key={item.label} className="surface rounded-3xl p-6"><item.icon className="text-leaf"/><p className="mt-7 text-xs font-bold text-slate">{item.label}</p><p className="mt-1 text-3xl font-semibold text-forest">{loading?'—':item.value}</p></article>)}
    </section>
    <section className="surface rounded-3xl p-5 sm:p-7"><div className="mb-6 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-red-600"><FiYoutube/></span><div><h2 className="text-base font-semibold">Live @isokoyubworozi feed</h2><p className="text-xs text-slate">Titles, thumbnails and engagement information come directly from YouTube.</p></div></div>
      {loading?<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{[1,2,3,4,5,6].map(i=><div key={i} className="aspect-video animate-pulse rounded-2xl bg-mist"/>)}</div>:videos.length?<div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{videos.map(video=><article key={video.id} className="overflow-hidden rounded-2xl border border-ink/8 bg-white"><div className="relative aspect-video bg-mist"><Image fill sizes="(max-width:768px) 100vw, 33vw" src={video.thumbnail} alt={video.title} className="object-cover"/></div><div className="p-4"><h3 className="line-clamp-2 text-sm font-bold leading-5">{video.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate">{video.description}</p><div className="mt-4 flex items-center gap-4 border-t border-ink/5 pt-3 text-[10px] font-bold text-slate"><span className="flex items-center gap-1"><FiEye/>{compact(video.viewCount)}</span><span className="flex items-center gap-1"><FiClock/>{new Date(video.publishedAt).toLocaleDateString()}</span><a href={video.youtubeUrl} target="_blank" rel="noreferrer" aria-label={`Open ${video.title} on YouTube`} className="ml-auto text-forest"><FiExternalLink/></a></div></div></article>)}</div>:<div className="rounded-2xl bg-mist py-16 text-center text-sm text-slate">No channel videos were returned.</div>}
    </section>
    <section className="rounded-3xl border border-gold/30 bg-gold/10 p-6"><h2 className="text-sm font-semibold text-forest">Publishing workflow</h2><ol className="mt-4 grid gap-3 text-xs leading-5 text-slate sm:grid-cols-3"><li><strong className="text-forest">1. Publish on YouTube.</strong><br/>Upload, edit or remove the video in YouTube Studio.</li><li><strong className="text-forest">2. Refresh metadata.</strong><br/>Use the button above for an immediate refresh.</li><li><strong className="text-forest">3. Website updates.</strong><br/>The frontend loads the latest channel videos and uses the database only as an outage fallback.</li></ol></section>
  </div>;
}
