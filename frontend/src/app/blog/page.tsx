"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchArticles } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  // Article detail view
  if (selected) {
    return (
      <main>
        <Navbar />
        <article className="pt-28 pb-20">
          <div className="max-w-3xl mx-auto px-5 lg:px-8">
            <button
              onClick={() => setSelected(null)}
              className="flex items-center gap-2 text-sm font-bold text-isoko-primary hover:text-isoko-accent transition mb-8"
            >
              <i className="fa-solid fa-arrow-left text-xs"></i>
              Back to Articles
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
              By{" "}
              <span className="font-bold text-isoko-primary">
                {selected.author}
              </span>
            </p>

            {selected.image && (
              <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8 bg-gray-100">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-full object-cover"
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
    <main>
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-isoko-dark via-isoko-primary to-isoko-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-isoko-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-isoko-accent rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-newspaper text-white text-lg"></i>
              </div>
              <span className="text-isoko-accent uppercase font-black tracking-[0.2em] text-[11px]">
                Farming Blog
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
              Farming Insights
            </h1>
            <p className="text-white/60 max-w-lg text-base leading-relaxed">
              In-depth articles on market trends, seasonal tips, vaccination
              schedules, feed formulation, and everything you need to run a
              successful farm.
            </p>
          </motion.div>
        </div>
      </section>

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
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden"
                >
                  <div className="aspect-[16/10] bg-gray-200 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-20" />
                    <div className="h-4 bg-gray-100 rounded animate-pulse" />
                    <div className="h-3 bg-gray-50 rounded animate-pulse w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

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
                  <div className="aspect-[16/10] overflow-hidden bg-gray-100">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                      Read More{" "}
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
                  ? `No articles found in "${filter}" category.`
                  : "No articles published yet. Check back soon!"}
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
