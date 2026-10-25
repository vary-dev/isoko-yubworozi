import type { Metadata } from "next";
export const metadata: Metadata = { title: "About", description: "How Isoko y'Ubworozi turns veterinary science into practical poultry guidance for East African farmers.", alternates: { canonical: "/about" } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
