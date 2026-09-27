"use client";

import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { FiCheck, FiClock, FiCopy, FiCreditCard, FiPhone, FiRefreshCw, FiSearch, FiShield, FiX } from 'react-icons/fi';
import AdminPageHeader from '@/components/ui/AdminPageHeader';
import { getPaymentRequests, issuePaymentPin, rejectPaymentRequest } from '@/lib/api';

type Payment = {
  _id: string;
  user?: { name: string; email: string };
  book?: { title: string; category: string };
  txRef: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: 'mtn' | 'airtel';
  payerPhone: string;
  verificationCodeExpiresAt?: string;
  createdAt: string;
};

const statusStyle: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800', pin_issued: 'bg-blue-100 text-blue-800', successful: 'bg-emerald-100 text-emerald-800', rejected: 'bg-red-100 text-red-700', expired: 'bg-slate-100 text-slate-700',
};

export default function PaymentsPage() {
  const [items, setItems] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('active');
  const [notice, setNotice] = useState('');
  const [issued, setIssued] = useState<{ pin: string; expiresAt: string; payment: Payment } | null>(null);

  const load = () => getPaymentRequests().then((response) => setItems(response.data)).catch((error) => setNotice(axios.isAxiosError(error) ? error.response?.data?.message || 'Could not load payment requests.' : 'Could not load payment requests.')).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const visible = useMemo(() => items.filter((item) => {
    const matchesQuery = `${item.user?.name} ${item.user?.email} ${item.book?.title} ${item.payerPhone} ${item.txRef}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = filter === 'all' || (filter === 'active' ? ['pending', 'pin_issued', 'expired'].includes(item.status) : item.status === filter);
    return matchesQuery && matchesStatus;
  }), [items, query, filter]);

  const activeCount = items.filter((item) => ['pending', 'pin_issued', 'expired'].includes(item.status)).length;
  const successfulCount = items.filter((item) => item.status === 'successful').length;
  const revenue = items.filter((item) => item.status === 'successful').reduce((total, item) => total + item.amount, 0);

  const generatePin = async (payment: Payment) => {
    if (!confirm(`Confirm that ${payment.amount.toLocaleString()} RWF was received from ${payment.payerPhone}?`)) return;
    setBusy(payment._id); setNotice('');
    try {
      const response = await issuePaymentPin(payment._id);
      setIssued({ pin: response.data.pin, expiresAt: response.data.expiresAt, payment });
      await load();
    } catch (error) { setNotice(axios.isAxiosError(error) ? error.response?.data?.message || 'Could not issue PIN.' : 'Could not issue PIN.'); }
    finally { setBusy(''); }
  };

  const reject = async (payment: Payment) => {
    const reason = prompt('Why could this payment not be confirmed?', 'Payment was not found in the receiving account');
    if (!reason) return;
    setBusy(payment._id); setNotice('');
    try { await rejectPaymentRequest(payment._id, reason); await load(); }
    catch (error) { setNotice(axios.isAxiosError(error) ? error.response?.data?.message || 'Could not reject request.' : 'Could not reject request.'); }
    finally { setBusy(''); }
  };

  return <div className="space-y-8">
    <AdminPageHeader eyebrow="Manual verification" title="Premium book payments" description="Confirm mobile-money receipts, issue one-time access PINs and keep a clear payment history. Never request a customer's wallet PIN." />
    <div className="grid gap-4 sm:grid-cols-3"><article className="rounded-3xl bg-forest p-6 text-white"><FiClock className="text-lime" /><p className="mt-7 text-xs font-bold text-white/55">Needs attention</p><p className="mt-1 text-3xl font-semibold">{loading ? '—' : activeCount}</p></article><article className="surface rounded-3xl p-6"><FiCheck className="text-leaf" /><p className="mt-7 text-xs font-bold text-slate">Unlocked purchases</p><p className="mt-1 text-3xl font-semibold text-forest">{loading ? '—' : successfulCount}</p></article><article className="surface rounded-3xl p-6"><FiCreditCard className="text-gold" /><p className="mt-7 text-xs font-bold text-slate">Verified revenue</p><p className="mt-1 text-3xl font-semibold text-forest">{loading ? '—' : `${revenue.toLocaleString()} RWF`}</p></article></div>
    <section className="surface rounded-3xl p-5 sm:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="relative w-full lg:max-w-sm"><FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search user, book, phone or reference" className="input pl-11" /></div><div className="flex gap-2 overflow-x-auto">{['active', 'pending', 'pin_issued', 'successful', 'rejected', 'all'].map((value) => <button key={value} onClick={() => setFilter(value)} className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-extrabold capitalize ${filter === value ? 'bg-forest text-white' : 'bg-mist text-slate'}`}>{value.replace('_', ' ')}</button>)}<button onClick={() => { setLoading(true); load(); }} aria-label="Refresh payments" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-ink/10 text-forest"><FiRefreshCw /></button></div></div>{notice && <p role="status" className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">{notice}</p>}</section>
    <section className="space-y-4">{loading ? [1, 2, 3].map((item) => <div key={item} className="h-40 animate-pulse rounded-3xl bg-white" />) : visible.map((payment) => <article key={payment._id} className="surface rounded-3xl p-5 sm:p-6"><div className="flex flex-col gap-5 xl:flex-row xl:items-center"><div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xs font-black ${payment.paymentMethod === 'mtn' ? 'bg-[#ffcb05] text-black' : 'bg-red-600 text-white'}`}>{payment.paymentMethod === 'mtn' ? 'MTN' : 'AIR'}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold text-forest">{payment.book?.title || 'Premium book'}</h2><span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${statusStyle[payment.status] || 'bg-slate-100 text-slate-700'}`}>{payment.status.replace('_', ' ')}</span></div><p className="mt-1 text-xs text-slate">{payment.user?.name} · {payment.user?.email}</p><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-slate"><span><FiPhone className="mr-1 inline" />{payment.payerPhone}</span><span>{payment.txRef}</span><time>{new Date(payment.createdAt).toLocaleString()}</time></div></div><div className="shrink-0 xl:text-right"><p className="text-xl font-semibold text-forest">{payment.amount.toLocaleString()} {payment.currency}</p><div className="mt-3 flex flex-wrap gap-2 xl:justify-end">{['pending', 'expired', 'pin_issued'].includes(payment.status) && <button disabled={busy === payment._id} onClick={() => generatePin(payment)} className="primary-button">{busy === payment._id ? 'Working…' : payment.status === 'pin_issued' ? 'Replace PIN' : 'Confirm & issue PIN'}</button>}{payment.status !== 'successful' && payment.status !== 'rejected' && <button disabled={busy === payment._id} onClick={() => reject(payment)} className="secondary-button text-red-700"><FiX />Reject</button>}</div></div></div></article>)}{!loading && !visible.length && <div className="surface rounded-3xl py-20 text-center"><FiCreditCard className="mx-auto text-slate" size={30} /><p className="mt-3 text-sm font-bold text-slate">No payment requests match this view.</p></div>}</section>
    {issued && <div className="fixed inset-0 z-[120] grid place-items-center p-4"><button aria-label="Close generated PIN" onClick={() => setIssued(null)} className="absolute inset-0 bg-black/65 backdrop-blur-sm" /><section role="dialog" aria-modal="true" className="surface relative z-10 w-full max-w-md rounded-[2rem] p-7 text-center sm:p-9"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-forest text-lime"><FiShield size={24} /></span><p className="mt-5 text-[10px] font-black uppercase tracking-[.18em] text-leaf">Share once with the customer</p><h2 className="mt-2 text-2xl font-semibold">One-time access PIN</h2><button onClick={() => navigator.clipboard.writeText(issued.pin)} className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-mist p-5 text-4xl font-semibold tracking-[.35em] text-forest">{issued.pin}<FiCopy size={18} /></button><p className="mt-4 text-xs leading-5 text-slate">For {issued.payment.user?.name} · {issued.payment.book?.title}<br />Expires at {new Date(issued.expiresAt).toLocaleTimeString()} (15 minutes).</p><p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs font-bold text-amber-800">The code is shown here only now. Generate a replacement if the customer does not use it before expiry.</p><button onClick={() => setIssued(null)} className="primary-button mt-6 w-full">Done</button></section></div>}
  </div>;
}
