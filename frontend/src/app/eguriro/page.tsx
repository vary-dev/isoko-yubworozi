"use client";

import { useEffect, useMemo, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/ui/PageHero';
import ProductCard from '@/components/marketplace/ProductCard';
import { fetchProducts } from '@/lib/api';
import { type Product } from '@/lib/marketplace';
import { useI18n } from '@/lib/i18n';

const copy = {
  en: { eyebrow: 'Isoko marketplace', title: 'Practical tools for productive farms', body: 'Explore poultry equipment, livestock care products, medicines, feeds and agricultural tools selected for farmers.', search: 'Search products', all: 'All products', empty: 'No products match your search.', error: 'The marketplace could not load. Please try again.' },
  rw: { eyebrow: 'Eguriro ry’Isoko', title: 'Ibikoresho bifasha ubworozi gutanga umusaruro', body: 'Shakisha imashini, imiti y’amatungo, ibiryo n’ibindi bikoresho bifasha aborozi n’abahinzi.', search: 'Shakisha ibicuruzwa', all: 'Ibicuruzwa byose', empty: 'Nta bicuruzwa bihuye n’ibyo ushaka.', error: 'Eguriro ntiryabashije gufunguka. Ongera ugerageze.' },
  fr: { eyebrow: 'Marché Isoko', title: 'Des outils pratiques pour des fermes productives', body: 'Découvrez des équipements avicoles, soins vétérinaires, aliments et outils agricoles sélectionnés pour les éleveurs.', search: 'Rechercher', all: 'Tous les produits', empty: 'Aucun produit ne correspond à votre recherche.', error: 'Le marché ne peut pas être chargé. Réessayez.' },
};

export default function MarketplacePage() {
  const { locale } = useI18n(); const words = copy[locale];
  const [products, setProducts] = useState<Product[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [query, setQuery] = useState(''); const [category, setCategory] = useState('all');
  useEffect(() => { fetchProducts().then(({ data }) => setProducts(data)).catch(() => setError(words.error)).finally(() => setLoading(false)); }, [words.error]);
  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))), [products]);
  const visible = useMemo(() => products.filter((product) => (category === 'all' || product.category === category) && [product.name.rw, product.name.en, product.name.fr, product.description.rw, product.category].join(' ').toLowerCase().includes(query.toLowerCase())), [products, query, category]);
  return <main id="main-content"><Navbar /><PageHero eyebrow={words.eyebrow} title={words.title} body={words.body} icon="fa-solid fa-store" image="https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=1800&q=85" />
    <section className="bg-[#f5f8f5] py-14 sm:py-20"><div className="section-shell">
      <div className="sticky top-20 z-20 rounded-2xl border border-isoko-dark/8 bg-white/92 p-3 shadow-[0_12px_40px_rgba(6,59,31,.07)] backdrop-blur-xl sm:flex sm:items-center sm:gap-4">
        <label className="relative block flex-1"><span className="sr-only">{words.search}</span><i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={words.search} className="min-h-12 w-full rounded-xl bg-[#f4f8f5] pl-11 pr-4 text-sm outline-none ring-isoko-accent focus:ring-2" /></label>
        <div className="mt-3 flex gap-2 overflow-x-auto sm:mt-0">{['all', ...categories].map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 rounded-xl px-4 py-3 text-xs font-extrabold ${category === item ? 'bg-isoko-dark text-white' : 'bg-[#f4f8f5] text-isoko-dark'}`}>{item === 'all' ? words.all : item}</button>)}</div>
      </div>
      {error && <p role="alert" className="mt-6 rounded-2xl bg-red-50 p-4 font-bold text-red-700">{error}</p>}
      {loading ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="aspect-[.78] animate-pulse rounded-3xl bg-white" />)}</div> : visible.length ? <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visible.map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}</div> : <div className="mt-10 rounded-3xl border border-dashed border-isoko-dark/15 bg-white py-20 text-center"><i className="fa-solid fa-seedling text-3xl text-isoko-accent" /><p className="mt-3 text-sm font-bold text-slate-500">{words.empty}</p></div>}
    </div></section><Footer /></main>;
}
