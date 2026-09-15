"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/ui/PageHero';
import ContentSkeleton from '@/components/ui/ContentSkeleton';
import { fetchArticles } from '@/lib/api';
import { useI18n } from '@/lib/i18n';

interface Article { _id:string; title:string; slug:string; content:string; category:string; image:string; author:string; createdAt:string }
const text = (html:string) => html.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();

export default function BlogPage() {
  const { t, locale } = useI18n();
  const [articles,setArticles] = useState<Article[]>([]);
  const [loading,setLoading] = useState(true);
  const [filter,setFilter] = useState('All');
  useEffect(() => { fetchArticles().then(res => setArticles(res.data)).finally(() => setLoading(false)); }, []);
  const categories = ['All', ...Array.from(new Set(articles.map(article => article.category).filter(Boolean)))];
  const filtered = filter === 'All' ? articles : articles.filter(article => article.category === filter);
  const localeCode = locale === 'rw' ? 'rw-RW' : locale === 'fr' ? 'fr-FR' : 'en-US';

  return <main id="main-content">
    <Navbar />
    <PageHero eyebrow={t('blog.eyebrow')} title={t('blog.title')} body={t('blog.body')} icon="fa-solid fa-newspaper" image="https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1800&auto=format&fit=crop" />
    <section className="min-h-[60vh] bg-[#f5faf6] py-16"><div className="section-shell">
      {!loading && categories.length > 2 && <div className="mb-9 flex gap-2 overflow-x-auto pb-2">{categories.map(category => <button key={category} onClick={() => setFilter(category)} className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-extrabold ${filter === category ? 'bg-isoko-dark text-white' : 'border border-isoko-dark/10 bg-white text-slate-600'}`}>{category === 'All' ? t('common.all') : category}</button>)}</div>}
      {loading && <ContentSkeleton count={6} />}
      {!loading && filtered.length > 0 && <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.map((article,index) => <motion.article key={article._id} initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:Math.min(index*.05,.2)}} className="group overflow-hidden rounded-2xl border border-isoko-dark/8 bg-white shadow-[0_10px_35px_rgba(6,59,31,.06)]">
        <Link href={`/blog/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-isoko-light">{article.image && <Image fill sizes="(max-width:768px) 100vw,33vw" src={article.image} alt={article.title} className="object-cover transition duration-500 group-hover:scale-105" />}</Link>
        <div className="p-5"><div className="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-isoko-accent"><span>{article.category}</span><span className="text-slate-300">•</span><time className="text-slate-400">{new Date(article.createdAt).toLocaleDateString(localeCode)}</time></div><h2 className="mt-3 line-clamp-2 text-lg font-bold leading-6 text-isoko-dark"><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{text(article.content)}</p><Link href={`/blog/${article.slug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold text-isoko-primary">{t('blog.read')}<i className="fa-solid fa-arrow-right text-[9px]" /></Link></div>
      </motion.article>)}</div>}
      {!loading && !filtered.length && <div className="rounded-3xl bg-white py-20 text-center text-sm font-bold text-slate-400">{t('blog.empty')}</div>}
    </div></section>
    <Footer />
  </main>;
}
