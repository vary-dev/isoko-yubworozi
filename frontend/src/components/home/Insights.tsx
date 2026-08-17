"use client";
import { motion } from 'framer-motion';
import { Bird, Database, Users, TrendingUp } from 'lucide-react';

const features = [
  { icon: <Bird className="text-isoko-accent" />, title: "Poultry Care", desc: "Advanced guides on brooding and layers." },
  { icon: <Database className="text-isoko-accent" />, title: "Feed Formulation", desc: "Save costs with our digital feed guides." },
  { icon: <TrendingUp className="text-isoko-accent" />, title: "Market Growth", desc: "Turn your farm into a profitable business." },
];

export default function Insights() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-isoko-dark text-3xl md:text-4xl font-bold mb-4">Engagement & Insights</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Your source for practical farming knowledge. We bridge the gap between tradition and digital efficiency.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-8 rounded-2xl bg-isoko-light/30 border border-isoko-light hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 mx-auto">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-isoko-dark mb-3">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}