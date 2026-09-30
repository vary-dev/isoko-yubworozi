"use client";

import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageHero from '@/components/ui/PageHero';
import { fetchCart, fetchMyPurchases, fetchSavedBooks, fetchSavedProducts, loginUser, registerUser, updateUserProfile } from '@/lib/api';
import { clearSession, getSession, saveSession, type Session } from '@/lib/session';
import { useI18n } from '@/lib/i18n';
import { localized, type CartItem, type Product } from '@/lib/marketplace';

type Book = { _id: string; title: string; coverImage?: string; category?: string; isPremium?: boolean; price?: number };
type Purchase = { _id: string; book?: Book; amount: number; submittedAmount?: number; currency: string; status: string; paidAt?: string; paymentMarkedAt?: string; createdAt: string };

const dashboardCopy = {
  en: { heading: 'Your learning dashboard', intro: 'Premium books, saved products and marketplace inquiries stay connected to this account.', library: 'Purchased books', empty: 'You have no verified premium books yet.', explore: 'Explore the library', read: 'Read book', history: 'Payment history', secure: 'Pay from your own MTN or Airtel wallet. We never ask for or store your mobile-money PIN.', photo: 'Profile photo', photoHint: 'Add a clear JPG, PNG or WebP image (maximum 8 MB).', savePhoto: 'Save profile', saved: 'Profile updated successfully.', market: 'Your Eguriro activity', savedProducts: 'Saved products', cart: 'Products in cart', marketEmpty: 'Save useful agricultural products and they will appear here.' },
  rw: { heading: 'Ahantu hawe ho kwigira', intro: 'Ibitabo wishyuye, ibicuruzwa wabitswe n’ubusabe bwo mu Eguriro bihuzwa n’iyi konti.', library: 'Ibitabo waguze', empty: 'Nta gitabo cyishyurwa cyemejwe uragura.', explore: 'Sura isomero', read: 'Soma igitabo', history: 'Amateka y’ubwishyu', secure: 'Ishyura ukoresheje MTN cyangwa Airtel yawe. Ntidusaba kandi ntitubika PIN ya mobile money.', photo: 'Ifoto y’umwirondoro', photoHint: 'Shyiraho ifoto ya JPG, PNG cyangwa WebP itarengeje 8 MB.', savePhoto: 'Bika umwirondoro', saved: 'Umwirondoro wavuguruwe neza.', market: 'Ibyawe byo mu Eguriro', savedProducts: 'Ibicuruzwa wabitswe', cart: 'Ibiri mu gatebo', marketEmpty: 'Bika ibicuruzwa by’ingirakamaro, bizagaragara hano.' },
  fr: { heading: 'Votre espace d’apprentissage', intro: 'Vos livres premium, produits enregistrés et demandes du marché restent liés à ce compte.', library: 'Livres achetés', empty: 'Vous n’avez pas encore de livre premium vérifié.', explore: 'Explorer la bibliothèque', read: 'Lire le livre', history: 'Historique des paiements', secure: 'Payez depuis votre portefeuille MTN ou Airtel. Nous ne demandons et ne stockons jamais votre code secret mobile money.', photo: 'Photo de profil', photoHint: 'Ajoutez une image JPG, PNG ou WebP nette (8 Mo maximum).', savePhoto: 'Enregistrer le profil', saved: 'Profil mis à jour.', market: 'Votre activité Eguriro', savedProducts: 'Produits enregistrés', cart: 'Produits au panier', marketEmpty: 'Enregistrez des produits agricoles utiles; ils apparaîtront ici.' },
};

