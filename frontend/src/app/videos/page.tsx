"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchVideos } from "@/lib/api";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Video {
  _id: string;
  title: string;
  youtubeUrl: string;
  thumbnail: string;
  category: string;
  createdAt: string;
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchVideos()
      .then((res) => setVideos(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(videos.map((v) => v.category).filter(Boolean))),
  ];

  const filtered =
    filter === "All" ? videos : videos.filter((v) => v.category === filter);

  const getThumbnail = (url: string) => {
    try {
      const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/
      );
      return match
        ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
        : null;
    } catch {
      return null;
    }
  };

  return (
    <main>
      <Navbar />

      {/* Page Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-isoko-dark via-isoko-primary to-isoko-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 bg-red-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-isoko-accent rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <i className="fa-brands fa-youtube text-white text-lg"></i>
              </div>
              <span className="text-red-400 uppercase font-black tracking-[0.2em] text-[11px]">
                YouTube Channel
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
              Video Tutorials
            </h1>
            <p className="text-white/60 max-w-lg text-base leading-relaxed">
              Watch our weekly farming tutorials on poultry, livestock, feed
              formulation, and farm management. Practical knowledge you can
              apply on your farm today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter + Content */}
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
                <div key={i} className="rounded-xl overflow-hidden">
                  <div className="aspect-video bg-gray-200 animate-pulse" />
                  <div className="pt-3 space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Video Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((video, idx) => {
                const thumb =
                  video.thumbnail || getThumbnail(video.youtubeUrl);
                return (
                  <motion.a
                    key={video._id}
                    href={video.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center">
                          <i className="fa-brands fa-youtube text-5xl text-red-200"></i>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl scale-75 group-hover:scale-100">
                          <i className="fa-solid fa-play text-white text-lg ml-1"></i>
                        </div>
                      </div>
                    </div>
                    <div className="pt-3 px-1">
                      <span className="text-[10px] font-black uppercase text-red-500 tracking-wider">
                        {video.category}
                      </span>
                      <h3 className="text-[15px] font-bold text-isoko-dark mt-1 line-clamp-2 group-hover:text-isoko-primary transition">
                        {video.title}
                      </h3>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <i className="fa-brands fa-youtube text-2xl text-gray-300"></i>
              </div>
              <p className="text-gray-400 font-bold text-sm mb-4">
                {filter !== "All"
                  ? `No videos found in "${filter}" category.`
                  : "No videos published yet."}
              </p>
              <a
                href="https://youtube.com/@Isokoyubworozi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-red-500 font-bold text-sm hover:underline"
              >
                <i className="fa-brands fa-youtube"></i>
                Visit our YouTube channel
              </a>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
