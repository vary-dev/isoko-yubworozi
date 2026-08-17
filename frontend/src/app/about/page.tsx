"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const values = [
  {
    icon: "fa-solid fa-graduation-cap",
    title: "Education First",
    description:
      "We believe every farmer deserves access to quality farming education — free and in their language.",
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: "fa-solid fa-handshake",
    title: "Community Driven",
    description:
      "Built by farmers, for farmers. Our content reflects real challenges and practical solutions.",
    color: "bg-isoko-light text-isoko-primary",
  },
  {
    icon: "fa-solid fa-lightbulb",
    title: "Modern Techniques",
    description:
      "We bridge traditional farming wisdom with modern agricultural science and technology.",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    icon: "fa-solid fa-globe-africa",
    title: "Rwandan Focus",
    description:
      "Content tailored specifically for Rwandan climate, markets, and farming conditions.",
    color: "bg-purple-50 text-purple-500",
  },
];

const milestones = [
  { year: "2022", title: "Channel Launched", desc: "Started creating farming content on YouTube" },
  { year: "2023", title: "5,000+ Subscribers", desc: "Growing community of active farmers" },
  { year: "2024", title: "Digital Platform", desc: "Launched website with books, articles, and guides" },
  { year: "2025", title: "Multi-language", desc: "Content available in Kinyarwanda, English, and French" },
];

export default function AboutPage() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-isoko-dark via-isoko-primary to-isoko-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-isoko-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <span className="text-isoko-accent uppercase font-black tracking-[0.2em] text-[11px] block mb-4">
              About Us
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
              Empowering Farmers{" "}
              <span className="bg-gradient-to-r from-isoko-accent to-[#7BC96F] bg-clip-text text-transparent">
                Through Knowledge
              </span>
            </h1>
            <p className="text-white/60 text-base leading-relaxed">
              Isoko y&apos;Ubworozi is Rwanda&apos;s leading digital farming
              platform, providing practical education on poultry and livestock
              farming through videos, articles, and downloadable guides.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-isoko-accent mb-3">
                Our Mission
              </p>
              <h2 className="text-3xl font-black text-isoko-dark mb-6 leading-tight">
                Making Farming Knowledge Accessible to Every Rwandan
              </h2>
              <div className="space-y-4 text-gray-500 leading-relaxed">
                <p>
                  At Isoko y&apos;Ubworozi, we believe that modern farming
                  success starts with knowledge. Our mission is to bridge the
                  gap between agricultural science and practical farming by
                  delivering clear, actionable content in Kinyarwanda, English,
                  and French.
                </p>
                <p>
                  From broiler production and egg farming to pig rearing and feed
                  formulation, we cover every aspect of livestock and poultry
                  farming. Our content is created by experienced farmers and
                  agricultural experts who understand the unique challenges
                  Rwandan farmers face.
                </p>
                <p>
                  Whether you&apos;re a beginner looking to start your first
                  poultry project or an experienced farmer seeking to optimize
                  your operations, our platform has the resources you need.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-5"
            >
              {[
                { num: "100+", label: "Video Tutorials" },
                { num: "5K+", label: "Farmers Reached" },
                { num: "3", label: "Languages" },
                { num: "Weekly", label: "New Content" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-6 text-center"
                >
                  <p className="text-3xl font-black text-isoko-dark mb-1">
                    {stat.num}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-isoko-accent mb-2">
              What We Stand For
            </p>
            <h2 className="text-3xl font-black text-isoko-dark">
              Our Core Values
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg mb-5 ${val.color}`}
                >
                  <i className={val.icon}></i>
                </div>
                <h3 className="text-[15px] font-black text-isoko-dark mb-2">
                  {val.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {val.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-isoko-accent mb-2">
              Our Journey
            </p>
            <h2 className="text-3xl font-black text-isoko-dark">
              Milestones
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {milestones.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                className="relative bg-gradient-to-br from-isoko-dark to-isoko-primary rounded-xl p-6 text-white"
              >
                <span className="text-4xl font-black text-white/10 absolute top-4 right-4">
                  {m.year}
                </span>
                <p className="text-isoko-accent font-black text-sm mb-1 relative">
                  {m.year}
                </p>
                <h3 className="text-lg font-black mb-2 relative">{m.title}</h3>
                <p className="text-white/60 text-sm relative">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-isoko-dark via-isoko-primary to-isoko-dark text-white">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-white/60 max-w-md mx-auto mb-8">
            Join thousands of Rwandan farmers who are improving their farms with
            our free content.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://youtube.com/@Isokoyubworozi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#FF0000] text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-[#E00000] transition-all shadow-xl"
            >
              <i className="fa-brands fa-youtube text-lg"></i>
              Watch on YouTube
            </a>
            <Link
              href="/blog"
              className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-white/20 transition-all"
            >
              Read Articles
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