export default function AccountPage() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const words = dashboardCopy[locale];
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [session, setSession] = useState<Session | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [savedBooks, setSavedBooks] = useState<Book[]>([]);
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [error, setError] = useState('');

  const loadAccountData = () => Promise.allSettled([fetchMyPurchases(), fetchSavedBooks(), fetchSavedProducts(), fetchCart()]).then(([payments, books, products, cart]) => { setPurchases(payments.status === 'fulfilled' ? payments.value.data : []); setSavedBooks(books.status === 'fulfilled' ? books.value.data : []); setSavedProducts(products.status === 'fulfilled' ? products.value.data : []); setCartItems(cart.status === 'fulfilled' ? cart.value.data : []); });
  useEffect(() => { const frame = requestAnimationFrame(() => { const saved = getSession(); setSession(saved); if (saved) loadAccountData(); }); return () => cancelAnimationFrame(frame); }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError('');
    const data = new FormData(event.currentTarget);
    try {
      const response = mode === 'register'
        ? await registerUser({ name: String(data.get('name')), email: String(data.get('email')), password: String(data.get('password')) })
        : await loginUser({ email: String(data.get('email')), password: String(data.get('password')) });
      saveSession(response.data); setSession(response.data); await loadAccountData();
      const next = new URLSearchParams(window.location.search).get('next');
      if (next?.startsWith('/') && !next.startsWith('//')) router.push(next);
    } catch (requestError) {
      const responseCode = axios.isAxiosError(requestError) ? requestError.response?.data?.code : undefined;
      const responseMessage = axios.isAxiosError(requestError) ? requestError.response?.data?.message : undefined;
      if (responseCode === 'EMAIL_EXISTS') setMode('login');
      setError(responseMessage || t('account.error'));
    } finally { setLoading(false); }
  };

  const readBook = (bookId: string) => router.push(`/books/${bookId}/read`);
  const logout = () => { clearSession(); setSession(null); setPurchases([]); setSavedBooks([]); setSavedProducts([]); setCartItems([]); };
  const updateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session) return;
    setProfileLoading(true); setError(''); setProfileMessage('');
    try {
      const response = await updateUserProfile(new FormData(event.currentTarget));
      const nextSession = { ...session, ...response.data, token: session.token };
      saveSession(nextSession); setSession(nextSession); setProfileMessage(words.saved);
    } catch (requestError) {
      setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || t('account.error') : t('account.error'));
    } finally { setProfileLoading(false); }
  };
  const successful = purchases.filter((purchase) => purchase.status === 'successful');
  const pending = purchases.filter((purchase) => ['awaiting_payment', 'pending', 'pin_issued'].includes(purchase.status));
  const totalPaid = successful.reduce((sum, purchase) => sum + purchase.amount, 0);

  return <main id="main-content">
    <Navbar />
    <PageHero eyebrow={t('account.eyebrow')} title={t('account.title')} body={t('account.body')} icon="fa-solid fa-user-shield" image="https://res.cloudinary.com/dydg39ukk/image/upload/v1788949829/isoko-yubworozi-banner_txy0cd.png" />
    <section className="bg-[#f4f8f5] py-16 sm:py-20">
      <div className={`mx-auto w-[min(100%-2.5rem,72rem)] ${session ? '' : 'max-w-xl'}`}>
        {session ? <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
          <aside className="h-fit rounded-3xl border border-isoko-dark/8 bg-isoko-dark p-7 text-white shadow-[0_20px_70px_rgba(6,59,31,.12)] sm:p-9">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-xl">
              {session.avatar ? <Image fill sizes="80px" src={session.avatar} alt={`${session.name} profile`} className="object-cover" /> : <span className="grid h-full w-full place-items-center font-black text-isoko-light">{session.name.slice(0, 2).toUpperCase()}</span>}
            </div>
            <p className="mt-6 text-xs font-extrabold uppercase tracking-[.16em] text-isoko-light">{t('account.member')}</p>
            <h2 className="mt-2 text-2xl font-bold">{session.name}</h2><p className="mt-1 text-sm text-white/65">{session.email}</p>
            <p className="mt-6 rounded-2xl bg-white/8 p-4 text-sm leading-6 text-white/75"><i className="fa-solid fa-shield-halved mr-2 text-isoko-light" />{words.secure}</p>
            <form onSubmit={updateProfile} className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <label className="block text-xs font-extrabold text-white">{words.photo}<input required name="avatar" type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block w-full text-xs text-white/65 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:font-bold file:text-white" /></label>
              <p className="mt-2 text-[11px] leading-5 text-white/55">{words.photoHint}</p>
              {profileMessage && <p role="status" className="mt-3 text-xs font-bold text-isoko-light">{profileMessage}</p>}
              <button disabled={profileLoading} className="mt-3 min-h-10 w-full rounded-xl bg-white px-4 text-xs font-extrabold text-isoko-dark disabled:opacity-60">{profileLoading ? t('account.loading') : words.savePhoto}</button>
            </form>
            <button onClick={logout} className="mt-6 min-h-11 rounded-xl border border-white/15 px-5 text-sm font-bold hover:bg-white/10">{t('account.logout')}</button>
          </aside>
          <div className="rounded-3xl border border-isoko-dark/8 bg-white p-6 shadow-[0_20px_70px_rgba(6,59,31,.07)] sm:p-9">
            <p className="text-xs font-black uppercase tracking-[.16em] text-isoko-accent">{words.library}</p><h2 className="mt-2 text-2xl font-bold text-isoko-dark">{words.heading}</h2><p className="mt-2 text-sm text-slate-500">{words.intro}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3"><article className="rounded-2xl bg-emerald-50 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Purchased</p><p className="mt-2 text-2xl font-black text-isoko-dark">{successful.length}</p></article><article className="rounded-2xl bg-amber-50 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-amber-700">Pending</p><p className="mt-2 text-2xl font-black text-isoko-dark">{pending.length}</p></article><article className="rounded-2xl bg-blue-50 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-blue-700">Amount paid</p><p className="mt-2 text-lg font-black text-isoko-dark">{totalPaid.toLocaleString()} RWF</p></article></div>
            {successful.length ? <div className="mt-7 grid gap-4 sm:grid-cols-2">{successful.map((purchase) => <article key={purchase._id} className="flex gap-4 rounded-2xl border border-isoko-dark/8 p-4">
              {purchase.book?.coverImage && <div className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden rounded-lg bg-isoko-light"><Image fill sizes="72px" src={purchase.book.coverImage} alt="" className="object-cover" /></div>}
              <div className="min-w-0"><p className="text-[10px] font-black uppercase tracking-wider text-isoko-accent">{purchase.book?.category}</p><h3 className="mt-1 line-clamp-2 text-sm font-bold text-isoko-dark">{purchase.book?.title}</h3><button onClick={() => purchase.book && readBook(purchase.book._id)} className="mt-3 text-xs font-extrabold text-isoko-primary"><i className="fa-solid fa-book-open mr-1.5" />{words.read}</button></div>
            </article>)}</div> : <div className="mt-7 rounded-2xl bg-[#f5faf6] p-7 text-center"><i className="fa-solid fa-book-open mb-3 text-2xl text-isoko-accent" /><p className="text-sm font-bold text-slate-600">{words.empty}</p><Link href="/books" className="mt-4 inline-flex text-sm font-extrabold text-isoko-primary">{words.explore}</Link></div>}
            {purchases.length > 0 && <div className="mt-8"><h3 className="text-sm font-extrabold text-isoko-dark">{words.history}</h3><div className="mt-3 space-y-2">{purchases.map((purchase) => <div key={`history-${purchase._id}`} className="flex items-center justify-between gap-4 rounded-xl bg-[#f7faf8] px-4 py-3 text-xs"><div className="min-w-0"><p className="truncate font-bold text-slate-600">{purchase.book?.title || 'Book'}</p><p className="mt-1 text-[10px] font-bold text-slate-400">{(purchase.submittedAmount || purchase.amount).toLocaleString()} {purchase.currency}</p></div><span className={`shrink-0 rounded-full px-2 py-1 font-black ${purchase.status === 'successful' ? 'bg-emerald-100 text-emerald-800' : ['awaiting_payment', 'pending'].includes(purchase.status) ? 'bg-amber-100 text-amber-800' : purchase.status === 'pin_issued' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-700'}`}>{purchase.status.replaceAll('_', ' ')}</span></div>)}</div></div>}
            <div className="mt-8 border-t border-isoko-dark/8 pt-7"><div className="flex items-center justify-between gap-4"><h3 className="text-sm font-extrabold text-isoko-dark">Saved books</h3><span className="rounded-full bg-isoko-light px-3 py-1 text-xs font-black text-isoko-primary">{savedBooks.length}</span></div>{savedBooks.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{savedBooks.map((book) => <Link key={book._id} href={`/books/${book._id}`} className="flex items-center gap-3 rounded-2xl border border-isoko-dark/8 p-3 transition hover:border-isoko-accent"><div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-isoko-light">{book.coverImage && <Image fill sizes="48px" src={book.coverImage} alt="" className="object-cover" />}</div><div className="min-w-0"><p className="text-[10px] font-black uppercase text-isoko-accent">{book.category || 'Book'}</p><p className="mt-1 line-clamp-2 text-xs font-bold text-isoko-dark">{book.title}</p></div></Link>)}</div> : <p className="mt-3 text-xs text-slate-500">Save useful books from the library and they will appear here.</p>}</div>
            <div className="mt-8 border-t border-isoko-dark/8 pt-7"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-black uppercase tracking-wider text-isoko-accent">Eguriro</p><h3 className="mt-1 text-sm font-extrabold text-isoko-dark">{words.market}</h3></div><div className="flex gap-2"><span className="rounded-full bg-isoko-light px-3 py-1 text-xs font-black text-isoko-primary">{savedProducts.length} {words.savedProducts}</span><Link href="/cart" className="rounded-full bg-isoko-dark px-3 py-1 text-xs font-black text-white">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} {words.cart}</Link></div></div>{savedProducts.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{savedProducts.map((product) => <Link key={product._id} href={`/eguriro/${product._id}`} className="flex items-center gap-3 rounded-2xl border border-isoko-dark/8 p-3 transition hover:border-isoko-accent"><div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-isoko-light"><Image fill sizes="64px" src={product.image} alt="" className="object-cover" /></div><div className="min-w-0"><p className="text-[10px] font-black uppercase text-isoko-accent">{product.category}</p><p className="mt-1 line-clamp-2 text-xs font-bold text-isoko-dark">{localized(product.name, locale)}</p></div></Link>)}</div> : <p className="mt-3 text-xs text-slate-500">{words.marketEmpty}</p>}<Link href="/eguriro" className="mt-4 inline-flex items-center gap-2 text-xs font-black text-isoko-primary">{t('nav.market')}<i className="fa-solid fa-arrow-right" /></Link></div>
          </div>
        </div> : <div className="rounded-3xl border border-isoko-dark/8 bg-white p-7 shadow-[0_20px_70px_rgba(6,59,31,.08)] sm:p-9">
          <div className="mb-7 grid grid-cols-3 gap-2 text-center text-[10px] font-black uppercase tracking-wider text-slate-500"><span><i className="fa-solid fa-user-lock mb-2 block text-lg text-isoko-accent" />Account</span><span><i className="fa-solid fa-credit-card mb-2 block text-lg text-isoko-accent" />Payment</span><span><i className="fa-solid fa-book-open mb-2 block text-lg text-isoko-accent" />Access</span></div>
          <div className="grid grid-cols-2 rounded-xl bg-[#f2f7f3] p-1"><button type="button" onClick={() => { setMode('login'); setError(''); }} className={`min-h-11 rounded-lg text-sm font-bold ${mode === 'login' ? 'bg-white text-isoko-dark shadow-sm' : 'text-slate-500'}`}>{t('account.login')}</button><button type="button" onClick={() => { setMode('register'); setError(''); }} className={`min-h-11 rounded-lg text-sm font-bold ${mode === 'register' ? 'bg-white text-isoko-dark shadow-sm' : 'text-slate-500'}`}>{t('account.register')}</button></div>
          <form onSubmit={submit} className="mt-7 space-y-5">{mode === 'register' && <label className="block text-sm font-bold text-isoko-dark">{t('account.name')}<input required name="name" autoComplete="name" minLength={2} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-isoko-accent" /></label>}<label className="block text-sm font-bold text-isoko-dark">{t('account.email')}<input required type="email" name="email" autoComplete="email" className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-isoko-accent" /></label><label className="block text-sm font-bold text-isoko-dark">{t('account.password')}<input required type="password" name="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={6} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-isoko-accent" /></label>{error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p>}<button disabled={loading} className="min-h-12 w-full rounded-xl bg-isoko-accent px-5 text-sm font-extrabold text-white transition hover:bg-isoko-primary disabled:opacity-60">{loading ? t('account.loading') : mode === 'register' ? t('account.submitRegister') : t('account.submitLogin')}</button></form>
          <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-5 w-full text-sm font-bold text-isoko-primary hover:underline">{mode === 'login' ? t('account.switchRegister') : t('account.switchLogin')}</button>
        </div>}
      </div>
    </section><Footer />
  </main>;
}
