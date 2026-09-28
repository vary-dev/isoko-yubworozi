"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchBooks } from "@/lib/api";
import Link from "next/link";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";

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

  useEffect(() => {
    fetchBooks()
      .then((res) => setBooks(res.data.slice(0, 4)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-isoko-accent mb-2">
              {t("library.eyebrow")}
            </p>
            <h2 className="text-3xl font-black text-isoko-dark">
              {t("library.title")}
            </h2>
          </div>
          <Link
            href="/books"
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-isoko-primary hover:text-isoko-accent transition"
          >
            {t("common.viewAll")}
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <ContentSkeleton count={4} variant="book" />
        )}

        {/* Books Grid */}
        {!loading && books.length > 0 && (
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
                <Link href={`/books/${book._id}`} aria-label={`${book.title} — ${book.isPremium ? t("library.premium") : t("common.free")}`} className="group block h-full overflow-hidden rounded-2xl border border-isoko-dark/8 bg-white p-2.5 shadow-[0_8px_30px_rgba(6,59,31,.05)] transition hover:-translate-y-1 hover:border-isoko-accent/30 hover:shadow-[0_18px_45px_rgba(6,59,31,.11)] sm:p-3">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[10rem] overflow-hidden rounded-xl bg-gray-100 shadow-sm">
                  {book.coverImage ? (
                    <Image fill sizes="(max-width: 640px) 50vw, 25vw"
                      src={book.coverImage}
                      alt={book.title}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-isoko-light to-gray-100 flex items-center justify-center">
                      <i className="fa-solid fa-book text-4xl text-gray-200"></i>
                    </div>
                  )}
                  {book.isPremium && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-wider">
                      {t("library.premium")}
                    </span>
                  )}
                </div>
                <div className="px-1 pb-1 pt-3"><span className="text-[9px] font-black uppercase text-isoko-accent tracking-wider">
                  {book.category}
                </span>
                <h3 className="mt-1 line-clamp-2 text-xs font-bold leading-5 text-isoko-dark transition group-hover:text-isoko-primary sm:text-sm">{book.title}</h3>
                <div className="mt-2 flex items-center justify-between gap-2"><p className="text-[10px] font-bold text-slate-500 sm:text-xs">
                  {book.price > 0
                    ? `${book.price.toLocaleString()} RWF`
                    : t("common.free")}
                </p><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-isoko-light text-[10px] text-isoko-primary transition group-hover:bg-isoko-accent group-hover:text-white"><i className="fa-solid fa-arrow-right" /></span></div></div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && books.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <i className="fa-solid fa-book text-4xl text-gray-200 mb-3"></i>
            <p className="text-gray-400 font-bold text-sm">
              {t("library.empty")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
