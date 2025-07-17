import React, { useEffect, useState } from 'react';
import axios from 'axios';
import homeBg from '../assets/home-bg.jpg';
import { motion } from 'framer-motion';
import { FaSearch, FaFileCsv } from 'react-icons/fa';

function AdminPanel() {
  const [deposits, setDeposits] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const depositsPerPage = 5;

  // Fetch all deposits
  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/crypto-deposits', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDeposits(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDeposits();
  }, []);

  // Filter by search
  const filteredDeposits = deposits.filter(d =>
    d.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
    d.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  // Paginated results
  const totalPages = Math.ceil(filteredDeposits.length / depositsPerPage);
  const currentDeposits = filteredDeposits.slice(
    (currentPage - 1) * depositsPerPage,
    currentPage * depositsPerPage
  );

  // CSV Export
  const exportCSV = () => {
    const headers = ['Username', 'Email', 'Amount', 'Coin', 'TxID', 'Status', 'ReviewedBy'];
    const rows = deposits.map(d => [
      d.user?.username || '',
      d.user?.email || '',
      d.amount,
      d.coin,
      d.txId,
      d.status,
      d.reviewedBy || '',
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'crypto_deposits.csv';
    link.click();
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative p-6"
      style={{ backgroundImage: `url(${homeBg})` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative z-10 max-w-6xl mx-auto bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">Admin Panel</h2>

          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
            >
              <FaFileCsv /> Export CSV
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <FaSearch className="text-white" />
          <input
            type="text"
            placeholder="Search by username or email..."
            className="w-full px-4 py-2 rounded-md bg-white/20 text-white placeholder-white focus:outline-none"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white/20 text-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-black/50 text-sm uppercase">
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Coin</th>
                <th className="p-3 text-left">TxID</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Reviewed By</th>
              </tr>
            </thead>
            <tbody>
              {currentDeposits.map((d, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/30 hover:bg-white/10"
                >
                  <td className="p-3">{d.user?.username || 'N/A'}</td>
                  <td className="p-3">{d.user?.email || 'N/A'}</td>
                  <td className="p-3">${d.amount}</td>
                  <td className="p-3">{d.coin}</td>
                  <td className="p-3 truncate max-w-xs">{d.txId}</td>
                  <td className="p-3 capitalize">
                    {d.status === 'pending' && <span className="text-yellow-300 font-semibold">Pending</span>}
                    {d.status === 'approved' && <span className="text-green-400 font-semibold">Approved</span>}
                    {d.status === 'canceled' && <span className="text-red-400 font-semibold">Rejected</span>}
                  </td>
                  <td className="p-3">{d.reviewedBy || '—'}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-4 py-2 rounded-md text-white transition ${
                currentPage === i + 1 ? 'bg-blue-600' : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default AdminPanel;
