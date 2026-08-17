"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const contactInfo = [
  {
    icon: "fa-brands fa-youtube",
    label: "YouTube",
    value: "@Isokoyubworozi",
    link: "https://youtube.com/@Isokoyubworozi",
    color: "text-red-500",
  },
  {
    icon: "fa-solid fa-envelope",
    label: "Email",
    value: "info@isokoyubworozi.rw",
    link: "mailto:info@isokoyubworozi.rw",
    color: "text-isoko-accent",
  },
  {
    icon: "fa-solid fa-location-dot",
    label: "Location",
    value: "Kigali, Rwanda",
    link: null,
    color: "text-blue-500",
  },
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <main>
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-isoko-dark via-isoko-primary to-isoko-dark relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-isoko-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-48 h-48 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-isoko-accent uppercase font-black tracking-[0.2em] text-[11px] block mb-4">
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
              Contact Us
            </h1>
            <p className="text-white/60 max-w-lg text-base leading-relaxed">
              Have a question about farming, want to collaborate, or need help
              with our resources? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-gray-50/60">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-black text-isoko-dark mb-6">
                Reach Out
              </h2>
              {contactInfo.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  {item.link ? (
                    <a
                      href={item.link}
                      target={item.link.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all group"
                    >
                      <div
                        className={`w-11 h-11 bg-gray-50 rounded-lg flex items-center justify-center text-lg ${item.color} shrink-0`}
                      >
                        <i className={item.icon}></i>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm font-bold text-isoko-dark group-hover:text-isoko-accent transition">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-100">
                      <div
                        className={`w-11 h-11 bg-gray-50 rounded-lg flex items-center justify-center text-lg ${item.color} shrink-0`}
                      >
                        <i className={item.icon}></i>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-0.5">
                          {item.label}
                        </p>
                        <p className="text-sm font-bold text-isoko-dark">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Social */}
              <div className="pt-4">
                <p className="text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://youtube.com/@Isokoyubworozi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition"
                  >
                    <i className="fa-brands fa-youtube"></i>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:bg-isoko-accent hover:text-white hover:border-isoko-accent transition"
                  >
                    <i className="fa-brands fa-facebook-f"></i>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:bg-isoko-accent hover:text-white hover:border-isoko-accent transition"
                  >
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition"
                  >
                    <i className="fa-brands fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-xl border border-gray-100 p-8">
                <h2 className="text-xl font-black text-isoko-dark mb-1">
                  Send a Message
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  We&apos;ll get back to you as soon as possible.
                </p>

                {sent && (
                  <div className="mb-6 p-4 bg-isoko-light text-isoko-primary rounded-lg text-sm font-bold flex items-center gap-2">
                    <i className="fa-solid fa-check-circle"></i>
                    Message sent! We&apos;ll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 block mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-isoko-accent transition placeholder:text-gray-300"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-isoko-accent transition placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 block mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="What is this about?"
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-isoko-accent transition placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black uppercase tracking-wider text-gray-400 block mb-2">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us more..."
                      className="w-full border border-gray-200 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-isoko-accent transition placeholder:text-gray-300 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-isoko-accent text-white py-3.5 rounded-lg text-sm font-black uppercase tracking-wider hover:bg-isoko-primary transition shadow-md"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
