"use client";

import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductActions from './ProductActions';
import { localized, whatsappUrl, type Product } from '@/lib/marketplace';
import { useI18n } from '@/lib/i18n';

const copy = { en: { back: 'Back to marketplace', available: 'Available', unavailable: 'Currently unavailable', description: 'Product information', price: 'Price', ask: 'Price available on request', inquiry: 'Ask on WhatsApp', note: 'Send us an inquiry and our team will confirm availability, product guidance and delivery options.' }, rw: { back: 'Subira mu Eguriro', available: 'Kirahari', unavailable: 'Ntikiboneka ubu', description: 'Ibisobanuro by’igicuruzwa', price: 'Igiciro', ask: 'Baza igiciro', inquiry: 'Baza kuri WhatsApp', note: 'Twoherereze ubutumwa, tugufashe kumenya niba gihari, uko gikoreshwa n’uburyo cyakugezaho.' }, fr: { back: 'Retour au marché', available: 'Disponible', unavailable: 'Indisponible', description: 'Informations produit', price: 'Prix', ask: 'Prix sur demande', inquiry: 'Demander sur WhatsApp', note: 'Envoyez une demande pour confirmer la disponibilité, les conseils et la livraison.' } };

export default function ProductDetail({ product }: { product: Product }) {
  const { locale } = useI18n(); const words = copy[locale]; const name = localized(product.name, locale); const description = localized(product.description, locale);
  const message = `Hello Isoko y’Ubworozi, I am interested in ${name} (${product.category}). Please share availability${product.hasPrice && product.price ? ` and confirm the price of ${product.price.toLocaleString()} RWF` : ' and price'}.`;
  return <main id="main-content"><Navbar /><section className="min-h-screen bg-[#f4f8f5] pb-20 pt-28"><div className="section-shell"><Link href="/eguriro" className="inline-flex items-center gap-2 text-sm font-extrabold text-isoko-primary"><i className="fa-solid fa-arrow-left" />{words.back}</Link>
    <div className="mt-7 overflow-hidden rounded-[2rem] border border-isoko-dark/8 bg-white shadow-[0_25px_80px_rgba(6,59,31,.1)] lg:grid lg:grid-cols-2">
      <div className="relative aspect-square min-h-[24rem] bg-[#e7efe8] lg:aspect-auto"><Image fill priority sizes="(max-width:1024px) 100vw,50vw" src={product.image} alt={name} className="object-cover" /></div>
      <div className="flex flex-col p-7 sm:p-10 lg:p-12"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-isoko-light px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-isoko-primary">{product.category}</span><span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${product.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>{product.inStock ? words.available : words.unavailable}</span></div>
        <h1 className="mt-6 text-3xl font-bold text-isoko-dark sm:text-4xl">{name}</h1><p className="mt-7 text-xs font-black uppercase tracking-[.14em] text-isoko-accent">{words.description}</p><p className="mt-3 text-base leading-8 text-slate-600">{description}</p>
        <div className="mt-8 rounded-2xl bg-[#f4f8f5] p-5"><p className="text-[10px] font-black uppercase tracking-wider text-slate-500">{words.price}</p><p className="mt-2 text-xl font-black text-isoko-dark">{product.hasPrice && product.price ? `${product.price.toLocaleString()} RWF` : words.ask}</p></div>
        <p className="mt-5 text-xs leading-6 text-slate-500">{words.note}</p><div className="mt-7 flex flex-wrap gap-3">{product.inStock && <ProductActions productId={product._id} />}<a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#25D366] px-6 text-sm font-extrabold text-white"><i className="fa-brands fa-whatsapp text-lg" />{words.inquiry}</a></div>
      </div>
    </div></div></section><Footer /></main>;
}
