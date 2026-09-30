"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/marketplace/ProductCard';
import { fetchProducts } from '@/lib/api';
import type { Product } from '@/lib/marketplace';
import { useI18n } from '@/lib/i18n';

const copy = { en: { eyebrow: 'Eguriro marketplace', title: 'Tools and products for better farming', body: 'Explore equipment, livestock medicines, feeds and practical agricultural products. Save useful items or send your cart through WhatsApp.', action: 'Explore all products', empty: 'New agricultural products will appear here as soon as they are published.' }, rw: { eyebrow: 'Eguriro ry’Ubworozi', title: 'Ibikoresho n’ibicuruzwa biteza imbere ubworozi', body: 'Reba imashini, imiti y’amatungo, ibiryo n’ibindi bikoresho. Bika ibyo ushaka cyangwa wohereze agatebo kuri WhatsApp.', action: 'Reba ibicuruzwa byose', empty: 'Ibicuruzwa bishya bizagaragara hano umuyobozi akimara kubishyiraho.' }, fr: { eyebrow: 'Marché Eguriro', title: 'Outils et produits pour une agriculture performante', body: 'Découvrez équipements, médicaments vétérinaires, aliments et produits agricoles. Enregistrez-les ou envoyez votre panier sur WhatsApp.', action: 'Voir tous les produits', empty: 'Les nouveaux produits apparaîtront ici dès leur publication.' } };

export default function MarketplacePreview() {
  const { locale } = useI18n(); const words = copy[locale]; const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { fetchProducts({ featured: true }).then(({ data }) => setProducts(data.slice(0, 4))).catch(() => undefined); }, []);
  return <section className="bg-[#f3f8f4] py-20 sm:py-24" aria-labelledby="marketplace-title"><div className="section-shell"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-extrabold uppercase tracking-[.17em] text-isoko-accent">{words.eyebrow}</p><h2 id="marketplace-title" className="mt-3 max-w-2xl text-3xl font-bold text-isoko-dark sm:text-4xl">{words.title}</h2><p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{words.body}</p></div><Link href="/eguriro" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-xl bg-isoko-dark px-6 text-sm font-extrabold text-white">{words.action}<i className="fa-solid fa-arrow-right" /></Link></div>
    {products.length ? <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}</div> : <div className="mt-9 rounded-[2rem] bg-isoko-dark p-8 text-white sm:p-10"><i className="fa-solid fa-store text-2xl text-isoko-gold" /><p className="mt-4 max-w-xl text-sm leading-6 text-white/70">{words.empty}</p></div>}
  </div></section>;
}
