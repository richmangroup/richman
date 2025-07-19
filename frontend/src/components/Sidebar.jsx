import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaHome, FaWallet, FaMoneyBillWave, FaTrophy, FaGift,
  FaFire, FaCrown, FaSignOutAlt
} from 'react-icons/fa';

function Sidebar({ sidebarOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const linkClass = (path) =>
    `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
    ${
      location.pathname === path
        ? 'bg-gradient-to-r from-[#ff00cc]/20 to-[#333399]/20 text-pink-300 border-l-4 border-pink-500 shadow-lg'
        : 'text-white/70 hover:text-white hover:bg-white/5 hover:pl-6'
    }`;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className={`fixed top-1/2 left-0 z-50 w-[270px] rounded-r-3xl bg-[#10101a]/70 border-r border-pink-500/20
        backdrop-blur-lg shadow-2xl transform
        ${sidebarOpen ? 'translate-x-0 -translate-y-1/2' : '-translate-x-full -translate-y-1/2'}
        md:static md:translate-x-0 md:top-0 md:h-full md:transform-none
        transition-transform duration-300 ease-in-out
        flex flex-col py-10 px-6 space-y-10`}>

        {/* Mobile Close */}
        <div className="flex justify-between items-center md:hidden">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button onClick={toggleSidebar} className="text-white text-2xl">×</button>
        </div>

        {/* Logo */}
        <h1 className="text-3xl font-extrabold text-center tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
          🎰 RichMan
        </h1>

        {/* Section: Menu */}
        <div className="space-y-2">
          <p className="text-xs text-pink-300 uppercase tracking-wider mb-1">Main</p>
          <Link to="/home" className={linkClass('/home')}><FaHome size={18} /><span>Home</span></Link>
          <Link to="/promo" className={linkClass('/promo')}><FaGift size={18} /><span>Free Bonus</span></Link>
          <Link to="/support" className={linkClass('/support')}><FaTrophy size={18} /><span>Live Support</span></Link>
        </div>

        {/* Section: Account */}
        <div className="space-y-2">
          <p className="text-xs text-pink-300 uppercase tracking-wider mb-1">Account</p>
          <Link to="/profile" className={linkClass('/profile')}><FaHome size={18} /><span>Profile</span></Link>
          <Link to="/vip" className={linkClass('/vip')}><FaCrown size={18} /><span>VIP Club</span></Link>
          <Link to="/deposit" className={linkClass('/deposit')}><FaWallet size={18} /><span>Deposit</span></Link>
          <Link to="/withdraw" className={linkClass('/withdraw')}><FaMoneyBillWave size={18} /><span>Withdraw</span></Link>
          <button
            onClick={handleLogout}
            className="group flex items-center gap-4 px-4 py-3 rounded-xl text-white/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
          >
            <FaSignOutAlt size={18} /><span>Logout</span>
          </button>
        </div>

        {/* Section: Info */}
        <div className="space-y-2 mt-auto">
          <p className="text-xs text-pink-300 uppercase tracking-wider mb-1">Info</p>
          <Link to="/about" className={linkClass('/about')}><FaTrophy size={18} /><span>About Us</span></Link>
          <Link to="/sponsors" className={linkClass('/sponsors')}><FaFire size={18} /><span>Sponsors</span></Link>
          <Link to="/license" className={linkClass('/license')}><FaHome size={18} /><span>License & Security</span></Link>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
