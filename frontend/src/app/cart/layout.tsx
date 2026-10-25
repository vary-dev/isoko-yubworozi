import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Your marketplace cart', description: 'Review agricultural products and send your inquiry to Isoko y’Ubworozi.', robots: { index: false, follow: false } };
export default function CartLayout({ children }: { children: React.ReactNode }) { return children; }
