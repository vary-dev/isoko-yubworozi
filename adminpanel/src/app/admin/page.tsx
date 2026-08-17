"use client";
import { useState, useEffect } from 'react';
import { getStats, getRecentActivity } from '@/lib/api';
import { motion } from "framer-motion";
import Link from "next/link";

interface Stats {
  books: number;
  articles: number;
  videos: number;
}

interface ActivityItem {
  type: 'book' | 'article' | 'video';
  title: string;
  image: string;
  createdAt: string;
}

const typeIcons: Record<string, { icon: string; color: string }> = {
  book: { icon: 'fa-book', color: 'text-blue-600' },
  article: { icon: 'fa-newspaper', color: 'text-isoko-accent' },
  video: { icon: 'fa-play', color: 'text-red-500' },
};

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({ books: 0, articles: 0, videos: 0 });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          getStats(),
          getRecentActivity(),
        ]);
        setStats(statsRes.data);
        setActivity(activityRes.data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const statsCards = [
    { label: "Total Books", value: stats.books, icon: "fa-book", color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Video Links", value: stats.videos, icon: "fa-play", color: "text-red-500", bg: "bg-red-50" },
    { label: "Blog Posts", value: stats.articles, icon: "fa-newspaper", color: "text-isoko-accent", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-isoko-dark to-isoko-primary rounded-[2.5rem] p-10 text-white relative overflow-hidden"
      >
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-isoko-accent mb-2">Welcome Back</p>
          <h1 className="text-4xl font-black tracking-tight mb-2">Command Center</h1>
          <p className="text-gray-300 text-sm max-w-md">Manage your farming content, track analytics, and keep your audience engaged.</p>
        </div>
        <i className="fa-solid fa-seedling absolute -bottom-8 -right-8 text-[10rem] text-white/5 -rotate-12"></i>
      </motion.div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:border-isoko-accent/40 transition-all"
          >
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">{stat.label}</p>
              {loading ? (
                <div className="h-10 w-16 bg-gray-100 rounded-lg animate-pulse"></div>
              ) : (
                <h3 className="text-4xl font-black text-isoko-dark">{stat.value}</h3>
              )}
            </div>
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center text-xl ${stat.color} group-hover:scale-110 transition`}>
              <i className={`fa-solid ${stat.icon}`}></i>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ACTION & ACTIVITY SECTION */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Uploads */}
        <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
          <h4 className="text-sm font-black text-isoko-dark mb-6 flex items-center gap-3 uppercase tracking-widest">
            <i className="fa-solid fa-clock-rotate-left text-isoko-accent"></i> Recent Activity
          </h4>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-gray-200 rounded-xl animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && activity.length === 0 && (
            <div className="text-center py-8">
              <i className="fa-solid fa-inbox text-3xl text-gray-200 mb-3"></i>
              <p className="text-gray-400 text-sm font-bold">No recent activity yet.</p>
              <p className="text-gray-300 text-xs mt-1">Start by uploading books, articles, or videos!</p>
            </div>
          )}

          {!loading && activity.length > 0 && (
            <div className="space-y-3">
              {activity.slice(0, 5).map((item, i) => {
                const typeInfo = typeIcons[item.type] || typeIcons.book;
                return (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <i className={`fa-solid ${typeInfo.icon} ${typeInfo.color}`}></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-isoko-dark truncate max-w-[200px]">{item.title}</p>
                        <p className="text-[10px] text-gray-400 uppercase font-black">
                          {item.type} &middot; {timeAgo(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Link href="/admin/books" className="block bg-isoko-dark rounded-[2rem] p-8 text-white group hover:bg-isoko-primary transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-isoko-accent">
                <i className="fa-solid fa-book text-lg"></i>
              </div>
              <div>
                <h4 className="font-black text-sm uppercase">Upload Book</h4>
                <p className="text-gray-400 text-xs">Add new digital farming resources</p>
              </div>
              <i className="fa-solid fa-arrow-right ml-auto group-hover:translate-x-1 transition-transform"></i>
            </div>
          </Link>
          <Link href="/admin/articles" className="block bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm group hover:border-isoko-accent/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-isoko-light rounded-xl flex items-center justify-center text-isoko-primary">
                <i className="fa-solid fa-newspaper text-lg"></i>
              </div>
              <div>
                <h4 className="font-black text-sm uppercase text-isoko-dark">Write Article</h4>
                <p className="text-gray-400 text-xs">Publish to the blog gazette</p>
              </div>
              <i className="fa-solid fa-arrow-right ml-auto text-isoko-dark group-hover:translate-x-1 transition-transform"></i>
            </div>
          </Link>
          <Link href="/admin/videos" className="block bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm group hover:border-isoko-accent/40 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                <i className="fa-brands fa-youtube text-lg"></i>
              </div>
              <div>
                <h4 className="font-black text-sm uppercase text-isoko-dark">Sync Video</h4>
                <p className="text-gray-400 text-xs">Link YouTube content instantly</p>
              </div>
              <i className="fa-solid fa-arrow-right ml-auto text-isoko-dark group-hover:translate-x-1 transition-transform"></i>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
