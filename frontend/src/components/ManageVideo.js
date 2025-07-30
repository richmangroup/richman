import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaSearch, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "../AdminSidebar";

function ManageVideo() {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: "", url: "" });

  const token = localStorage.getItem("token");

  // ✅ Fetch videos
  const fetchVideos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/videos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(res.data);
    } catch (err) {
      console.error("❌ Error fetching videos:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // ✅ Add New Video API
  const handleAddVideo = async () => {
    if (!newVideo.title || !newVideo.url) {
      alert("⚠️ Please enter both Title and Video URL");
      return;
    }
    try {
      await axios.post(
        "http://localhost:5000/api/admin/videos",
        newVideo,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Video added successfully!");
      setShowModal(false);
      setNewVideo({ title: "", url: "" });
      fetchVideos();
    } catch (err) {
      alert("❌ Error adding video");
      console.error(err);
    }
  };

  const filteredVideos = videos.filter((v) =>
    v.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex">
      <AdminSidebar active="videos" />

      {/* ✅ Main Content */}
      <div className="flex-1 px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-extrabold tracking-wide">🎬 Manage Videos</h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
          >
            <FaPlus /> Add New Video
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg mb-6 border border-white/20">
          <FaSearch className="mr-2 text-white/70" />
          <input
            type="text"
            className="bg-transparent w-full text-white placeholder-white/60 focus:outline-none"
            placeholder="Search by video title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Video List */}
        <div className="overflow-auto rounded-xl shadow-inner border border-white/10">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-gray-800 text-xs uppercase">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">URL</th>
                <th className="p-3 text-left">Uploaded By</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVideos.map((video, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/10 hover:bg-white/10"
                >
                  <td className="p-3">{video.title}</td>
                  <td className="p-3 truncate max-w-xs">{video.url}</td>
                  <td className="p-3">{video.uploadedBy || "Admin"}</td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button className="bg-yellow-500 hover:bg-yellow-600 px-2 py-1 rounded text-white text-xs">
                        <FaEdit />
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white text-xs">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Add Video Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center">
          <div className="bg-gray-800 p-6 rounded-xl w-96 shadow-lg">
            <h3 className="text-xl mb-4 font-bold">➕ Add New Video</h3>
            <input
              type="text"
              placeholder="Video Title"
              value={newVideo.title}
              onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Video URL (MP4 Link)"
              value={newVideo.url}
              onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
              className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="bg-gray-500 px-3 py-1 rounded">
                Cancel
              </button>
              <button onClick={handleAddVideo} className="bg-blue-500 px-3 py-1 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageVideo;
