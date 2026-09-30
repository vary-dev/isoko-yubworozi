import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eguriro ry’Ubworozi',
  description: 'Discover poultry equipment, livestock medicines, feeds and practical agricultural products from Isoko y’Ubworozi.',
  alternates: { canonical: '/eguriro' },
  openGraph: { title: 'Eguriro ry’Ubworozi', description: 'Agricultural products and equipment for modern farmers.', url: '/eguriro' },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) { return children; }
