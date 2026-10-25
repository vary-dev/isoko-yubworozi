"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchBooks } from "@/lib/api";
import Link from "next/link";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
import MediaFrame from "@/components/ui/MediaFrame";
import { useI18n } from "@/lib/i18n";

interface Book {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  coverImage: string;
  fileUrl: string;
  isPremium: boolean;
}

export default function BooksPreview() {
  const { t } = useI18n();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBooks()
      .then((res) => setBooks(res.data.slice(0, 4)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-white" aria-labelledby="books-preview-title">
      <div className="section-shell">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="eyebrow mb-3 text-isoko-emerald">
              {t("library.eyebrow")}
            </p>
            <h2 id="books-preview-title" className="text-3xl font-bold text-isoko-forest sm:text-4xl">
              {t("library.title")}
            </h2>
          </div>
          <Link
            href="/books"
            className="hidden shrink-0 items-center gap-2 text-sm font-bold text-isoko-emerald transition hover:text-isoko-lime sm:flex"
          >
            {t("common.viewAll")}
            <i aria-hidden="true" className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <ContentSkeleton count={4} variant="book" />
        )}

        {/* Books Grid */}
        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-5">
            {books.map((book, idx) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="min-w-0"
              >
                <Link href={`/books/${book._id}`} aria-label={`${book.title} — ${book.isPremium ? t("library.premium") : t("common.free")}`} className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] bg-isoko-canvas p-2.5 shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift sm:p-3">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[10rem]">
                  <MediaFrame fit="contain" zoom sizes="(max-width: 640px) 50vw, 25vw" src={book.coverImage} alt={book.title} className="h-full w-full rounded-xl" icon="fa-solid fa-book" />
                  {book.isPremium && (
                    <span className="absolute right-2 top-2 rounded-md bg-isoko-lime px-2 py-1 text-[9px] font-black uppercase tracking-wider text-isoko-forest-deep">
                      {t("library.premium")}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-1 pb-1 pt-3"><span className="text-[9px] font-black uppercase text-isoko-emerald tracking-wider">
                  {book.category}
                </span>
                <h3 className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-isoko-forest transition group-hover:text-isoko-emerald sm:text-sm">{book.title}</h3>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2"><p className="text-[10px] font-bold text-isoko-muted sm:text-xs">
                  {book.price > 0
                    ? `${book.price.toLocaleString()} RWF`
                    : t("common.free")}
                </p><span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-isoko-lime-soft/50 text-[10px] text-isoko-emerald transition group-hover:bg-isoko-lime group-hover:text-isoko-forest-deep"><i className="fa-solid fa-arrow-right" /></span></div></div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-[1.5rem] bg-isoko-canvas py-16 text-center">
            <i aria-hidden="true" className="fa-solid fa-triangle-exclamation text-4xl text-isoko-muted/40 mb-3"></i>
            <p className="font-bold text-isoko-muted text-sm">{t("library.loadError")}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && books.length === 0 && (
          <div className="rounded-[1.5rem] bg-isoko-canvas py-16 text-center">
            <i aria-hidden="true" className="fa-solid fa-book text-4xl text-isoko-muted/40 mb-3"></i>
            <p className="font-bold text-isoko-muted text-sm">
              {t("library.empty")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
