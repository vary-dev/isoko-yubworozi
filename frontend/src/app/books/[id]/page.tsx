import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PremiumBookActions from '@/components/books/PremiumBookActions';
import SaveBookButton from '@/components/books/SaveBookButton';
import LocalizedText from '@/components/ui/LocalizedText';

interface Book {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  coverImage: string;
  fileUrl?: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

const api =
  process.env.NEXT_PUBLIC_API_URL || 'https://isoko-yubworozi.onrender.com/api';
const site =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://isokoyubworozi.vercel.app';

async function getBook(id: string) {
  try {
    const response = await fetch(`${api}/books/${encodeURIComponent(id)}`, {
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    return response.json() as Promise<Book>;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) return { title: 'Book not found' };

  const bookUrl = `${site}/books/${book._id}`;
  return {
    title: book.title,
    description: book.description.slice(0, 160),
    keywords: [book.title, book.category, "ibitabo by'ubworozi", 'poultry farming books', 'livres avicoles'],
    alternates: { canonical: bookUrl },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'book',
      url: bookUrl,
      title: book.title,
      description: book.description,
      images: [book.coverImage],
    },
    twitter: { card: 'summary_large_image', title: book.title, description: book.description.slice(0, 160), images: [book.coverImage] },
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();

  const bookUrl = `${site}/books/${book._id}`;
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'Book', '@id': `${bookUrl}#book`, url: bookUrl, name: book.title,
      description: book.description, image: book.coverImage, genre: book.category,
      inLanguage: 'rw', datePublished: book.createdAt, dateModified: book.updatedAt,
      isAccessibleForFree: !book.isPremium,
      publisher: { '@type': 'Organization', name: "Isoko y'Ubworozi", url: site },
      offers: { '@type': 'Offer', url: bookUrl, price: book.price, priceCurrency: 'RWF', availability: 'https://schema.org/InStock' },
    }, {
      '@type': 'BreadcrumbList', '@id': `${bookUrl}#breadcrumb`, itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site },
        { '@type': 'ListItem', position: 2, name: 'Library', item: `${site}/books` },
        { '@type': 'ListItem', position: 3, name: book.title, item: bookUrl },
      ],
    }],
  };

  return (
    <main id="main-content">
      <Navbar />
      <section className="min-h-[80vh] bg-isoko-canvas pb-20 pt-32">
        <div className="section-shell">
          <Link
            href="/books"
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-isoko-emerald"
          >
            <i className="fa-solid fa-arrow-left text-xs" />
            <LocalizedText k="bookDetail.back" />
          </Link>
          <div className="grid gap-10 rounded-[2rem] bg-white p-6 shadow-lift md:grid-cols-[280px_1fr] md:p-10">
            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-isoko-neutral shadow-lg">
              <Image
                fill
                priority
                sizes="280px"
                src={book.coverImage}
                alt={book.title}
                className="object-contain"
              />
            </div>
            <div className="self-center">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-isoko-lime/30 px-3 py-1 text-xs font-extrabold text-isoko-forest-deep">
                  {book.category}
                </span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-extrabold text-amber-800">
                  {book.isPremium ? <LocalizedText k="library.premium" /> : <LocalizedText k="common.free" />}
                </span>
              </div>
              <h1 className="mt-5 text-3xl font-bold text-isoko-dark sm:text-4xl">
                {book.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-isoko-muted">
                {book.description}
              </p>
              <div className="mt-8 flex flex-wrap items-start gap-3">
                {!book.isPremium && book.fileUrl ? (
                  <Link
                    href={`/books/${book._id}/read`}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-isoko-lime px-6 py-3.5 text-sm font-extrabold text-isoko-forest-deep transition hover:bg-isoko-lime-soft"
                  >
                    <i className="fa-solid fa-book-open" />
                    <LocalizedText k="bookDetail.readFree" />
                  </Link>
                ) : book.isPremium ? (
                  <PremiumBookActions bookId={book._id} price={book.price} />
                ) : (
                  <span className="text-sm font-bold text-isoko-muted">
                    <LocalizedText k="library.soon" />
                  </span>
                )}
                <SaveBookButton bookId={book._id} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
      />
      <Footer />
    </main>
  );
}
