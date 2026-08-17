"use client";
import { useState, useEffect } from 'react';
import { getBooks, uploadBook, updateBook, deleteBook } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Book {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  coverImage: string;
  fileUrl: string;
  isPremium: boolean;
  createdAt: string;
}

const emptyForm = { title: '', description: '', category: 'Poultry', price: 0, isPremium: false };

export default function BookAdmin() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [files, setFiles] = useState<{ coverImage: File | null; fileUrl: File | null }>({ coverImage: null, fileUrl: null });

  const fetchBooks = async () => {
    try {
      const res = await getBooks();
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setFiles({ coverImage: null, fileUrl: null });
    setEditingId(null);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in the title and description.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('price', String(formData.price));
    data.append('isPremium', String(formData.isPremium));
    if (files.coverImage) data.append('coverImage', files.coverImage);
    if (files.fileUrl) data.append('fileUrl', files.fileUrl);

    try {
      if (editingId) {
        await updateBook(editingId, data);
        alert("Book updated successfully!");
      } else {
        if (!files.coverImage || !files.fileUrl) {
          alert("Both cover image and PDF file are required for new books.");
          setLoading(false);
          return;
        }
        await uploadBook(data);
        alert("Book uploaded successfully!");
      }
      resetForm();
      fetchBooks();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Upload failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    setFormData({
      title: book.title,
      description: book.description,
      category: book.category,
      price: book.price,
      isPremium: book.isPremium,
    });
    setEditingId(book._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await deleteBook(id);
      alert("Book deleted successfully.");
      fetchBooks();
    } catch (err) {
      alert("Failed to delete book.");
    }
  };

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-3xl font-black text-isoko-dark">Farming Books</h2>
        <p className="text-sm text-gray-400 mt-1">Manage your digital farming library</p>
      </div>

      {/* UPLOAD / EDIT FORM CARD */}
      <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <h3 className="text-lg font-black text-isoko-dark mb-6 uppercase tracking-tight flex items-center gap-3">
          <i className={`fa-solid ${editingId ? 'fa-pen-to-square' : 'fa-cloud-arrow-up'} text-isoko-accent`}></i>
          {editingId ? 'Edit Book' : 'Add New Digital Book'}
        </h3>
        <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <input type="text" placeholder="Book Title" value={formData.title} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-isoko-accent transition"
              onChange={(e) => setFormData({...formData, title: e.target.value})} />
            <textarea placeholder="Description" value={formData.description} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl h-32 outline-none focus:border-isoko-accent transition resize-none"
              onChange={(e) => setFormData({...formData, description: e.target.value})} />
            <div className="flex gap-4">
               <input type="number" placeholder="Price (RWF)" value={formData.price || ''} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-isoko-accent transition"
                 onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
               <select value={formData.category} className="p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-isoko-accent transition" onChange={(e) => setFormData({...formData, category: e.target.value})}>
                  <option>Poultry</option>
                  <option>Livestock</option>
                  <option>Feeds</option>
                  <option>Mixed Farming</option>
               </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.isPremium} onChange={(e) => setFormData({...formData, isPremium: e.target.checked})} className="w-5 h-5 rounded border-gray-300 text-isoko-accent focus:ring-isoko-accent" />
              <span className="text-sm font-bold text-isoko-dark">Premium Content</span>
            </label>
          </div>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 p-6 rounded-2xl text-center hover:border-isoko-accent/50 transition">
              <i className="fa-solid fa-image text-2xl text-gray-300 mb-2"></i>
              <p className="text-xs font-bold text-gray-400 mb-2 uppercase">
                Cover Image {editingId ? '(leave empty to keep current)' : ''}
              </p>
              <input type="file" accept="image/*" className="text-xs" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles({...files, coverImage: e.target.files?.[0] || null})} />
            </div>
            <div className="border-2 border-dashed border-gray-200 p-6 rounded-2xl text-center hover:border-isoko-accent/50 transition">
              <i className="fa-solid fa-file-pdf text-2xl text-gray-300 mb-2"></i>
              <p className="text-xs font-bold text-gray-400 mb-2 uppercase">
                PDF Document {editingId ? '(leave empty to keep current)' : ''}
              </p>
              <input type="file" accept=".pdf" className="text-xs" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFiles({...files, fileUrl: e.target.files?.[0] || null})} />
            </div>
            <button disabled={loading} className="w-full bg-isoko-primary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-isoko-dark transition shadow-lg shadow-isoko-primary/20 disabled:bg-gray-300 disabled:cursor-not-allowed">
              {loading ? "Uploading..." : (editingId ? "Update Book" : "Publish Book")}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition">
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </section>

      {/* BOOKS LIST */}
      {fetching && (
        <div className="text-center py-12">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-isoko-accent mb-3"></i>
          <p className="text-gray-400 font-bold text-sm">Loading books...</p>
        </div>
      )}

      {!fetching && books.length === 0 && (
        <div className="bg-gray-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200">
          <i className="fa-solid fa-book text-5xl text-gray-200 mb-4"></i>
          <p className="text-gray-400 font-bold text-sm">No books published yet. Upload your first book above!</p>
        </div>
      )}

      {books.length > 0 && (
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-isoko-dark mb-6">
            Published Books ({books.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {books.map((book) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm group hover:shadow-md transition-all"
                >
                  <img src={book.coverImage || '/file.svg'} className="w-full h-48 object-cover rounded-xl mb-4 bg-gray-100" alt={book.title} />
                  <h4 className="font-bold text-isoko-dark text-sm truncate">{book.title}</h4>
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">{book.description}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] bg-isoko-light text-isoko-primary px-2 py-1 rounded-lg font-black uppercase">{book.category}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(book)} className="text-isoko-primary hover:text-isoko-accent transition" title="Edit">
                        <i className="fa-solid fa-pen-to-square text-xs"></i>
                      </button>
                      <button onClick={() => handleDelete(book._id)} className="text-red-400 hover:text-red-600 transition" title="Delete">
                        <i className="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  </div>
                  {book.isPremium && (
                    <span className="mt-2 inline-block text-[9px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-black uppercase">Premium</span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
