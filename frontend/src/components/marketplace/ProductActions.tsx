"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { addProductToCart, fetchSavedProducts, toggleSavedProduct } from '@/lib/api';
import { getSession } from '@/lib/session';
import Toast from '@/components/ui/Toast';
import { useI18n } from '@/lib/i18n';

const copy = {
  en: { save: 'Save', saved: 'Saved', cart: 'Add to cart', added: 'Added to cart', login: 'Sign in to save products or use your cart.' },
  rw: { save: 'Bika', saved: 'Wabitswe', cart: 'Shyira mu gatebo', added: 'Byashyizwe mu gatebo', login: 'Injira kugira ngo ubike ibicuruzwa cyangwa ukoreshe agatebo.' },
  fr: { save: 'Enregistrer', saved: 'Enregistré', cart: 'Ajouter au panier', added: 'Ajouté au panier', login: 'Connectez-vous pour enregistrer ou utiliser votre panier.' },
};

export default function ProductActions({ productId, compact = false }: { productId: string; compact?: boolean }) {
  const { locale } = useI18n(); const words = copy[locale];
  const [saved, setSaved] = useState(false); const [busy, setBusy] = useState<'save'|'cart'|null>(null);
  const [toast, setToast] = useState<{ message: string; tone: 'success'|'error'|'info' } | null>(null);
  useEffect(() => { if (!getSession()) return; fetchSavedProducts().then(({ data }) => setSaved(data.some((product: { _id: string }) => product._id === productId))).catch(() => undefined); }, [productId]);
  const requireAccount = () => { if (getSession()) return true; setToast({ message: words.login, tone: 'info' }); return false; };
  const save = async () => { if (!requireAccount()) return; setBusy('save'); try { const { data } = await toggleSavedProduct(productId); setSaved(data.saved); setToast({ message: data.saved ? words.saved : words.save, tone: 'success' }); } catch (error) { setToast({ message: axios.isAxiosError(error) ? error.response?.data?.message || 'Unable to save product.' : 'Unable to save product.', tone: 'error' }); } finally { setBusy(null); } };
  const add = async () => { if (!requireAccount()) return; setBusy('cart'); try { await addProductToCart(productId); window.dispatchEvent(new Event('isoko-cart-change')); setToast({ message: words.added, tone: 'success' }); } catch (error) { setToast({ message: axios.isAxiosError(error) ? error.response?.data?.message || 'Unable to update cart.' : 'Unable to update cart.', tone: 'error' }); } finally { setBusy(null); } };
  return <>
    <div className={`flex ${compact ? 'gap-2' : 'flex-wrap gap-3'}`}>
      <button type="button" onClick={save} disabled={Boolean(busy)} aria-label={words.save} className={`${compact ? 'grid h-11 w-11 place-items-center' : 'inline-flex min-h-12 items-center gap-2 px-5'} rounded-xl border border-isoko-dark/10 bg-white font-extrabold text-isoko-dark transition hover:border-isoko-accent disabled:opacity-50`}><i className={`${saved ? 'fa-solid' : 'fa-regular'} fa-bookmark text-isoko-accent`} />{!compact && (saved ? words.saved : words.save)}</button>
      <button type="button" onClick={add} disabled={Boolean(busy)} className={`${compact ? 'min-h-11 px-4 text-xs' : 'min-h-12 px-6 text-sm'} inline-flex items-center justify-center gap-2 rounded-xl bg-isoko-dark font-extrabold text-white transition hover:bg-isoko-primary disabled:opacity-50`}><i className="fa-solid fa-basket-shopping" />{busy === 'cart' ? '…' : words.cart}</button>
    </div>
    {toast && <Toast {...toast} onClose={() => setToast(null)} />}
  </>;
}
