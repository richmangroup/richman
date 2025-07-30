import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaSearch, FaFileCsv, FaCheck, FaTimes } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

function AdminPanel() {
  const [allDeposits, setAllDeposits] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('pending');
  const [activeSection, setActiveSection] = useState('transactions');
  const depositsPerPage = 5;
  const navigate = useNavigate();

  // ✅ Fetch Deposits
  const fetchAllDeposits = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get('http://localhost:5000/api/admin/deposits', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllDeposits(res.data);
    } catch (err) {
      console.error("❌ Error fetching deposits:", err);
    }
  };

  useEffect(() => {
    fetchAllDeposits();
  }, []);

  // ✅ Approve/Reject Handlers
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/admin/verify/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllDeposits();
    } catch {
      alert('❌ Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/admin/reject/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllDeposits();
    } catch {
      alert('❌ Rejection failed');
    }
  };

  // ✅ Filter Deposits
  const filteredDeposits = allDeposits
    .filter(d => d.status === activeTab)
    .filter(d =>
      d.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      d.user?.email?.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(filteredDeposits.length / depositsPerPage);
  const currentDeposits = filteredDeposits.slice(
    (currentPage - 1) * depositsPerPage,
    currentPage * depositsPerPage
  );

  // ✅ Export CSV
  const exportCSV = () => {
    const headers = ['Username', 'Email', 'Amount', 'Coin', 'TxID', 'Status', 'ReviewedBy'];
    const rows = filteredDeposits.map(d => [
      d.user?.username || '',
      d.user?.email || '',
      d.amount,
      d.coin.toUpperCase(),
      d.txId,
      d.status,
      d.reviewedBy || '',
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${activeTab}_deposits.csv`;
    link.click();
  };

  const tabVariants = {
    active: { scale: 1.1, backgroundColor: '#2563eb', color: '#fff' },
    inactive: { scale: 1, backgroundColor: '#1f2937', color: '#9ca3af' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white flex">

      {/* ✅ Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-700 p-6">
        <h2 className="text-2xl font-bold mb-8">⚡ Admin Panel</h2>

        <nav className="flex flex-col gap-4">
          <button
            onClick={() => setActiveSection('transactions')}
            className={`text-left px-4 py-2 rounded-lg transition ${
              activeSection === 'transactions' ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            💰 Manage Transactions
          </button>

          {/* ✅ Link to ManageVideo Page */}
          <Link
            to="/admin/videos"
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            🎬 Manage Videos
          </Link>

          <button
            onClick={() => navigate('/home')}
            className="mt-6 px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 transition"
          >
            ⬅ Back to Home
          </button>
        </nav>
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 px-6 py-10">
        {activeSection === 'transactions' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-6xl mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20"
          >
            {/* ✅ Transaction Management UI */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-extrabold">💰 Transaction Management</h2>
              <button onClick={exportCSV} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg shadow-md">
                <FaFileCsv /> Export CSV
              </button>
            </div>

            {/* ✅ Tabs */}
            <div className="flex gap-3 mb-6">
              {['pending', 'approved', 'rejected'].map(tab => (
                <motion.button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  animate={activeTab === tab ? 'active' : 'inactive'}
                  variants={tabVariants}
                  className="px-5 py-2 rounded-full font-semibold text-sm shadow-md"
                  whileHover={{ scale: 1.1 }}
                >
                  {tab.toUpperCase()}
                </motion.button>
              ))}
            </div>

            {/* ✅ Search */}
            <div className="flex items-center bg-white/10 px-4 py-2 rounded-lg mb-6 border border-white/20">
              <FaSearch className="mr-2 text-white/70" />
              <input
                type="text"
                className="bg-transparent w-full text-white placeholder-white/60 focus:outline-none"
                placeholder="Search by username or email..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* ✅ Table */}
            <div className="overflow-auto rounded-xl border border-white/10">
              <table className="min-w-full text-sm text-white">
                <thead className="bg-gray-800 text-xs uppercase">
                  <tr>
                    <th className="p-3 text-left">Username</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Amount</th>
                    <th className="p-3 text-left">Coin</th>
                    <th className="p-3 text-left">TxID</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Reviewed By</th>
                    {activeTab === 'pending' && <th className="p-3">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentDeposits.map((d, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-white/10 hover:bg-white/10"
                    >
                      <td className="p-3">{d.user?.username || 'N/A'}</td>
                      <td className="p-3">{d.user?.email || 'N/A'}</td>
                      <td className="p-3 font-bold text-green-300">${d.amount}</td>
                      <td className="p-3">{d.coin?.toUpperCase()}</td>
                      <td className="p-3 truncate">{d.txId}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          d.status === 'pending' ? 'bg-yellow-500/30 text-yellow-400' :
                          d.status === 'approved' ? 'bg-green-500/30 text-green-400' :
                          'bg-red-500/30 text-red-400'
                        }`}>{d.status.toUpperCase()}</span>
                      </td>
                      <td className="p-3">{d.reviewedBy || '—'}</td>
                      {activeTab === 'pending' && (
                        <td className="p-3 flex gap-2">
                          <button onClick={() => handleApprove(d._id)} className="bg-green-600 px-2 py-1 rounded">
                            <FaCheck />
                          </button>
                          <button onClick={() => handleReject(d._id)} className="bg-red-600 px-2 py-1 rounded">
                            <FaTimes />
                          </button>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination */}
            <div className="flex justify-center mt-8 space-x-2">
              {[...Array(totalPages)].map((_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg text-sm ${
                    currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
