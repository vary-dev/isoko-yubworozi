"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchArticles } from "@/lib/api";
import Link from "next/link";
import ContentSkeleton from "@/components/ui/ContentSkeleton";
import MediaFrame from "@/components/ui/MediaFrame";
import { useI18n } from "@/lib/i18n";

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
  const { t, locale } = useI18n();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchArticles()
      .then((res) => setArticles(res.data.slice(0, 6)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "rw" ? "rw-RW" : locale === "fr" ? "fr-FR" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const excerpt = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  return (
    <section className="py-20 bg-isoko-canvas" aria-labelledby="insights-title">
      <div className="section-shell">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="eyebrow mb-3 text-isoko-emerald">
              {t("blog.eyebrow")}
            </p>
            <h2 id="insights-title" className="text-3xl font-bold text-isoko-forest sm:text-4xl">
              {t("blog.title")}
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden shrink-0 items-center gap-2 text-sm font-bold text-isoko-emerald transition hover:text-isoko-lime sm:flex"
          >
            {t("common.viewAll")}
            <i aria-hidden="true" className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <ContentSkeleton count={3} />
        )}

        {/* Articles Grid */}
        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, idx) => (
              <motion.div
                key={article._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="min-w-0"
              >
                <Link href={`/blog/${article.slug}`} aria-label={article.title} className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] bg-white shadow-soft transition duration-200 hover:-translate-y-1 hover:shadow-lift">
                <MediaFrame fit="cover" zoom sizes="(max-width: 768px) 100vw, 33vw" src={article.image} alt={article.title} className="aspect-[16/10]" icon="fa-solid fa-newspaper" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-isoko-emerald tracking-wider">
                      {article.category}
                    </span>
                    <span aria-hidden="true" className="text-isoko-neutral">|</span>
                    <time className="text-[10px] text-isoko-muted font-medium" dateTime={article.createdAt}>
                      {formatDate(article.createdAt)}
                    </time>
                  </div>
                  <h3 className="mt-2 text-[15px] font-bold text-isoko-forest leading-snug group-hover:text-isoko-emerald transition line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-isoko-muted">
                    {excerpt(article.content)}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 pt-4 text-xs font-extrabold text-isoko-emerald">{t("blog.read")}<i aria-hidden="true" className="fa-solid fa-arrow-right text-[10px] transition group-hover:translate-x-1" /></span>
                </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-[1.5rem] bg-white py-16 text-center shadow-soft">
            <i aria-hidden="true" className="fa-solid fa-triangle-exclamation text-4xl text-isoko-muted/40 mb-3"></i>
            <p className="font-bold text-isoko-muted text-sm">{t("library.loadError")}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && articles.length === 0 && (
          <div className="rounded-[1.5rem] bg-white py-16 text-center shadow-soft">
            <i aria-hidden="true" className="fa-solid fa-newspaper text-4xl text-isoko-muted/40 mb-3"></i>
            <p className="font-bold text-isoko-muted text-sm">
              {t("blog.empty")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
