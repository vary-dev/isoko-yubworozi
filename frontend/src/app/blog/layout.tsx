import type { Metadata } from "next";
export const metadata: Metadata = { title: "Poultry Farming Articles", description: "Practical poultry health, vaccination, feeding and farm-management articles for Rwanda and East Africa.", alternates: { canonical: "/blog" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
