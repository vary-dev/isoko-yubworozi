"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchBooks } from "@/lib/api";
import Link from "next/link";

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
              Knowledge Library
            </p>
            <h2 className="text-3xl font-black text-isoko-dark">
              Farming Books
            </h2>
          </div>
          <Link
            href="/books"
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-isoko-primary hover:text-isoko-accent transition"
          >
            View All
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="aspect-[3/4] bg-gray-100 animate-pulse rounded-xl" />
                <div className="pt-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 bg-gray-50 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Books Grid */}
        {!loading && books.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {books.map((book, idx) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 shadow-sm mb-3 relative">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-isoko-light to-gray-100 flex items-center justify-center">
                      <i className="fa-solid fa-book text-4xl text-gray-200"></i>
                    </div>
                  )}
                  {book.isPremium && (
                    <span className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 text-[9px] font-black uppercase px-2 py-1 rounded-md tracking-wider">
                      Premium
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-black uppercase text-isoko-accent tracking-wider">
                  {book.category}
                </span>
                <h3 className="text-sm font-bold text-isoko-dark mt-1 line-clamp-2 group-hover:text-isoko-primary transition">
                  {book.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                  {book.price > 0
                    ? `${book.price.toLocaleString()} RWF`
                    : "Free"}
                </p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && books.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <i className="fa-solid fa-book text-4xl text-gray-200 mb-3"></i>
            <p className="text-gray-400 font-bold text-sm">
              No books available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
