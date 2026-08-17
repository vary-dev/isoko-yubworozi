"use client";
import { useState, useEffect } from 'react';
import { getArticles, uploadArticle, updateArticle, deleteArticle } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Article {
  _id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  image: string;
  author: string;
  createdAt: string;
}

export default function ArticleAdmin() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Market Insights',
    author: 'Isoko Yubworozi',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchArticles = async () => {
    try {
      const res = await getArticles();
      setArticles(res.data);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const resetForm = () => {
    setFormData({ title: '', content: '', category: 'Market Insights', author: 'Isoko Yubworozi' });
    setImageFile(null);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in the title and content.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('category', formData.category);
      data.append('author', formData.author);
      if (imageFile) data.append('image', imageFile);

      if (editingId) {
        await updateArticle(editingId, data);
        alert("Article updated successfully!");
      } else {
        if (!imageFile) {
          alert("Please upload an image for the article.");
          setLoading(false);
          return;
        }
        await uploadArticle(data);
        alert("Article published successfully!");
      }

      resetForm();
      fetchArticles();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save article.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      content: article.content,
      category: article.category,
      author: article.author || 'Isoko Yubworozi',
    });
    setEditingId(article._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await deleteArticle(id);
      alert("Article deleted.");
      fetchArticles();
    } catch (err) {
      alert("Failed to delete article.");
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="space-y-10">
      <header className="border-b-4 border-isoko-dark pb-4">
        <h1 className="text-4xl font-black italic tracking-tighter text-isoko-dark">ISOKO GAZETTE</h1>
        <p className="text-xs font-bold uppercase tracking-[0.5em] text-gray-400">Editorial Management & News</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Editor Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
          <h3 className="font-black text-sm mb-6 uppercase border-b pb-3 tracking-widest text-isoko-dark">
            {editingId ? 'Edit Story' : 'Draft Story'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Article Headline"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border-b-2 border-gray-200 outline-none focus:border-isoko-dark font-serif text-xl bg-transparent"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase outline-none"
            >
              <option>Market Insights</option>
              <option>Technical Advice</option>
              <option>Livestock News</option>
              <option>Seasonal Tips</option>
            </select>
            <input
              type="text"
              placeholder="Author name"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none"
            />
            <textarea
              placeholder="Write your content here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none font-serif text-sm leading-relaxed resize-none"
            />
            <div className="border-2 border-dashed border-gray-200 p-4 rounded-xl text-center hover:border-isoko-accent/50 transition">
              <i className="fa-solid fa-image text-xl text-gray-300 mb-1"></i>
              <p className="text-[10px] font-bold text-gray-400 uppercase">
                {editingId ? 'New Image (optional)' : 'Thumbnail Image'}
              </p>
              <input
                type="file"
                accept="image/*"
                className="text-xs"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageFile(e.target.files?.[0] || null)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-isoko-dark text-white py-4 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-isoko-primary transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? (editingId ? 'Updating...' : 'Publishing...') : (
                <>
                  <i className="fa-solid fa-paper-plane mr-2"></i>
                  {editingId ? 'Update Article' : 'Post to Newsfeed'}
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full bg-gray-100 text-gray-600 py-3 font-black uppercase tracking-widest text-xs rounded-xl hover:bg-gray-200 transition"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>

        {/* Article List */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="font-black text-sm mb-2 uppercase border-b pb-3 tracking-widest text-isoko-dark">
            Publications ({articles.length})
          </h3>

          {fetching && (
            <div className="text-center py-12">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-isoko-accent mb-3"></i>
              <p className="text-gray-400 font-bold text-sm">Loading articles...</p>
            </div>
          )}

          {!fetching && articles.length === 0 && (
            <div className="bg-gray-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200">
              <i className="fa-solid fa-newspaper text-5xl text-gray-200 mb-4"></i>
              <p className="text-gray-400 font-bold text-sm">No articles published yet. Write your first story!</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence>
              {articles.map((article) => (
                <motion.div
                  key={article._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group cursor-pointer bg-white rounded-[1.5rem] border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                    {article.image ? (
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-isoko-light to-gray-200 flex items-center justify-center">
                        <i className="fa-solid fa-newspaper text-3xl text-gray-300"></i>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <span className="text-[10px] font-black uppercase text-isoko-accent tracking-widest">
                      {formatDate(article.createdAt)}
                    </span>
                    <span className="ml-2 text-[9px] font-bold uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    <h4 className="text-base font-bold leading-tight mt-2 group-hover:text-isoko-primary transition">
                      {article.title}
                    </h4>
                    <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {article.content}
                    </p>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                      <button
                        onClick={() => handleEdit(article)}
                        className="text-[10px] font-black text-isoko-primary uppercase hover:text-isoko-accent transition"
                      >
                        <i className="fa-solid fa-pen-to-square mr-1"></i> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(article._id)}
                        className="text-[10px] font-black text-red-400 uppercase hover:text-red-600 transition ml-auto"
                      >
                        <i className="fa-solid fa-trash mr-1"></i> Delete
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
