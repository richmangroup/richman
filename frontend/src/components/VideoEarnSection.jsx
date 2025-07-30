import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCoins } from "react-icons/fa";

const VideoEarnSection = () => {
  const [videos, setVideos] = useState([]);
  const [hasTask, setHasTask] = useState(false);
  const [balance, setBalance] = useState(0);
  const [taskPlans, setTaskPlans] = useState([]);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [videoLimit, setVideoLimit] = useState(0);
  const [rewardPopup, setRewardPopup] = useState({ show: false, amount: 0 });
  const token = localStorage.getItem("token");

  const fetchUserTaskStatus = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks/user-task-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasTask(res.data.hasTask);
      setBalance(res.data.balance);
      setCompletedVideos(res.data.completedVideos || []);
      setVideoLimit(res.data.activePlan?.videoLimit || 0);
    } catch (err) {
      console.error("❌ Error fetching task status:", err);
    }
  };

  useEffect(() => {
    fetchUserTaskStatus();
  }, [token]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/tasks/plans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTaskPlans(res.data);
      } catch (err) {
        console.error("❌ Error loading task plans", err);
      }
    };
    fetchPlans();
  }, [token]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/videos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setVideos(res.data);
      } catch (err) {
        console.error("❌ Error loading videos", err);
      }
    };
    fetchVideos();
  }, [token]);

  const handlePurchase = async (planId) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/tasks/purchase-task",
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasTask(true);
      setBalance(res.data.newBalance);
      fetchUserTaskStatus();
    } catch (err) {
      alert(err.response?.data?.message || "❌ Purchase failed");
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel your current plan?")) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/tasks/cancel-plan",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      setHasTask(false);
      setCompletedVideos([]);
    } catch (err) {
      alert(err.response?.data?.message || "❌ Failed to cancel plan");
    }
  };

  const handleEarn = async (videoId) => {
    if (completedVideos.includes(videoId)) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/videos/complete",
        { videoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCompletedVideos((prev) => [...prev, videoId]);
      setBalance(res.data.newBalance);
      // ✅ Show Animated Reward Popup
      setRewardPopup({ show: true, amount: 1.5 });
      setTimeout(() => setRewardPopup({ show: false, amount: 0 }), 2500);
    } catch (err) {
      alert(err.response?.data?.message || "❌ Error giving reward");
    }
  };

  const HybridPlayer = ({ v, isCompleted }) => {
    const [timer, setTimer] = useState(v.requiredTime || 10);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
      let interval;
      if (isPlaying && timer > 0) {
        interval = setInterval(() => setTimer((t) => t - 1), 1000);
      }
      if (timer === 0 && !isCompleted) {
        handleEarn(v._id);
        setIsPlaying(false);
      }
      return () => clearInterval(interval);
    }, [isPlaying, timer]);

    return (
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-2xl shadow-xl border border-gray-700 hover:scale-105 transition-all duration-300">
        <video id={`video-${v._id}`} src={v.url} width="100%" height="200px" className="rounded-lg" />
        {!isCompleted && (
          <p className="text-yellow-300 text-center mt-2 font-bold animate-pulse">⏳ Time Left: {timer}s</p>
        )}
        <button
          disabled={isCompleted || isPlaying}
          onClick={() => {
            if (completedVideos.length >= videoLimit) {
              alert("🚫 You have reached your plan's video limit!");
              return;
            }
            setIsPlaying(true);
            document.getElementById(`video-${v._id}`).play();
          }}
          className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold text-lg transition-all duration-300 ${
            isCompleted ? "bg-green-600 cursor-not-allowed" : "bg-[#62e7f8] hover:bg-[#4bd2e3] text-black"
          }`}
        >
          {isCompleted ? "✅ Completed" : "▶️ Watch & Earn"} <FaCoins />
        </button>
      </div>
    );
  };

  return (
    <section className="mt-10 px-6 py-8 bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl relative overflow-hidden">
      {/* ✅ Animated Reward Popup */}
      {rewardPopup.show && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-[#62e7f8] rounded-2xl shadow-2xl p-6 animate-bounce">
            <h2 className="text-3xl font-extrabold text-[#62e7f8] drop-shadow-lg">🎉 Reward Earned!</h2>
            <p className="text-white text-xl mt-2">+${rewardPopup.amount.toFixed(2)}</p>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-extrabold text-center mb-6 text-[#62e7f8] drop-shadow-lg">🎬 Watch & Earn 💰</h2>
      <h3 className="text-white text-center mb-4 text-lg">
        💰 Your Balance: <span className="text-green-400">${balance}</span>
      </h3>

      {!hasTask ? (
        <div className="bg-gray-800/60 p-6 rounded-xl text-center backdrop-blur-md shadow-lg">
          <h3 className="text-xl font-bold mb-3 text-white">❌ Purchase a plan to unlock videos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {taskPlans.map((plan) => (
              <div key={plan._id} className="bg-gray-700/70 backdrop-blur-md p-4 rounded-xl shadow-md hover:scale-105 transition-all">
                <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                <p className="text-gray-300">💵 Price: ${plan.price}</p>
                <p className="text-gray-300">🎥 Videos: {plan.videoLimit}</p>
                <button
                  onClick={() => handlePurchase(plan._id)}
                  className="mt-3 bg-[#62e7f8] hover:bg-[#4bd2e3] px-4 py-2 rounded-lg font-bold text-black w-full transition-all"
                >
                  💳 Purchase {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold shadow-lg"
            >
              ❌ Cancel Current Plan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => {
              const isCompleted = completedVideos.includes(v._id);
              return <HybridPlayer key={v._id} v={v} isCompleted={isCompleted} />;
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default VideoEarnSection;
