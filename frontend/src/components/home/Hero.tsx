"use client";
import { motion } from 'framer-motion';
import { PlayCircle, BookOpen, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[50vh] overflow-hidden bg-isoko-dark">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-isoko-dark via-isoko-dark/80 to-transparent z-10" />
      
      {/* The Chicken Image (Abstract/Professional) */}
      <div 
        className="absolute right-0 top-0 w-1/2 h-full bg-cover bg-center opacity-60 md:opacity-100"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80')" }}
      />

      <div className="max-w-7xl mx-auto px-4 h-full flex items-center relative z-20">
        <div className="grid md:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-isoko-accent font-semibold tracking-widest text-sm uppercase mb-4 block">
              @isokoyubworozi YouTube
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6">
              Modern Farming <br />
              <span className="text-isoko-accent">Digitalized.</span>
            </h1>
            
            <div className="flex flex-wrap gap-4">
              <button className="flex items-center gap-2 bg-isoko-accent text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition transform">
                <PlayCircle size={20} /> Watch Our Videos
              </button>
              <button className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition">
                <BookOpen size={20} /> Browse Topics
              </button>
            </div>
          </motion.div>

          {/* Right Part - The Blur Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:block justify-self-center"
          >
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl max-w-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-isoko-accent rounded-full flex items-center justify-center text-white">
                  <ArrowRight />
                </div>
                <div>
                  <h4 className="text-white font-bold">Practical Advice</h4>
                  <p className="text-gray-300 text-xs">Updated weekly on YouTube</p>
                </div>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">
                Unlock high-quality guides for poultry, feeds, and livestock business management.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}