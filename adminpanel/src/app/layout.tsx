import { Manrope, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: 'swap' });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: 'swap' });

export const metadata = {
  title: "Isoko y'Ubworozi | Admin Studio",
  description: "Secure editorial and learning-resource management for Isoko y'Ubworozi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${manrope.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
