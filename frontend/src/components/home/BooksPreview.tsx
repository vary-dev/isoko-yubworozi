"use client";
import { useEffect, useState } from 'react';
import { fetchBooks } from '@/lib/api';
import { motion } from 'framer-motion';
import { ShoppingCart, FileText } from 'lucide-react';

export default function BooksPreview() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchBooks().then(res => setBooks(res.data)).catch(err => console.log(err));
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-isoko-dark rounded-[3rem] p-12 relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-isoko-accent/10 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="relative z-10 grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 text-white">
              <h2 className="text-4xl font-bold mb-6">Digital Farming Library</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Unlock professional guides on Poultry, Livestock, and Agri-business. Detailed, practical, and ready to implement.
              </p>
              <button className="bg-white text-isoko-dark px-8 py-4 rounded-xl font-bold hover:bg-isoko-accent hover:text-white transition">
                Browse Full Library
              </button>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {books.slice(0, 2).map((book: any) => (
                <div key={book._id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex gap-6">
                  <img src={book.coverImage} className="w-24 h-32 object-cover rounded-lg shadow-xl" />
                  <div className="flex flex-col justify-center">
                    <h4 className="text-white font-bold text-lg mb-2">{book.title}</h4>
                    <p className="text-isoko-accent font-bold mb-4">{book.price > 0 ? `${book.price} RWF` : 'FREE'}</p>
                    <button className="flex items-center gap-2 text-xs bg-isoko-accent text-white w-fit px-4 py-2 rounded-lg">
                      <FileText size={14} /> Get Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}