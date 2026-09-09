"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchArticles } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";

interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  image: string;
  author: string;
  createdAt: string;
}

export default function BlogPage() {
  const { t, locale } = useI18n();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Article | null>(null);

  useEffect(() => {
    fetchArticles()
      .then((res) => setArticles(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean))),
  ];

  const filtered =
    filter === "All" ? articles : articles.filter((a) => a.category === filter);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "rw" ? "rw-RW" : locale === "fr" ? "fr-FR" : "en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  // Article detail view
  if (selected) {
    return (
      <main id="main-content">
        <Navbar />
        <article className="pt-28 pb-20">
          <div className="max-w-3xl mx-auto px-5 lg:px-8">
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-sm font-bold text-isoko-primary hover:text-isoko-accent transition mb-8"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              {t("blog.back")}
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black uppercase text-isoko-accent tracking-wider bg-isoko-light px-3 py-1 rounded-md">
                {selected.category}
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {formatDate(selected.createdAt)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-isoko-dark leading-tight mb-4">
              {selected.title}
            </h1>

            <p className="text-sm text-gray-400 mb-8">
              {t("blog.by")}{" "}
              <span className="font-bold text-isoko-primary">
                {selected.author}
              </span>
            </p>

            {selected.image && (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-gray-100">
                <Image fill sizes="(max-width: 768px) 100vw, 768px"
                  src={selected.image}
                  alt={selected.title}
                  className="object-cover"
                />
              </div>
            )}

            <div
              className="prose prose-lg max-w-none text-gray-600 leading-relaxed [&_h2]:font-black [&_h2]:text-isoko-dark [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-bold [&_h3]:text-isoko-dark [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-1 [&_strong]:text-isoko-dark [&_a]:text-isoko-accent [&_a]:font-bold"
              dangerouslySetInnerHTML={{ __html: selected.content }}
            />
          </div>
        </article>
        <Footer />
      </main>
    );
  }

  return (
    <main id="main-content">
      <Navbar />

      <PageHero eyebrow={t("blog.eyebrow")} title={t("blog.title")} body={t("blog.body")} icon="fa-solid fa-newspaper" image="https://images.unsplash.com/photo-1500595046743-cd271d694d30?q=80&w=1800&auto=format&fit=crop" />

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
          {loading && <ContentSkeleton count={6} />}

          {/* Articles Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((article, idx) => (
                <motion.button
                  key={article._id}
                  onClick={() => setSelected(article)}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all text-left"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    {article.image ? (
                      <Image fill sizes="(max-width: 768px) 100vw, 33vw"
                        src={article.image}
                        alt={article.title}
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-isoko-light to-gray-100 flex items-center justify-center">
                        <i className="fa-solid fa-newspaper text-3xl text-gray-200"></i>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase text-isoko-accent tracking-wider">
                        {article.category}
                      </span>
                      <span className="text-gray-200">|</span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-isoko-dark leading-snug group-hover:text-isoko-primary transition line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2 line-clamp-2 leading-relaxed">
                      {article.content.replace(/<[^>]+>/g, "").slice(0, 120)}...
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-isoko-accent text-xs font-bold mt-3 group-hover:gap-2.5 transition-all">
                      {t("blog.read")}{" "}
                      <i className="fa-solid fa-arrow-right text-[9px]"></i>
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-newspaper text-2xl text-gray-300"></i>
              </div>
              <p className="text-gray-400 font-bold text-sm">
                {filter !== "All"
                  ? t("blog.noCategory")
                  : t("blog.empty")}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
