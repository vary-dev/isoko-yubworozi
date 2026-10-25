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
  en: { eyebrow: 'Isoko marketplace', title: 'Practical tools for productive farms', body: 'Explore poultry equipment, livestock care products, medicines, feeds and agricultural tools selected for farmers.', search: 'Search products', all: 'All products', empty: 'No products match your filters.', error: 'The marketplace could not load. Please try again.', availability: 'Availability', allAvailability: 'Any availability', available: 'Available only', unavailable: 'Unavailable only', pricing: 'Pricing', allPricing: 'Any price', priced: 'Has a listed price', inquiry: 'Price on request', sort: 'Sort by', featured: 'Featured', lowest: 'Lowest price', highest: 'Highest price', showing: 'products' },
  rw: { eyebrow: 'Eguriro ry’Isoko', title: 'Ibikoresho bifasha ubworozi gutanga umusaruro', body: 'Shakisha imashini, imiti y’amatungo, ibiryo n’ibindi bikoresho bifasha aborozi n’abahinzi.', search: 'Shakisha ibicuruzwa', all: 'Ibicuruzwa byose', empty: 'Nta bicuruzwa bihuye n’ibyo ushaka.', error: 'Eguriro ntiryabashije gufunguka. Ongera ugerageze.', availability: 'Kuboneka', allAvailability: 'Byose', available: 'Bihari gusa', unavailable: 'Bitariho gusa', pricing: 'Igiciro', allPricing: 'Igiciro cyose', priced: 'Bifite igiciro', inquiry: 'Baza igiciro', sort: 'Tondeka', featured: 'Byatoranyijwe', lowest: 'Igiciro gito', highest: 'Igiciro kinini', showing: 'ibicuruzwa' },
  fr: { eyebrow: 'Marché Isoko', title: 'Des outils pratiques pour des fermes productives', body: 'Découvrez des équipements avicoles, soins vétérinaires, aliments et outils agricoles sélectionnés pour les éleveurs.', search: 'Rechercher', all: 'Tous les produits', empty: 'Aucun produit ne correspond à vos filtres.', error: 'Le marché ne peut pas être chargé. Réessayez.', availability: 'Disponibilité', allAvailability: 'Toute disponibilité', available: 'Disponibles uniquement', unavailable: 'Indisponibles uniquement', pricing: 'Prix', allPricing: 'Tous les prix', priced: 'Prix indiqué', inquiry: 'Prix sur demande', sort: 'Trier par', featured: 'En vedette', lowest: 'Prix croissant', highest: 'Prix décroissant', showing: 'produits' },
};

export default function MarketplacePage() {
  const { locale } = useI18n(); const words = copy[locale];
  const [products, setProducts] = useState<Product[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [query, setQuery] = useState(''); const [category, setCategory] = useState('all');
  const [availability, setAvailability] = useState('all'); const [pricing, setPricing] = useState('all'); const [sort, setSort] = useState('featured');
  useEffect(() => { fetchProducts().then(({ data }) => setProducts(data)).catch(() => setError(words.error)).finally(() => setLoading(false)); }, [words.error]);
  const categories = useMemo(() => Array.from(new Set(products.map((product) => product.category))), [products]);
  const visible = useMemo(() => {
    const matching = products.filter((product) => {
      const hasPrice = product.hasPrice && product.price != null;
      return (category === 'all' || product.category === category)
        && (availability === 'all' || (availability === 'available' ? product.inStock : !product.inStock))
        && (pricing === 'all' || (pricing === 'priced' ? hasPrice : !hasPrice))
        && [product.name.rw, product.name.en, product.name.fr, product.description.rw, product.category].join(' ').toLowerCase().includes(query.toLowerCase());
    });
    if (sort === 'lowest') return matching.sort((a, b) => (a.price ?? Number.MAX_SAFE_INTEGER) - (b.price ?? Number.MAX_SAFE_INTEGER));
    if (sort === 'highest') return matching.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    return matching;
  }, [products, query, category, availability, pricing, sort]);
  return <main id="main-content"><Navbar /><PageHero eyebrow={words.eyebrow} title={words.title} body={words.body} icon="fa-solid fa-store" />
    <section className="bg-isoko-canvas py-14 sm:py-20"><div className="section-shell">
      <div className="sticky top-20 z-20 space-y-3 rounded-3xl bg-white p-3 shadow-soft backdrop-blur-xl sm:p-4">
        <label className="relative block"><span className="sr-only">{words.search}</span><i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-isoko-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={words.search} className="min-h-12 w-full rounded-full bg-isoko-neutral pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-isoko-emerald" /></label>
        <div className="flex gap-2 overflow-x-auto pb-1">{['all', ...categories].map((item) => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`min-h-10 shrink-0 rounded-full px-4 py-2.5 text-xs font-extrabold transition ${category === item ? 'bg-isoko-forest text-white shadow-soft' : 'bg-isoko-neutral text-isoko-dark hover:text-isoko-emerald'}`}>{item === 'all' ? words.all : item}</button>)}</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <label className="min-w-0"><span className="sr-only">{words.availability}</span><select value={availability} onChange={(event) => setAvailability(event.target.value)} className="min-h-11 w-full rounded-xl border-0 bg-isoko-neutral px-3 text-xs font-bold text-isoko-dark outline-none focus:ring-2 focus:ring-isoko-emerald"><option value="all">{words.allAvailability}</option><option value="available">{words.available}</option><option value="unavailable">{words.unavailable}</option></select></label>
          <label className="min-w-0"><span className="sr-only">{words.pricing}</span><select value={pricing} onChange={(event) => setPricing(event.target.value)} className="min-h-11 w-full rounded-xl border-0 bg-isoko-neutral px-3 text-xs font-bold text-isoko-dark outline-none focus:ring-2 focus:ring-isoko-emerald"><option value="all">{words.allPricing}</option><option value="priced">{words.priced}</option><option value="inquiry">{words.inquiry}</option></select></label>
          <label className="col-span-2 min-w-0 sm:col-span-1"><span className="sr-only">{words.sort}</span><select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-11 w-full rounded-xl border-0 bg-isoko-neutral px-3 text-xs font-bold text-isoko-dark outline-none focus:ring-2 focus:ring-isoko-emerald"><option value="featured">{words.featured}</option><option value="lowest">{words.lowest}</option><option value="highest">{words.highest}</option></select></label>
        </div>
        {!loading && <p aria-live="polite" className="px-1 text-xs font-bold text-isoko-muted">{visible.length} {words.showing}</p>}
      </div>
      {error && <p role="alert" className="mt-6 rounded-2xl bg-white p-4 font-bold text-isoko-emerald shadow-soft">{error}</p>}
      {loading ? <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">{[1,2,3,4,5,6].map((item) => <div key={item} className="aspect-[.78] animate-pulse rounded-3xl bg-white shadow-soft" />)}</div> : visible.length ? <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">{visible.map((product, index) => <ProductCard key={product._id} product={product} index={index} />)}</div> : <div className="mt-10 rounded-3xl bg-white py-20 text-center shadow-soft"><i className="fa-solid fa-seedling text-3xl text-isoko-emerald" /><p className="mt-3 text-sm font-bold text-isoko-muted">{words.empty}</p></div>}
    </div></section><Footer /></main>;
}
