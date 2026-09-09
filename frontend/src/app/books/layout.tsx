import type { Metadata } from "next";
export const metadata: Metadata = { title: "Poultry Farming Library", description: "Read free and premium poultry books about chicken health, feeding, housing and profitable farm management.", alternates: { canonical: "/books" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
