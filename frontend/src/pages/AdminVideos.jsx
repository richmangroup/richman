import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactPlayer from "react-player";

import { FaPlus, FaTrash, FaEdit, FaSearch, FaStepBackward, FaStepForward } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function AdminVideos() {
  const [videos, setVideos] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState({ show: false, type: "", message: "", confirmAction: null });

  const videosPerPage = 6;
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ✅ Fetch Videos
  const fetchVideos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/videos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(res.data);
    } catch (err) {
      console.error("❌ Error fetching videos", err);
    }
  };
  

  useEffect(() => {
    fetchVideos();
  }, []);

  // ✅ Add / Update Video
  const handleSave = async () => {
    if (!title || !url) return showMessage("error", "Please fill all fields!");
    const payload = { title, url, duration };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/videos/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showMessage("success", "✅ Video updated!");
      } else {
        await axios.post("http://localhost:5000/api/videos", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showMessage("success", "✅ Video added!");
      }
      setTitle(""); setUrl(""); setDuration(""); setEditId(null);
      fetchVideos();
    } catch {
      showMessage("error", "❌ Video failed to save");
    }
  };

  // ✅ Show popup message
  const showMessage = (type, message) => {
    setShowPopup({ show: true, type, message, confirmAction: null });
    setTimeout(() => setShowPopup({ show: false, type: "", message: "", confirmAction: null }), 2000);
  };

  // ✅ Ask confirmation with custom modal
  const confirmDelete = (id) => {
    setShowPopup({
      show: true,
      type: "confirm",
      message: "🗑 Are you sure you want to delete this video?",
      confirmAction: () => handleDelete(id),
    });
  };

  // ✅ Delete Video
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowPopup({ show: true, type: "success", message: "🗑 Video deleted", confirmAction: null });
      fetchVideos();
    } catch {
      showMessage("error", "❌ Error deleting video");
    }
  };

  // ✅ Edit Video
  const handleEdit = (video) => {
    setEditId(video._id);
    setTitle(video.title);
    setUrl(video.url);
    setDuration(video.duration);
  };
  

  // ✅ Pagination
  const filteredVideos = videos.filter(v => v.title.toLowerCase().includes(search.toLowerCase()));
  const currentVideos = filteredVideos.slice((currentPage - 1) * videosPerPage, currentPage * videosPerPage);
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-800 text-white flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900/80 backdrop-blur-xl border-r border-gray-700 p-6 shadow-2xl sticky top-0 h-screen">
        <h2 className="text-3xl font-extrabold mb-8">⚡ Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/admin" className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 transition">💰 Manage Transactions</Link>
          <button className="px-4 py-2 rounded-xl bg-blue-600">🎬 Manage Videos</button>
          <button onClick={() => navigate('/home')} className="mt-6 px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 transition">⬅ Back to Home</button>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-1 px-8 py-10">
        <h2 className="text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg">🎬 Admin Video Management</h2>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 mb-6 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="p-3 rounded-lg text-black" placeholder="Video Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="p-3 rounded-lg text-black" placeholder="Video URL" value={url} onChange={(e) => setUrl(e.target.value)} />
            <input className="p-3 rounded-lg text-black" placeholder="Duration (seconds)" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
          <button onClick={handleSave} className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-80 px-5 py-2 rounded-xl shadow-lg transition">
            {editId ? "Update Video" : "Add Video"} <FaPlus className="inline ml-1" />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-6">
          <input className="flex-1 p-3 rounded-lg text-black" placeholder="🔍 Search videos..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <FaSearch className="text-gray-300 text-2xl" />
        </div>

        {/* Videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentVideos.map((v) => (
            <VideoCard key={v._id} video={v} handleEdit={handleEdit} handleDelete={confirmDelete} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="bg-gray-700 px-3 py-1 rounded-lg disabled:opacity-40"><FaStepBackward /></button>
            <span>Page {currentPage} / {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)} className="bg-gray-700 px-3 py-1 rounded-lg disabled:opacity-40"><FaStepForward /></button>
          </div>
        )}
      </div>

      {/* ✅ Animated Popup */}
      <AnimatePresence>
        {showPopup.show && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-600 text-center max-w-sm">
              <h3 className="text-xl mb-4">{showPopup.message}</h3>

              {showPopup.type === "confirm" ? (
                <div className="flex justify-center gap-4">
                  <button onClick={() => { showPopup.confirmAction(); setShowPopup({ show: false }); }} className="bg-red-600 px-4 py-2 rounded-lg">Yes</button>
                  <button onClick={() => setShowPopup({ show: false })} className="bg-gray-600 px-4 py-2 rounded-lg">Cancel</button>
                </div>
              ) : (
                <button onClick={() => setShowPopup({ show: false })} className="mt-2 bg-blue-600 px-4 py-2 rounded-lg">OK</button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// ✅ VideoCard Component
const VideoCard = ({ video, handleEdit, handleDelete }) => {
  const [playerError, setPlayerError] = useState(false);
  const [loading, setLoading] = useState(true);
  

  return (
    
    <div className="bg-gray-800/70 p-4 rounded-2xl shadow-lg border border-white/10 hover:scale-105 transform transition duration-300">
      <div className="rounded-lg overflow-hidden mb-2 relative">
        {loading && <div className="absolute inset-0 flex items-center justify-center bg-black/40"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div></div>}

        {!playerError ? (
          <ReactPlayer url={video.url} width="100%" height="200px" controls onReady={() => setLoading(false)} onError={() => { setPlayerError(true); setLoading(false); }} />
        ) : (
          <video src={video.url} width="100%" height="200px" controls className="bg-black" onLoadedData={() => setLoading(false)} />
        )}
      </div>
      

      <h3 className="text-xl font-semibold mb-1">{video.title}</h3>
      <p className="text-sm text-gray-300">⏳ {video.duration} sec</p>

      <div className="flex gap-2 mt-3">
        <button className="bg-yellow-500 px-3 py-1 rounded-lg" onClick={() => handleEdit(video)}><FaEdit /></button>
        <button className="bg-red-600 px-3 py-1 rounded-lg" onClick={() => handleDelete(video._id)}><FaTrash /></button>
      </div>
    </div>
  );
};

export default AdminVideos;
