import { Manrope, Sora } from "next/font/google";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import Providers from "@/components/Providers";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang="rw" className={`${sora.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="antialiased selection:bg-isoko-accent selection:text-white">
        <a className="skip-link" href="#main-content">Skip to main content</a>
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
