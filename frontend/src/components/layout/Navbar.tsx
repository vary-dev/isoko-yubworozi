"use client";
import { useState } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-isoko-dark">ISOKO<span className="text-isoko-accent">.</span></span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-700">
            <Link href="/" className="hover:text-isoko-primary transition">Home</Link>
            <Link href="/about" className="hover:text-isoko-primary transition">About Us</Link>
            <div className="group relative cursor-pointer flex items-center gap-1">
              Topics <ChevronDown size={16} />
              {/* Dropdown would go here */}
            </div>
            <Link href="/resources" className="hover:text-isoko-primary transition">Resources</Link>
            <Link href="/videos" className="hover:text-isoko-primary transition">Videos</Link>
            <Link href="/blog" className="hover:text-isoko-primary transition">Blog</Link>
            <Link href="/contact" className="hover:text-isoko-primary transition">Contact</Link>
          </div>

          {/* Search & Subscribe */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full"><Search size={20} /></button>
            <button className="bg-isoko-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-isoko-dark transition shadow-lg shadow-isoko-primary/20">
              Subscribe
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>{isOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </div>
    </nav>
  );
}