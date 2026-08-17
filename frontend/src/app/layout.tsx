import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

// Configure Plus Jakarta Sans
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta", // This must match the CSS variable above
  display: "swap",
});

// Configure Inter
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}