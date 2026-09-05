"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "rw" | "en" | "fr";

const copy = {
  en: {
    "nav.home": "Home", "nav.videos": "Videos", "nav.blog": "Articles", "nav.library": "Library", "nav.about": "About", "nav.contact": "Contact",
    "nav.subscribe": "Subscribe", "nav.open": "Open menu", "nav.close": "Close menu", "language.choose": "Choose language",
    "hero.eyebrow": "Rwanda's poultry knowledge platform", "hero.title": "Raise healthier birds.", "hero.titleAccent": "Grow a stronger farm.",
    "hero.body": "Clear, trusted lessons that help poultry farmers reduce losses, improve care, and increase productivity.", "hero.watch": "Watch lessons", "hero.read": "Read articles",
    "hero.videos": "Video lessons", "hero.farmers": "Farmers reached", "hero.new": "New knowledge",
    "common.explore": "Explore", "common.viewAll": "View all", "common.all": "All", "common.loading": "Loading content", "common.free": "Free",
    "guidance.eyebrow": "Learn your way", "guidance.title": "Practical knowledge for every farm",
    "guidance.videoTitle": "Video lessons", "guidance.videoBody": "Step-by-step poultry, feed, health and farm-management lessons you can use today.",
    "guidance.articleTitle": "Expert articles", "guidance.articleBody": "Simple guidance on markets, seasons, vaccination and better daily decisions.",
    "guidance.bookTitle": "Digital library", "guidance.bookBody": "Download practical books and PDF guides uploaded by our farming team.",
    "library.eyebrow": "Knowledge library", "library.title": "Books for better farming", "library.body": "Browse uploaded guides on poultry health, feeding, production and profitable farm management.",
    "library.download": "Download", "library.soon": "Coming soon", "library.empty": "No books are available yet. Please check again soon.", "library.premium": "Premium",
    "videos.eyebrow": "Watch and learn", "videos.title": "Latest video lessons", "videos.body": "Practical demonstrations from Isoko y'Ubworozi, ready to watch on any device.", "videos.empty": "No videos are available yet.",
    "blog.eyebrow": "Farming knowledge", "blog.title": "Useful insights", "blog.body": "Straightforward advice for healthier animals, better planning and a more productive farm.", "blog.read": "Read more", "blog.back": "Back to articles", "blog.empty": "No articles are available yet.", "blog.by": "By",
    "footer.body": "Helping farmers build healthier, more productive poultry businesses with practical knowledge in languages they understand.",
    "footer.links": "Quick links", "footer.resources": "Resources", "footer.updates": "Stay informed", "footer.updateBody": "Receive useful farming updates.",
    "footer.email": "Email address", "footer.rights": "All rights reserved.", "footer.privacy": "Privacy", "footer.terms": "Terms",
  },
  rw: {
    "nav.home": "Ahabanza", "nav.videos": "Amashusho", "nav.blog": "Inyandiko", "nav.library": "Isomero", "nav.about": "Ibyacu", "nav.contact": "Twandikire",
    "nav.subscribe": "Iyandikishe", "nav.open": "Fungura menu", "nav.close": "Funga menu", "language.choose": "Hitamo ururimi",
    "hero.eyebrow": "Urubuga rw'ubumenyi bw'ubworozi mu Rwanda", "hero.title": "Ongera ubuzima bw'inkoko.", "hero.titleAccent": "Utezimbere ubworozi bwawe.",
    "hero.body": "Amasomo yumvikana kandi yizewe afasha aborozi kugabanya igihombo, kwita ku matungo no kongera umusaruro.", "hero.watch": "Reba amasomo", "hero.read": "Soma inyandiko",
    "hero.videos": "Amasomo ya videwo", "hero.farmers": "Aborozi twagezeho", "hero.new": "Ubumenyi bushya",
    "common.explore": "Sura", "common.viewAll": "Reba byose", "common.all": "Byose", "common.loading": "Tegereza gato", "common.free": "Ubuntu",
    "guidance.eyebrow": "Iga uko bikoroheye", "guidance.title": "Ubumenyi ngiro ku mworozi wese",
    "guidance.videoTitle": "Amasomo ya videwo", "guidance.videoBody": "Amasomo y'intambwe ku yindi ku nkoko, ibiryo, ubuzima n'imicungire y'ubworozi.",
    "guidance.articleTitle": "Inyandiko z'inzobere", "guidance.articleBody": "Inama zoroshye ku isoko, ibihe, inkingo n'imyanzuro myiza ya buri munsi.",
    "guidance.bookTitle": "Isomero rya digitale", "guidance.bookBody": "Kuramo ibitabo n'inyandiko ngiro byashyizweho n'itsinda ryacu.",
    "library.eyebrow": "Isomero ry'ubumenyi", "library.title": "Ibitabo biteza imbere ubworozi", "library.body": "Soma ibitabo ku buzima bw'inkoko, imirire, umusaruro n'imicungire ibyara inyungu.",
    "library.download": "Kuramo", "library.soon": "Biraza vuba", "library.empty": "Nta bitabo birashyirwaho. Ongera ugaruke vuba.", "library.premium": "Kwishyura",
    "videos.eyebrow": "Reba wige", "videos.title": "Amasomo mashya ya videwo", "videos.body": "Amasomo ngiro ya Isoko y'Ubworozi ushobora kureba ku gikoresho icyo ari cyo cyose.", "videos.empty": "Nta mashusho arashyirwaho.",
    "blog.eyebrow": "Ubumenyi bw'ubworozi", "blog.title": "Inama z'ingirakamaro", "blog.body": "Inama zisobanutse zigufasha kugira amatungo mazima, igenamigambi ryiza n'umusaruro mwinshi.", "blog.read": "Soma byinshi", "blog.back": "Subira ku nyandiko", "blog.empty": "Nta nyandiko zirashyirwaho.", "blog.by": "Yanditswe na",
    "footer.body": "Dufasha aborozi kugira inkoko nzima n'ubworozi butanga umusaruro dukoresheje ubumenyi ngiro mu ndimi bumva.",
    "footer.links": "Aho wakanda", "footer.resources": "Ubumenyi", "footer.updates": "Menya amakuru", "footer.updateBody": "Jya ubona inama z'ubworozi.",
    "footer.email": "Imeyili yawe", "footer.rights": "Uburenganzira bwose burabitswe.", "footer.privacy": "Amabanga", "footer.terms": "Amategeko",
  },
  fr: {
    "nav.home": "Accueil", "nav.videos": "Vidéos", "nav.blog": "Articles", "nav.library": "Bibliothèque", "nav.about": "À propos", "nav.contact": "Contact",
    "nav.subscribe": "S'abonner", "nav.open": "Ouvrir le menu", "nav.close": "Fermer le menu", "language.choose": "Choisir la langue",
    "hero.eyebrow": "La plateforme rwandaise du savoir avicole", "hero.title": "Élevez des volailles saines.", "hero.titleAccent": "Développez votre ferme.",
    "hero.body": "Des leçons simples et fiables pour réduire les pertes, améliorer les soins et augmenter la production.", "hero.watch": "Voir les leçons", "hero.read": "Lire les articles",
    "hero.videos": "Leçons vidéo", "hero.farmers": "Éleveurs touchés", "hero.new": "Nouveau contenu",
    "common.explore": "Découvrir", "common.viewAll": "Tout voir", "common.all": "Tout", "common.loading": "Chargement", "common.free": "Gratuit",
    "guidance.eyebrow": "Apprenez à votre rythme", "guidance.title": "Des conseils pratiques pour chaque ferme",
    "guidance.videoTitle": "Leçons vidéo", "guidance.videoBody": "Des cours pratiques sur la volaille, l'alimentation, la santé et la gestion agricole.",
    "guidance.articleTitle": "Articles d'experts", "guidance.articleBody": "Des conseils simples sur le marché, les saisons, la vaccination et les décisions quotidiennes.",
    "guidance.bookTitle": "Bibliothèque numérique", "guidance.bookBody": "Téléchargez les livres et guides PDF publiés par notre équipe agricole.",
    "library.eyebrow": "Bibliothèque du savoir", "library.title": "Des livres pour mieux élever", "library.body": "Découvrez nos guides sur la santé, l'alimentation, la production et la gestion rentable.",
    "library.download": "Télécharger", "library.soon": "Bientôt disponible", "library.empty": "Aucun livre n'est encore disponible.", "library.premium": "Premium",
    "videos.eyebrow": "Regardez et apprenez", "videos.title": "Dernières leçons vidéo", "videos.body": "Des démonstrations pratiques d'Isoko y'Ubworozi sur tous vos appareils.", "videos.empty": "Aucune vidéo n'est encore disponible.",
    "blog.eyebrow": "Savoir agricole", "blog.title": "Conseils utiles", "blog.body": "Des conseils clairs pour des animaux sains, une bonne planification et une ferme productive.", "blog.read": "Lire plus", "blog.back": "Retour aux articles", "blog.empty": "Aucun article n'est encore disponible.", "blog.by": "Par",
    "footer.body": "Nous aidons les éleveurs à bâtir des fermes avicoles saines et productives grâce à des conseils pratiques dans leur langue.",
    "footer.links": "Liens rapides", "footer.resources": "Ressources", "footer.updates": "Restez informé", "footer.updateBody": "Recevez nos conseils d'élevage.",
    "footer.email": "Adresse e-mail", "footer.rights": "Tous droits réservés.", "footer.privacy": "Confidentialité", "footer.terms": "Conditions",
  },
} as const;

type TranslationKey = keyof typeof copy.en;
type I18nValue = { locale: Locale; setLocale: (locale: Locale) => void; t: (key: TranslationKey) => string };
const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("rw");

  useEffect(() => {
    const stored = window.localStorage.getItem("isoko-locale") as Locale | null;
    if (stored && stored in copy) requestAnimationFrame(() => setLocaleState(stored));
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("isoko-locale", next);
    document.documentElement.lang = next;
  };

  const value = useMemo(() => ({ locale, setLocale, t: (key: TranslationKey) => copy[locale][key] }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
