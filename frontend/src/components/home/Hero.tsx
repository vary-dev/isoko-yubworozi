"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <section aria-labelledby="hero-title" className="relative w-full min-h-[680px] h-[92svh] max-h-[920px] bg-isoko-dark flex items-center overflow-hidden">
      {/* Background Video + Fallback */}
      <div className="absolute inset-0 z-0">
        {!videoLoaded && (
          <div
            className="absolute inset-0 bg-cover bg-center z-10"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=2073')",
            }}
          />
        )}
        <video
          autoPlay
          muted
          loop
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          preload="metadata"
          poster="https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=70&w=1600&auto=format&fit=crop"
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-35" : "opacity-0"
          }`}
        >
          <source
            src="https://assets.mixkit.co/videos/preview/mixkit-freezing-fog-on-the-fields-of-a-farm-34440-large.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-isoko-dark via-isoko-dark/85 to-isoko-dark/40" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-isoko-dark/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 w-full relative z-20 pt-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="h-[2px] w-10 bg-isoko-accent"></span>
              <span className="text-isoko-accent uppercase font-black tracking-[0.25em] text-[11px]">
                Rwanda&apos;s Farming Platform
              </span>
            </div>

            <h1 id="hero-title" className="text-[clamp(2.65rem,8vw,5rem)] font-black text-white leading-[1.02] mb-6 text-balance">
              Farm Smarter.
              <br />
              <span className="bg-gradient-to-r from-isoko-accent to-[#7BC96F] bg-clip-text text-transparent">
                Live Better.
              </span>
            </h1>

            <p className="text-white/70 text-base sm:text-lg mb-9 leading-relaxed max-w-lg font-medium">
              Your trusted source for livestock and poultry farming knowledge.
              Access free guides, video tutorials, and expert advice to
              modernize your farm.
            </p>

            <div className="flex flex-col xs:flex-row sm:flex-row gap-3 sm:gap-4">
              <a
                href="https://youtube.com/@Isokoyubworozi"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-12 items-center justify-center gap-3 bg-[#e00000] text-white px-6 sm:px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-[#bd0000] hover:-translate-y-0.5 transition-all shadow-xl shadow-red-950/30"
              >
                <i className="fa-brands fa-youtube text-lg"></i>
                Watch Tutorials
              </a>

              <Link
                href="/blog"
                className="flex min-h-12 items-center justify-center gap-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white px-6 sm:px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-white/20 hover:-translate-y-0.5 transition-all"
              >
                Read Articles
              </Link>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-8 mt-10 sm:mt-12 pt-7 sm:pt-8 border-t border-white/15 max-w-xl">
              <div>
                <p className="text-2xl font-black text-white">100+</p>
                <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider">
                  Video Tutorials
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">5K+</p>
                <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider">
                  Farmers Reached
                </p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">Weekly</p>
                <p className="text-[11px] text-white/50 font-bold uppercase tracking-wider">
                  New Content
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
