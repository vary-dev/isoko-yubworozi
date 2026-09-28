import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BookReader from '@/components/books/BookReader';

const api = process.env.NEXT_PUBLIC_API_URL || 'https://isoko-yubworozi.onrender.com/api';
const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://isokoyubworozi.vercel.app';
type Book = { _id: string; title: string; description: string; coverImage: string; category: string; isPremium: boolean };
async function getBook(id: string) { try { const response = await fetch(`${api}/books/${encodeURIComponent(id)}`, { next: { revalidate: 300 } }); return response.ok ? response.json() as Promise<Book> : null; } catch { return null; } }
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> { const { id } = await params; const book = await getBook(id); if (!book) return { title: 'Book not found' }; return { title: `Read ${book.title}`, description: `Read ${book.title} from the Isoko y’Ubworozi digital farming library.`, alternates: { canonical: `${site}/books/${book._id}/read` }, robots: { index: false, follow: true } }; }
export default async function ReadBookPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const book = await getBook(id); if (!book) notFound(); return <main id="main-content" className="min-h-screen bg-[#eef5f0]"><Navbar /><section className="px-4 pb-16 pt-28 sm:px-6"><BookReader bookId={book._id} title={book.title} isPremium={book.isPremium} /></section><Footer /></main>; }
