"use client";
import { useState, useEffect } from 'react';
import { getVideos, uploadVideo, updateVideo, deleteVideo } from '@/lib/api';
import { AnimatePresence, motion } from 'framer-motion';

interface Video {
  _id: string;
  title: string;
  youtubeUrl: string;
  thumbnail: string;
  category: string;
  createdAt: string;
}

export default function VideoAdmin() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    youtubeUrl: '',
    category: 'Poultry',
  });

  const fetchVideos = async () => {
    try {
      const res = await getVideos();
      setVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch videos:", err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchVideos(); }, []);

  const resetForm = () => {
    setFormData({ title: '', youtubeUrl: '', category: 'Poultry' });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.youtubeUrl.trim()) return;
    if (!formData.title.trim()) {
      alert("Please enter a video title.");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await updateVideo(editingId, formData);
        alert("Video updated!");
      } else {
        await uploadVideo(formData);
        alert("Video added!");
      }
      resetForm();
      fetchVideos();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error saving video.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: Video) => {
    setFormData({
      title: video.title,
      youtubeUrl: video.youtubeUrl,
      category: video.category,
    });
    setEditingId(video._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
      await deleteVideo(id);
      alert("Video deleted.");
      fetchVideos();
    } catch (err) {
      alert("Failed to delete video.");
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-3xl font-black text-isoko-dark">YouTube Hub</h2>
        <p className="text-sm text-gray-400 mt-1">Sync and manage your YouTube farming tutorials</p>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-red-500/20">
            <i className="fa-brands fa-youtube"></i>
          </div>
          <div>
            <h3 className="text-xl font-black text-isoko-dark">
              {editingId ? 'Edit Video' : 'YouTube Sync'}
            </h3>
            <p className="text-gray-400 text-sm">
              {editingId ? 'Update video details' : 'Add your latest channel content to the website gallery'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              type="text"
              placeholder="Video Title (e.g. How to Raise Broilers)"
              className="p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-red-500 font-bold text-sm transition"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-red-500 font-bold text-sm transition"
            >
              <option>Poultry</option>
              <option>Livestock</option>
              <option>Feeds & Nutrition</option>
              <option>Housing</option>
              <option>Health & Vaccines</option>
              <option>Market Tips</option>
            </select>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              value={formData.youtubeUrl}
              onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
              type="text"
              placeholder="Paste YouTube Video URL (e.g. https://youtube.com/watch?v=...)"
              className="flex-1 p-5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-red-500 font-bold text-sm transition"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-isoko-dark text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all shadow-xl disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : (editingId ? "Update" : "Add to Feed")}
            </button>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full bg-gray-100 text-gray-600 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Video Grid */}
      {fetching && (
        <div className="text-center py-12">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-isoko-accent mb-3"></i>
          <p className="text-gray-400 font-bold text-sm">Loading videos...</p>
        </div>
      )}

      {!fetching && videos.length > 0 && (
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-isoko-dark mb-6">
            Synced Videos ({videos.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {videos.map((video) => (
                <motion.div
                  key={video._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  <div className="aspect-video bg-gray-100 overflow-hidden relative group">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`${video.thumbnail ? 'hidden' : ''} absolute inset-0 flex items-center justify-center bg-gray-100`}>
                      <i className="fa-brands fa-youtube text-4xl text-red-400"></i>
                    </div>
                    <a
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all"
                    >
                      <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                        <i className="fa-solid fa-play text-white text-lg ml-1"></i>
                      </div>
                    </a>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-sm text-isoko-dark truncate">{video.title || 'Untitled Video'}</h4>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-[10px] text-gray-400 font-bold uppercase bg-gray-50 px-2 py-1 rounded">
                        {video.category || 'General'}
                      </p>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(video)} className="text-isoko-primary hover:text-isoko-accent transition" title="Edit">
                          <i className="fa-solid fa-pen-to-square text-xs"></i>
                        </button>
                        <button onClick={() => handleDelete(video._id)} className="text-red-400 hover:text-red-600 transition" title="Delete">
                          <i className="fa-solid fa-trash text-xs"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {!fetching && videos.length === 0 && (
        <div className="bg-gray-50 rounded-[2rem] p-12 text-center border-2 border-dashed border-gray-200">
          <i className="fa-brands fa-youtube text-5xl text-gray-200 mb-4"></i>
          <p className="text-gray-400 font-bold text-sm">No videos synced yet. Add a YouTube URL above to get started.</p>
        </div>
      )}
    </div>
  );
}
