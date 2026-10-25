import type { Metadata } from "next";
export const metadata: Metadata = { title: "Your Account", description: "Create or access your Isoko y'Ubworozi learning account.", robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
