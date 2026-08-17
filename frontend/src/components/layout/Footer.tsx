"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-isoko-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-isoko-accent text-sm">
                <i className="fa-solid fa-seedling"></i>
              </div>
              <span className="text-xl font-black tracking-tight">
                ISOKO<span className="text-isoko-accent">.</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">
              Empowering Rwandan farmers with practical knowledge, digital
              tools, and expert guides for modern livestock and poultry farming.
            </p>
            <div className="flex gap-3">
              <a
                href="https://youtube.com/@Isokoyubworozi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-white/8 rounded-lg flex items-center justify-center hover:bg-red-600 transition text-gray-400 hover:text-white"
              >
                <i className="fa-brands fa-youtube text-sm"></i>
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/8 rounded-lg flex items-center justify-center hover:bg-isoko-accent transition text-gray-400 hover:text-white"
              >
                <i className="fa-brands fa-facebook-f text-sm"></i>
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/8 rounded-lg flex items-center justify-center hover:bg-isoko-accent transition text-gray-400 hover:text-white"
              >
                <i className="fa-brands fa-instagram text-sm"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider mb-5 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-isoko-accent transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/videos"
                  className="text-gray-400 hover:text-isoko-accent transition"
                >
                  Video Tutorials
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-isoko-accent transition"
                >
                  Farming Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/books"
                  className="text-gray-400 hover:text-isoko-accent transition"
                >
                  Digital Books
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-isoko-accent transition"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider mb-5 text-white">
              Resources
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://youtube.com/@Isokoyubworozi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-isoko-accent transition"
                >
                  YouTube Channel
                </a>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-isoko-accent transition"
                >
                  Market Insights
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-isoko-accent transition"
                >
                  Technical Advice
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-isoko-accent transition"
                >
                  Seasonal Tips
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider mb-5 text-white">
              Stay Updated
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Get farming tips delivered to your inbox.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-isoko-accent transition placeholder:text-gray-500"
              />
              <button
                type="submit"
                className="w-full bg-isoko-accent text-white py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-isoko-primary transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-3 text-gray-500 text-xs">
          <p>
            &copy; {new Date().getFullYear()} Isoko y&apos;Ubworozi. All rights
            reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
