"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchVideos } from "@/lib/api";
import Link from "next/link";

interface Video {
  _id: string;
  title: string;
  youtubeUrl: string;
  thumbnail: string;
  category: string;
  createdAt: string;
}

export default function VideoGallery() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVideos()
      .then((res) => setVideos(res.data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-red-500 mb-2">
              YouTube Channel
            </p>
            <h2 className="text-3xl font-black text-isoko-dark">
              Latest Tutorials
            </h2>
          </div>
          <Link
            href="/videos"
            className="hidden sm:flex items-center gap-2 text-sm font-bold text-isoko-primary hover:text-isoko-accent transition"
          >
            View All
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="aspect-video bg-gray-100 animate-pulse" />
                <div className="pt-3 space-y-2">
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-16" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Grid */}
        {!loading && videos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((video, idx) => (
              <motion.a
                key={video._id}
                href={video.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-sm">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-red-50 to-gray-100 flex items-center justify-center">
                      <i className="fa-brands fa-youtube text-4xl text-red-300"></i>
                    </div>
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                    <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl scale-90 group-hover:scale-100">
                      <i className="fa-solid fa-play text-white text-lg ml-1"></i>
                    </div>
                  </div>
                </div>
                <div className="pt-3">
                  <span className="text-[10px] font-black uppercase text-red-500 tracking-wider">
                    {video.category}
                  </span>
                  <h3 className="text-[15px] font-bold text-isoko-dark mt-1 line-clamp-2 group-hover:text-isoko-primary transition">
                    {video.title}
                  </h3>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-100">
            <i className="fa-brands fa-youtube text-4xl text-gray-200 mb-3"></i>
            <p className="text-gray-400 font-bold text-sm">
              No videos yet. Check our{" "}
              <a
                href="https://youtube.com/@Isokoyubworozi"
                target="_blank"
                className="text-red-500 hover:underline"
              >
                YouTube channel
              </a>
              !
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
