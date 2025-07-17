import React from 'react';
import backgroundImage from '../assets/home-bg.jpg'; // ✅ Make sure this path is correct

function About() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-fixed flex items-center justify-center px-4 py-12"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8 sm:p-12 w-[90%] max-w-5xl text-white text-center space-y-6 text-lg sm:text-xl leading-8 animate-slideFadeIn">
        <h1 className="text-4xl sm:text-5xl font-bold text-pink-400 mb-4">About RichMan</h1>

        <p>
          Welcome to <strong>RichMan</strong> – your gateway to elite online gaming, where thrill meets opportunity. Designed for visionaries, risk-takers, and champions, RichMan redefines what it means to play and win.
        </p>

        <p>
          Dive into a world of stunning visuals, seamless gameplay, and high-stakes excitement. From slots and blackjack to crash, dice, mines, and more – each game is engineered for fairness and adrenaline-pumping action.
        </p>

        <p>
          Built with blockchain technology, RichMan guarantees transparent outcomes, lightning-fast transactions, and complete player security. Whether you're playing casually or going all-in, our platform adjusts to your pace and passion.
        </p>

        <p>
          Loyalty is rewarded here. Unlock achievements, climb VIP levels, and earn bonuses that scale with your activity. Weekly tournaments, leaderboard prizes, and cashback systems ensure there's always something to play for.
        </p>

        <p>
          RichMan is more than a game – it's a community. Chat, connect, and compete with global players in real-time. Our sleek mobile-first interface means you can spin, win, and cash out from anywhere.
        </p>

        <p>
          Innovation drives us forward. Soon, you'll experience NFT integration, Web3 wallet support, exclusive avatar drops, and limited-edition seasonal games. We're not just building a casino; we're shaping the future of online entertainment.
        </p>

        <p>
          Join the revolution. Feel the energy. Taste the rewards. This is RichMan – where you don’t just play the game, you own it.
        </p>

        <p>
          Get started today. Sign up, claim your welcome bonus, and take your place among the elite.
        </p>
      </div>
    </div>
  );
}

export default About;
