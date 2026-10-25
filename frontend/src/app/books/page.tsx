"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchBooks } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
import MediaFrame from "@/components/ui/MediaFrame";
import { useI18n } from "@/lib/i18n";
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
  createdAt: string;
}

export default function BooksPage() {
  const { t } = useI18n();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchBooks()
      .then((res) => setBooks(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(books.map((b) => b.category).filter(Boolean))),
  ];

  const filtered =
    filter === "All" ? books : books.filter((b) => b.category === filter);

  return (
    <main id="main-content">
      <Navbar />

      <PageHero eyebrow={t("library.eyebrow")} title={t("library.title")} body={t("library.body")} icon="fa-solid fa-book-open" />

      <section className="bg-white py-16" aria-labelledby="library-access-title">
        <div className="section-shell">
          <div className="mb-10 flex justify-end"><Link href="/blog" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-isoko-lime px-5 text-xs font-extrabold text-isoko-forest-deep transition hover:bg-isoko-lime-soft">{t("nav.blog")}<i className="fa-solid fa-arrow-right text-[9px]" /></Link></div>
          <div className="max-w-2xl"><p className="eyebrow mb-3">{t("library.howEyebrow")}</p><h2 id="library-access-title" className="text-3xl font-bold text-isoko-dark text-balance sm:text-4xl">{t("library.howTitle")}</h2><p className="mt-4 text-base leading-7 text-isoko-muted">{t("library.howBody")}</p></div>
          <div className="mt-9 grid gap-6 md:grid-cols-3">
            {[["fa-book-open","library.freeTitle","library.freeBody"],["fa-crown","library.premiumTitle","library.premiumBody"],["fa-user-shield","library.accountTitle","library.accountBody"]].map(([icon,title,body]) => <article key={title} className="h-full rounded-3xl bg-white p-6 shadow-soft"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-isoko-lime text-isoko-forest-deep"><i className={`fa-solid ${icon}`} /></span><h3 className="mt-5 text-xl font-bold text-isoko-dark">{t(title as Parameters<typeof t>[0])}</h3><p className="mt-3 text-base leading-7 text-isoko-muted">{t(body as Parameters<typeof t>[0])}</p>{title === "library.accountTitle" && <Link href="/account" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-isoko-emerald">{t("library.createAccount")}<i className="fa-solid fa-arrow-right text-xs" /></Link>}</article>)}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-isoko-canvas min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          {/* Category Filter */}
          {!loading && categories.length > 2 && (
            <div className="flex flex-wrap gap-2 mb-10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  aria-pressed={filter === cat}
                  className={`min-h-10 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                    filter === cat
                      ? "bg-isoko-forest text-white shadow-soft"
                      : "bg-white text-isoko-muted hover:text-isoko-emerald hover:shadow-soft"
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
                  className="bg-white rounded-3xl shadow-soft overflow-hidden group hover:shadow-lift transition-all"
                >
                  <div className="flex gap-5 p-5">
                    {/* Cover */}
                    <div className="w-28 h-40 shrink-0 rounded-xl overflow-hidden bg-isoko-neutral shadow-sm">
                      <MediaFrame
                        src={book.coverImage}
                        alt={book.title}
                        fit="contain"
                        sizes="112px"
                        icon="fa-solid fa-book"
                        className="h-full w-full"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-black uppercase text-isoko-emerald tracking-wider">
                          {book.category}
                        </span>
                        {book.isPremium && (
                          <span className="text-[9px] font-black uppercase bg-isoko-lime/30 text-isoko-forest-deep px-1.5 py-0.5 rounded tracking-wider">
                            {t("library.premium")}
                          </span>
                        )}
                      </div>
                      <h3 className="text-[15px] font-bold text-isoko-dark leading-snug line-clamp-2 mb-2">
                        <Link href={`/books/${book._id}`} className="hover:text-isoko-emerald">{book.title}</Link>
                      </h3>
                      <p className="text-isoko-muted text-xs leading-relaxed line-clamp-3 mb-3">
                        {book.description}
                      </p>
                      <div className="flex items-center gap-3">
                        {book.fileUrl && !book.isPremium ? (
                          <Link
                            href={`/books/${book._id}/read`}
                            className="inline-flex min-h-9 items-center gap-2 bg-isoko-lime text-isoko-forest-deep px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider hover:bg-isoko-lime-soft transition-all"
                          >
                            <i className="fa-solid fa-book-open text-[10px]"></i>
                            {t("library.download")}
                          </Link>
                        ) : book.isPremium ? (
                          <Link href={`/books/${book._id}`} className="inline-flex min-h-9 items-center gap-2 rounded-full bg-isoko-forest px-4 py-2 text-[11px] font-black uppercase tracking-wider text-white transition hover:bg-isoko-emerald"><i className="fa-solid fa-lock text-[10px]" />{book.price.toLocaleString()} RWF</Link>
                        ) : (
                          <span className="text-xs text-isoko-muted font-medium italic">
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
          {!loading && (error || filtered.length === 0) && (
            <div className="rounded-3xl bg-white py-20 text-center shadow-soft">
              <div className="w-16 h-16 bg-isoko-neutral rounded-2xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-book text-2xl text-isoko-muted/50"></i>
              </div>
              <p className="text-isoko-muted font-bold text-sm">
                {error ? t("library.loadError") : (filter !== "All"
                  ? t("library.noCategory")
                  : t("library.empty"))}
              </p>
              {error && (
                <button type="button" onClick={() => { setError(false); setLoading(true); fetchBooks().then((res) => setBooks(res.data)).catch(() => setError(true)).finally(() => setLoading(false)); }} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-isoko-lime px-5 text-xs font-black text-isoko-forest-deep"><i aria-hidden="true" className="fa-solid fa-rotate-right" />{t("common.retry")}</button>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
