import React from 'react';
import { FaCrown } from 'react-icons/fa';

const Promotions = () => {
  const promos = [
    { title: "100% Welcome Bonus", desc: "Get double on your first deposit!", color: "from-pink-600 to-purple-600" },
    { title: "Cashback Fridays", desc: "10% cashback every Friday.", color: "from-green-600 to-emerald-500" },
    { title: "Free Spins Saturday", desc: "50 free spins on Slots.", color: "from-yellow-500 to-orange-500" },
  ];

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center gap-2 text-emerald-400">
        <FaCrown /> Latest Promotions & Bonuses
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {promos.map((promo, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-r ${promo.color} p-5 rounded-2xl hover:scale-105 transition duration-300`}
          >
            <h3 className="text-xl font-bold mb-1">{promo.title}</h3>
            <p className="text-sm">{promo.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promotions;
