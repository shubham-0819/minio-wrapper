import express from "express";
import VideoProcessService from "../services/video-process.js";

const router = express.Router();
const videoProcessService = new VideoProcessService();

// Route to trigger video processing
router.post("/process", (req, res) => {
  const { videoFileId, config } = req.body;
  const referenceId = videoProcessService.queueVideoProcess(videoFileId, config);
  res.json({ referenceId });
});

// Route to get the video stream in real-time
router.get("/stream/:referenceId", (req, res) => {
  const { referenceId } = req.params;
  try {
    const videoStream = videoProcessService.getVideoStream(referenceId);
    videoStream.pipe(res);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get the list of videos in the queue
router.get("/queue", (req, res) => {
  const queue = videoProcessService.getQueue();
  res.json({ queue });
});

// Route to get the status of a video by reference ID
router.get("/status/:referenceId", (req, res) => {
  const { referenceId } = req.params;
  try {
    const status = videoProcessService.getVideoStatus(referenceId);
    res.json({ status });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to remove a video from the queue
router.delete("/remove/:referenceId", (req, res) => {
  const { referenceId } = req.params;
  try {
    videoProcessService.removeVideo(referenceId);
    res.json({ message: "Video removed successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
