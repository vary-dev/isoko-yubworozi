"use client";
import Link from 'next/link';
import { MSquare, Mail, Phone, MapPin, ArrowRight, AArrowDown, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-isoko-dark text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">ISOKO<span className="text-isoko-accent">.</span></h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering farmers with practical knowledge. We provide digital tools and guides to modernize agriculture and livestock farming in Rwanda.
            </p>
            <div className="flex gap-4">
              <Link href="https://youtube.com/@Isokoyubworozi" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-isoko-accent transition">
                <MSquare size={20} />
              </Link>
              <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-isoko-accent transition">
                <Globe size={20} />
              </Link>
              <Link href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-isoko-accent transition">
                <AArrowDown size={20} />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="/" className="hover:text-isoko-accent transition">Home</Link></li>
              <li><Link href="/about" className="hover:text-isoko-accent transition">About Us</Link></li>
              <li><Link href="/topics" className="hover:text-isoko-accent transition">Farming Topics</Link></li>
              <li><Link href="/contact" className="hover:text-isoko-accent transition">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-6">Resources</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link href="/videos" className="hover:text-isoko-accent transition">Video Tutorials</Link></li>
              <li><Link href="/blog" className="hover:text-isoko-accent transition">Farming Blog</Link></li>
              <li><Link href="/books" className="hover:text-isoko-accent transition">Digital Books</Link></li>
              <li><Link href="/resources" className="hover:text-isoko-accent transition">Free Guides</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6">Subscribe</h4>
            <p className="text-gray-400 text-sm mb-6">Get the latest farming tips and updates delivered to your inbox.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-isoko-accent transition"
              />
              <button className="absolute right-2 top-2 bg-isoko-accent p-1.5 rounded-lg hover:scale-105 transition">
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} Isoko Yubworozi. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}