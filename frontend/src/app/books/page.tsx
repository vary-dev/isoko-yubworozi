"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchBooks } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
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
  createdAt: string;
}

export default function BooksPage() {
  const { t } = useI18n();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchBooks()
      .then((res) => setBooks(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(books.map((b) => b.category).filter(Boolean))),
  ];

  const filtered =
    filter === "All" ? books : books.filter((b) => b.category === filter);

  return (
    <main>
      <Navbar />

      <PageHero eyebrow={t("library.eyebrow")} title={t("library.title")} body={t("library.body")} icon="fa-solid fa-book-open" image="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1800&auto=format&fit=crop" />

      {/* Content */}
      <section className="py-16 bg-gray-50/60 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          {/* Category Filter */}
          {!loading && categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    filter === cat
                      ? "bg-isoko-dark text-white shadow-md"
                      : "bg-white text-gray-500 border border-gray-200 hover:border-isoko-accent hover:text-isoko-accent"
                  }`}
                >
                  {cat === "All" ? t("common.all") : cat}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && <ContentSkeleton count={6} variant="book" />}

          {/* Books Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((book, idx) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all"
                >
                  <div className="flex gap-5 p-5">
                    {/* Cover */}
                    <div className="w-28 h-40 rounded-lg overflow-hidden bg-gray-100 shrink-0 shadow-sm">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-isoko-light to-gray-100 flex items-center justify-center">
                          <i className="fa-solid fa-book text-2xl text-gray-200"></i>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-black uppercase text-isoko-accent tracking-wider">
                          {book.category}
                        </span>
                        {book.isPremium && (
                          <span className="text-[9px] font-black uppercase bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded tracking-wider">
                            {t("library.premium")}
                          </span>
                        )}
                      </div>
                      <h3 className="text-[15px] font-bold text-isoko-dark leading-snug line-clamp-2 mb-2">
                        {book.title}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-3">
                        {book.description}
                      </p>
                      <div className="flex items-center gap-3">
                        {book.fileUrl ? (
                          <a
                            href={book.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-isoko-accent text-white px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider hover:bg-isoko-primary transition-all"
                          >
                            <i className="fa-solid fa-download text-[10px]"></i>
                            {book.price > 0
                              ? `${book.price.toLocaleString()} RWF`
                              : t("library.download")}
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium italic">
                            {t("library.soon")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-book text-2xl text-gray-300"></i>
              </div>
              <p className="text-gray-400 font-bold text-sm">
                {filter !== "All"
                  ? `No books found in "${filter}" category.`
                  : t("library.empty")}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
