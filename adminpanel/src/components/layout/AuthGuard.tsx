"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminMe } from '@/lib/api';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const verify = async () => {
      if (!sessionStorage.getItem('admin_token')) { router.replace('/login'); return; }
      try { const { data } = await getAdminMe(); sessionStorage.setItem('admin_user', JSON.stringify(data)); setReady(true); }
      catch { router.replace('/login'); }
    };
    void verify();
  }, [router]);

  if (!ready) return <div className="grid min-h-screen place-items-center bg-mist"><div className="text-center"><div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-leaf/20 border-t-leaf"/><p className="text-sm font-semibold text-slate">Verifying your secure session…</p></div></div>;
  return <>{children}</>;
}
