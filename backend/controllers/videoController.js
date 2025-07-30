import Video from "../models/Video.js";

// 🎥 Admin: Add New Video
export const addVideo = async (req, res) => {
  try {
    const { title, url, duration } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: "Title and URL are required" });
    }

    const newVideo = new Video({ title, url, duration });
    await newVideo.save();

    res.status(201).json({ message: "Video added successfully", video: newVideo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🎥 Admin: Update Video
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, duration } = req.body;

    const updatedVideo = await Video.findByIdAndUpdate(
      id,
      { title, url, duration },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json({ message: "Video updated successfully", video: updatedVideo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🎥 Admin: Delete Video
export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Video.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🎥 User: Get All Videos
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
