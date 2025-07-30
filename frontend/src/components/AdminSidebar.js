import React from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminSidebar({ activeSection, setActiveSection }) {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 p-6">
      <h2 className="text-2xl font-bold mb-8">⚡ Admin Panel</h2>

      <nav className="flex flex-col gap-4">
        <button
          onClick={() => setActiveSection && setActiveSection("transactions")}
          className={`text-left px-4 py-2 rounded-lg transition ${
            activeSection === "transactions"
              ? "bg-blue-600"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          💰 Manage Transactions
        </button>

        <Link
          to="/admin/videos"
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
        >
          🎬 Manage Videos
        </Link>

        <button
          onClick={() => navigate("/home")}
          className="mt-6 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition"
        >
          ⬅ Back to Home
        </button>
      </nav>
    </div>
  );
}

export default AdminSidebar;
