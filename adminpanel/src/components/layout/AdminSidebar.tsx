"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';

const menuItems = [
  { name: "Dashboard", icon: "fa-chart-pie", href: "/admin" },
  { name: "Farming Books", icon: "fa-book", href: "/admin/books" },
  { name: "Blog Gazette", icon: "fa-newspaper", href: "/admin/articles" },
  { name: "YouTube Hub", icon: "fa-brands fa-youtube", href: "/admin/videos" },
  { name: "Media Library", icon: "fa-images", href: "/admin/media" },
  { name: "Analytics", icon: "fa-chart-line", href: "/admin/analytics" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_user');
    router.push('/login');
  };

  const renderNavContent = () => (
    <>
      <div className="mb-9 px-3">
        <Image src="https://res.cloudinary.com/dydg39ukk/image/upload/v1788943683/isoko-yubworozi-logo_ijbygk.png" alt="Isoko y'Ubworozi" width={220} height={75} className="h-16 w-auto object-contain brightness-0 invert" priority />
        <span className="mt-2 block text-[9px] font-extrabold uppercase tracking-[0.24em] text-lime">Admin Studio</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              onClick={() => setIsOpen(false)}
              className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${
                isActive ? "text-white" : "text-white/55 hover:text-white"
              }`}
            >
              <i className={`${item.icon} text-lg group-hover:text-isoko-accent transition-colors`}></i>
              <span className="font-bold text-xs uppercase tracking-widest">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-white/10 rounded-2xl -z-10"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/10 pt-6">
        <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 w-full text-red-400 hover:text-red-300 font-bold uppercase text-[10px] tracking-widest">
          <i className="fa-solid fa-power-off"></i> Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-5 left-5 z-[100]">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-isoko-dark text-white rounded-2xl flex items-center justify-center shadow-xl"
        >
          <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 bg-forest fixed h-screen flex-col p-6 z-50">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 w-72 h-screen bg-forest p-6 z-[90] lg:hidden flex flex-col"
            >
              {renderNavContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
