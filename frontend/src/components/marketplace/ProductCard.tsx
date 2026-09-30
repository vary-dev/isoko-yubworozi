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
  return <motion.article initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: Math.min(index * .05, .2) }} className="group overflow-hidden rounded-[1.5rem] border border-isoko-dark/8 bg-white shadow-[0_14px_45px_rgba(6,59,31,.07)]">
    <Link href={`/eguriro/${product._id}`} className="relative block aspect-[4/3] overflow-hidden bg-[#e8f1e9]">
      <Image fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" src={product.image} alt={localized(product.name, locale)} className="object-cover transition duration-500 group-hover:scale-105" />
      <span className="absolute left-3 top-3 rounded-full bg-white/92 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-isoko-dark backdrop-blur">{product.category}</span>
      <span className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-[10px] font-black ${product.inStock ? 'bg-isoko-dark text-white' : 'bg-red-600 text-white'}`}>{product.inStock ? words.stock : words.unavailable}</span>
    </Link>
    <div className="p-5">
      <h2 className="line-clamp-1 text-base font-bold text-isoko-dark">{localized(product.name, locale)}</h2>
      <p className="mt-2 line-clamp-2 min-h-10 text-xs leading-5 text-slate-500">{localized(product.description, locale)}</p>
      <p className="mt-4 text-sm font-black text-isoko-primary">{product.hasPrice && product.price ? `${product.price.toLocaleString()} RWF` : words.ask}</p>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-isoko-dark/8 pt-4">
        <Link href={`/eguriro/${product._id}`} className="inline-flex items-center gap-2 text-xs font-black text-isoko-dark transition hover:text-isoko-accent"><i className="fa-regular fa-eye text-isoko-accent" />{words.details}<i className="fa-solid fa-arrow-right text-[9px]" /></Link>
        {product.inStock && <ProductActions productId={product._id} compact />}
      </div>
    </div>
  </motion.article>;
}
