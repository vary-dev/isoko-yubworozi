"use client";

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';
import { localized, type Product } from '@/lib/marketplace';
import MediaFrame from '@/components/ui/MediaFrame';
import ProductActions from './ProductActions';

const copy = { en: { details: 'View details', ask: 'Ask for price', stock: 'Available', unavailable: 'Unavailable' }, rw: { details: 'Reba ibisobanuro', ask: 'Baza igiciro', stock: 'Kirahari', unavailable: 'Ntikiboneka' }, fr: { details: 'Voir les détails', ask: 'Demander le prix', stock: 'Disponible', unavailable: 'Indisponible' } };

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { locale } = useI18n(); const words = copy[locale]; const reduced = useReducedMotion();
  return <motion.article initial={reduced ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: Math.min(index * .05, .2) }} className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift">
    <Link href={`/eguriro/${product._id}`} className="relative block aspect-[4/3] overflow-hidden bg-isoko-neutral">
      <MediaFrame fit="contain" zoom sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" src={product.image} alt={localized(product.name, locale)} className="absolute inset-0" icon="fa-solid fa-seedling" />
      <span className="absolute left-2 top-2 max-w-[72%] truncate rounded-full bg-white/92 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-isoko-forest backdrop-blur sm:left-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[10px]">{product.category}</span>
      <span className={`absolute right-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-[8px] font-black sm:right-3 sm:top-3 sm:px-3 sm:py-1.5 sm:text-[10px] ${product.inStock ? 'bg-isoko-forest text-white' : 'bg-isoko-neutral text-isoko-muted'}`}><i aria-hidden="true" className={`fa-solid ${product.inStock ? 'fa-circle-check' : 'fa-circle-xmark'} text-[8px] sm:text-[9px]`} />{product.inStock ? words.stock : words.unavailable}</span>
      {(product.images?.length || 0) > 1 && <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-1 text-[9px] font-bold text-white"><i aria-hidden="true" className="fa-regular fa-images" />{product.images?.length}</span>}
    </Link>
    <div className="flex flex-1 flex-col p-3 sm:p-4">
      <h2 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-isoko-forest sm:text-base">{localized(product.name, locale)}</h2>
      <p className="mt-1 line-clamp-2 min-h-9 text-[11px] leading-4 text-isoko-muted sm:mt-2 sm:min-h-10 sm:text-xs sm:leading-5">{localized(product.description, locale)}</p>
      <p className="mt-2 text-xs font-black text-isoko-emerald sm:mt-3 sm:text-sm">{product.hasPrice && product.price ? `${product.price.toLocaleString()} RWF` : words.ask}</p>
      <div className="mt-auto flex flex-col gap-2 border-t border-black/5 pt-3 sm:pt-4">
        <div className="mt-1 flex items-center justify-between gap-2">
          <Link href={`/eguriro/${product._id}`} className="inline-flex min-h-9 items-center gap-2 text-[10px] font-black text-isoko-forest transition hover:text-isoko-emerald sm:text-xs"><i aria-hidden="true" className="fa-regular fa-eye text-isoko-emerald" />{words.details}<i aria-hidden="true" className="fa-solid fa-arrow-right text-[9px]" /></Link>
          {product.inStock && <ProductActions productId={product._id} compact />}
        </div>
      </div>
    </div>
  </motion.article>;
}
