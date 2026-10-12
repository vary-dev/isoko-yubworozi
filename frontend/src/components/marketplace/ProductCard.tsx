"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { localized, type Product } from '@/lib/marketplace';
import ProductActions from './ProductActions';

const copy = { en: { details: 'View details', ask: 'Ask for price', stock: 'Available', unavailable: 'Unavailable' }, rw: { details: 'Reba ibisobanuro', ask: 'Baza igiciro', stock: 'Kirahari', unavailable: 'Ntikiboneka' }, fr: { details: 'Voir les détails', ask: 'Demander le prix', stock: 'Disponible', unavailable: 'Indisponible' } };

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { locale } = useI18n(); const words = copy[locale]; const reduced = useReducedMotion();
  return <motion.article initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: Math.min(index * .05, .2) }} className="group overflow-hidden rounded-2xl border border-isoko-dark/8 bg-white shadow-[0_12px_35px_rgba(6,59,31,.07)] sm:rounded-3xl">
    <Link href={`/eguriro/${product._id}`} className="relative block aspect-[4/3] overflow-hidden bg-[#e8f1e9]">
      <Image fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" src={product.image} alt={localized(product.name, locale)} className="object-cover transition duration-500 group-hover:scale-105" />
      <span className="absolute left-2 top-2 max-w-[72%] truncate rounded-full bg-white/92 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-isoko-dark backdrop-blur sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[10px]">{product.category}</span>
      <span className={`absolute right-2 top-2 rounded-full px-2 py-1 text-[8px] font-black sm:right-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[10px] ${product.inStock ? 'bg-isoko-dark text-white' : 'bg-red-600 text-white'}`}>{product.inStock ? words.stock : words.unavailable}</span>
      {(product.images?.length || 0) > 1 && <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-[9px] font-bold text-white"><i className="fa-regular fa-images" />{product.images?.length}</span>}
    </Link>
    <div className="p-3 sm:p-4">
      <h2 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-isoko-dark sm:text-base">{localized(product.name, locale)}</h2>
      <p className="mt-1 line-clamp-2 min-h-9 text-[11px] leading-4 text-slate-500 sm:mt-2 sm:min-h-10 sm:text-xs sm:leading-5">{localized(product.description, locale)}</p>
      <p className="mt-2 text-xs font-black text-isoko-primary sm:mt-3 sm:text-sm">{product.hasPrice && product.price ? `${product.price.toLocaleString()} RWF` : words.ask}</p>
      <div className="mt-3 flex flex-col gap-2 border-t border-isoko-dark/8 pt-3 sm:mt-4 sm:pt-4">
        <Link href={`/eguriro/${product._id}`} className="inline-flex min-h-9 items-center gap-2 text-[10px] font-black text-isoko-dark transition hover:text-isoko-accent sm:text-xs"><i className="fa-regular fa-eye text-isoko-accent" />{words.details}<i className="fa-solid fa-arrow-right text-[9px]" /></Link>
        {product.inStock && <ProductActions productId={product._id} compact />}
      </div>
    </div>
  </motion.article>;
}
