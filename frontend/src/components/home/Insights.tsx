"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchArticles } from "@/lib/api";
import Link from "next/link";

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

export default function Insights() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles()
      .then((res) => setArticles(res.data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <section className="py-20 bg-gray-50/60">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-isoko-accent mb-2">
              From the Blog
            </p>
            <h2 className="text-3xl font-black text-isoko-dark">
              Farming Insights
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-isoko-primary hover:text-isoko-accent transition"
          >
            View All
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                <div className="aspect-[16/10] bg-gray-100 animate-pulse" />
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
        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article, idx) => (
              <motion.div
                key={article._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all"
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
                  <h4 className="text-[15px] font-bold text-isoko-dark leading-snug group-hover:text-isoko-primary transition line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2 leading-relaxed">
                    {article.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <i className="fa-solid fa-newspaper text-4xl text-gray-200 mb-3"></i>
            <p className="text-gray-400 font-bold text-sm">
              No articles published yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
