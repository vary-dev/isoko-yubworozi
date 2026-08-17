"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchVideos } from '@/lib/api';
import { Play } from 'lucide-react';

export default function VideoGallery() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchVideos().then(res => setVideos(res.data)).catch(err => console.log(err));
  }, []);

  return (
    <section className="py-20 bg-isoko-light/20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div className="text-left">
            <h2 className="text-3xl font-bold text-isoko-dark">Latest Tutorials</h2>
            <p className="text-gray-600">Practical farming guides from our YouTube channel</p>
          </div>
          <button className="text-isoko-primary font-bold hover:underline">View All Videos</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.slice(0, 3).map((video: any, index: number) => (
            <motion.div 
              key={video._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-4">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <div className="w-16 h-16 bg-isoko-accent rounded-full flex items-center justify-center text-white">
                    <Play fill="white" />
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold text-isoko-accent uppercase">{video.category}</span>
              <h3 className="text-lg font-bold text-isoko-dark mt-1 line-clamp-2">{video.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}