"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductActions from './ProductActions';
import { localized, whatsappUrl, type Product } from '@/lib/marketplace';
import { useI18n } from '@/lib/i18n';

const copy = { en: { back: 'Back to marketplace', available: 'Available', unavailable: 'Currently unavailable', description: 'Product information', price: 'Price', ask: 'Price available on request', inquiry: 'Ask on WhatsApp', note: 'Send us an inquiry and our team will confirm availability, product guidance and delivery options.', gallery: 'Product photos', zoom: 'Zoom product image', close: 'Close image', previous: 'Previous image', next: 'Next image' }, rw: { back: 'Subira mu Eguriro', available: 'Kirahari', unavailable: 'Ntikiboneka ubu', description: 'Ibisobanuro by’igicuruzwa', price: 'Igiciro', ask: 'Baza igiciro', inquiry: 'Baza kuri WhatsApp', note: 'Twoherereze ubutumwa, tugufashe kumenya niba gihari, uko gikoreshwa n’uburyo cyakugezaho.', gallery: 'Amafoto y’igicuruzwa', zoom: 'Kwagura ifoto', close: 'Funga ifoto', previous: 'Ifoto ibanza', next: 'Ifoto ikurikira' }, fr: { back: 'Retour au marché', available: 'Disponible', unavailable: 'Indisponible', description: 'Informations produit', price: 'Prix', ask: 'Prix sur demande', inquiry: 'Demander sur WhatsApp', note: 'Envoyez une demande pour confirmer la disponibilité, les conseils et la livraison.', gallery: 'Photos du produit', zoom: 'Agrandir la photo', close: 'Fermer la photo', previous: 'Photo précédente', next: 'Photo suivante' } };

export default function ProductDetail({ product }: { product: Product }) {
  const { locale } = useI18n();
  const words = copy[locale];
  const name = localized(product.name, locale);
  const description = localized(product.description, locale);
  const images = product.images?.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const message = `Hello Isoko y’Ubworozi, I am interested in ${name} (${product.category}). Please share availability${product.hasPrice && product.price ? ` and confirm the price of ${product.price.toLocaleString()} RWF` : ' and price'}.`;

  useEffect(() => {
    if (!zoomed) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomed(false);
      if (event.key === 'ArrowRight') setActiveImage((current) => (current + 1) % images.length);
      if (event.key === 'ArrowLeft') setActiveImage((current) => (current - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomed, images.length]);

  return <main id="main-content"><Navbar /><section className="min-h-screen bg-isoko-canvas pb-20 pt-28"><div className="section-shell"><Link href="/eguriro" className="inline-flex items-center gap-2 text-sm font-extrabold text-isoko-emerald"><i className="fa-solid fa-arrow-left" />{words.back}</Link>
    <div className="mt-7 overflow-hidden rounded-[2rem] bg-white shadow-lift lg:grid lg:grid-cols-2">
      <div className="bg-isoko-neutral p-3 sm:p-5">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-isoko-neutral">
          <button type="button" onClick={() => setZoomed(true)} aria-label={`${words.zoom}: ${name}`} className="absolute inset-0 z-10 cursor-zoom-in">
            <Image fill priority sizes="(max-width:1024px) 100vw,50vw" src={images[activeImage]} alt={name} className="object-contain transition duration-300 hover:scale-[1.03]" />
            <span className="absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-black/65 text-white"><i className="fa-solid fa-magnifying-glass-plus" /></span>
          </button>
        </div>
        {images.length > 1 && <div className="mt-3"><p className="sr-only">{words.gallery}</p><div className="flex gap-2 overflow-x-auto pb-1">{images.map((image, index) => <button key={`${image}-${index}`} type="button" onClick={() => setActiveImage(index)} aria-label={`${words.gallery} ${index + 1}`} aria-pressed={activeImage === index} className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 sm:h-20 sm:w-20 ${activeImage === index ? 'border-isoko-emerald' : 'border-transparent'}`}><Image fill sizes="80px" src={image} alt="" className="object-contain" /></button>)}</div></div>}
      </div>
      <div className="flex flex-col p-6 sm:p-10 lg:p-12"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-isoko-lime/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-isoko-forest-deep">{product.category}</span><span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${product.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>{product.inStock ? words.available : words.unavailable}</span></div>
        <h1 className="mt-6 text-3xl font-bold text-isoko-dark sm:text-4xl">{name}</h1><p className="eyebrow mt-7 text-isoko-emerald">{words.description}</p><p className="mt-3 text-base leading-8 text-isoko-muted">{description}</p>
        <div className="mt-8 rounded-2xl bg-isoko-canvas p-5"><p className="text-[10px] font-black uppercase tracking-wider text-isoko-muted">{words.price}</p><p className="mt-2 text-xl font-black text-isoko-dark">{product.hasPrice && product.price ? `${product.price.toLocaleString()} RWF` : words.ask}</p></div>
        <p className="mt-5 text-xs leading-6 text-isoko-muted">{words.note}</p><div className="mt-7 flex flex-wrap gap-3">{product.inStock && <ProductActions productId={product._id} />}<a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#25D366] px-6 text-sm font-extrabold text-white transition hover:brightness-105"><i className="fa-brands fa-whatsapp text-lg" />{words.inquiry}</a></div>
      </div>
    </div></div></section><Footer />
    {zoomed && <div role="dialog" aria-modal="true" aria-label={`${words.zoom}: ${name}`} className="fixed inset-0 z-[110] grid place-items-center bg-black/90 p-3 sm:p-8">
      <button type="button" onClick={() => setZoomed(false)} aria-label={words.close} className="absolute inset-0 cursor-zoom-out" />
      <div className="relative z-10 h-[min(82dvh,52rem)] w-[min(94vw,72rem)]">
        <Image fill sizes="94vw" src={images[activeImage]} alt={`${name} ${activeImage + 1} of ${images.length}`} className="object-contain" />
        <button type="button" onClick={() => setZoomed(false)} aria-label={words.close} className="absolute -right-1 -top-1 grid h-11 w-11 place-items-center rounded-full bg-white text-xl text-isoko-dark shadow-lg sm:right-0 sm:top-0"><i className="fa-solid fa-xmark" /></button>
        {images.length > 1 && <>
          <button type="button" onClick={() => setActiveImage((current) => (current - 1 + images.length) % images.length)} aria-label={words.previous} className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/65 text-white sm:-left-14"><i className="fa-solid fa-chevron-left" /></button>
          <button type="button" onClick={() => setActiveImage((current) => (current + 1) % images.length)} aria-label={words.next} className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/65 text-white sm:-right-14"><i className="fa-solid fa-chevron-right" /></button>
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-3 py-1 text-xs font-bold text-white">{activeImage + 1} / {images.length}</p>
        </>}
      </div>
    </div>}
  </main>;
}
