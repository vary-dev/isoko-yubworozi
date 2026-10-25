"use client";

import { useI18n, type TranslationKey } from "@/lib/i18n";

/**
 * Renders one translated string inside a server component (which cannot call
 * the i18n hook directly). Keep usage to short labels around server data.
 */
export default function LocalizedText({ k }: { k: TranslationKey }) {
  const { t } = useI18n();
  return <>{t(k)}</>;
}
