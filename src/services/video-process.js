import { PassThrough } from "stream";

class VideoProcessService {
  constructor() {
    this.queue = new Map();
  }

  queueVideoProcess(videoFileId, config) {
    const referenceId = `ref-${Date.now()}`;
    this.queue.set(referenceId, { videoFileId, config, status: "queued" });
    // Simulate processing
    setTimeout(() => {
      this.queue.set(referenceId, {
        ...this.queue.get(referenceId),
        status: "processed",
      });
    }, 5000);
    return referenceId;
  }

  getVideoStream(referenceId) {
    const videoData = this.queue.get(referenceId);
    if (!videoData || videoData.status !== "processed") {
      throw new Error("Video not processed yet");
    }
    const videoStream = new PassThrough();
    videoStream.end("video stream data");
    return videoStream;
  }

  getQueue() {
    return Array.from(this.queue.entries());
  }

  getVideoStatus(referenceId) {
    const videoData = this.queue.get(referenceId);
    if (!videoData) {
      throw new Error("Video not found");
    }
    return videoData.status;
  }

  removeVideo(referenceId) {
    if (!this.queue.has(referenceId)) {
      throw new Error("Video not found");
    }
    this.queue.delete(referenceId);
  }
}

export default VideoProcessService;
