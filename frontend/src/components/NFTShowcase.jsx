import React from 'react';
import nft from '../assets/nft.png'; // local image used for all

const dummyNFTs = [
  { name: 'CryptoPunk #123' },
  { name: 'Bored Ape #456' },
  { name: 'Cool Cat #789' },
  { name: 'Mutant Ape #101' },
];

const NFTShowcase = () => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-purple-400">🪙 Your NFTs</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {dummyNFTs.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#1f1c2c]/60 border border-[#3a3a5e] rounded-xl p-4 flex flex-col items-center hover:scale-105 transition"
          >
            <img
              src={nft}
              alt={item.name}
              className="w-20 h-20 rounded-full object-cover mb-4 border border-white/20"
            />
            <p className="text-sm text-white text-center">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NFTShowcase;
