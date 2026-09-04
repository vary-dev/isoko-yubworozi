import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://isokoyubworozi.com"),
  title: {
    default: "Isoko y'Ubworozi | Poultry Farming Knowledge in Rwanda",
    template: "%s | Isoko y'Ubworozi",
  },
  description:
    "Practical poultry and livestock farming knowledge for Rwanda and beyond. Explore free guides, Kinyarwanda video tutorials, books, and expert advice.",
  keywords: [
    "poultry farming Rwanda", "ubworozi bw'inkoko", "Isoko y'Ubworozi",
    "chicken farming", "livestock Rwanda", "farming tutorials Kinyarwanda",
  ],
  authors: [{ name: "Isoko y'Ubworozi" }],
  creator: "Isoko y'Ubworozi",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "rw_RW",
    alternateLocale: ["en_US", "fr_FR"],
    siteName: "Isoko y'Ubworozi",
    title: "Isoko y'Ubworozi | Grow healthier, more productive poultry",
    description: "Trusted, practical farming education for poultry farmers in Rwanda.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Isoko y'Ubworozi",
    description: "Practical poultry farming education for Rwanda and beyond.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#063B1F",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="antialiased selection:bg-isoko-accent selection:text-white">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {/* Google Translate */}
        <div id="google_translate_element" className="hidden" />
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'en',
                  includedLanguages: 'en,rw,fr',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false
                }, 'google_translate_element');
              }
            `,
          }}
        />
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="lazyOnload"
        />
        <Script
          id="isoko-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Isoko y'Ubworozi",
            url: process.env.NEXT_PUBLIC_SITE_URL || "https://isokoyubworozi.com",
            sameAs: ["https://youtube.com/@Isokoyubworozi"],
            areaServed: "RW",
            description: "Digital poultry and livestock farming education platform.",
          }) }}
        />
        {children}
      </body>
    </html>
  );
}
