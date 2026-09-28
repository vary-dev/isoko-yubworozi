import Image from 'next/image';
import AdminAccessForm from '@/components/auth/AdminAccessForm';

const logo = 'https://res.cloudinary.com/dydg39ukk/image/upload/v1788943683/isoko-yubworozi-logo_ijbygk.png';

export default function Home() {
  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-forest px-4 py-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(141,198,63,.22),transparent_35%),radial-gradient(circle_at_10%_90%,rgba(242,183,5,.13),transparent_32%)]" /><section className="surface relative z-10 w-full max-w-md rounded-[2rem] p-7 sm:p-9"><Image src={logo} alt="Isoko y'Ubworozi" width={240} height={84} className="mx-auto h-20 w-auto object-contain" priority /><div className="my-7 text-center"><p className="text-[10px] font-black uppercase tracking-[.2em] text-leaf">Administrator workspace</p><h1 className="mt-2 text-2xl font-semibold text-ink">Sign in to manage the platform</h1><p className="mt-3 text-sm leading-6 text-slate">Review payments, publish books and articles, and manage the Isoko y’Ubworozi library.</p></div><AdminAccessForm /><p className="mt-6 text-center text-[11px] leading-5 text-slate">Authorized administrators only · Secure session access</p></section></main>;
}
