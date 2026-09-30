import type { Locale } from './i18n';

export type LocalizedText = { rw: string; en: string; fr: string };
export type Product = {
  _id: string;
  name: LocalizedText;
  description: LocalizedText;
  category: string;
  image: string;
  hasPrice: boolean;
  price?: number | null;
  inStock: boolean;
  featured: boolean;
  updatedAt?: string;
};
export type CartItem = { _id?: string; product: Product; quantity: number };

export const MARKET_WHATSAPP = '250723777623';
export const localized = (value: LocalizedText, locale: Locale) => value?.[locale] || value?.rw || value?.en || '';
export const whatsappUrl = (message: string) => `https://wa.me/${MARKET_WHATSAPP}?text=${encodeURIComponent(message)}`;
