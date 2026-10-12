import type { Locale } from './i18n';

export type LocalizedText = { rw: string; en: string; fr: string };
export type Product = {
  _id: string;
  name: LocalizedText;
  description: LocalizedText;
  category: string;
  image: string;
  images?: string[];
  hasPrice: boolean;
  price?: number | null;
  inStock: boolean;
  featured: boolean;
  updatedAt?: string;
};
export type CartItem = { _id?: string; product: Product; quantity: number };

export const MARKET_PHONE_LOCAL = '0784990623';
export const MARKET_PHONE_INTERNATIONAL = '250784990623';
export const MARKET_WHATSAPP = MARKET_PHONE_INTERNATIONAL;
export const localized = (value: LocalizedText, locale: Locale) => value?.[locale] || value?.rw || value?.en || '';
export const whatsappUrl = (message: string) => `https://wa.me/${MARKET_WHATSAPP}?text=${encodeURIComponent(message)}`;
