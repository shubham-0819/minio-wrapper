import videoProcessService from "../services/video-process";

class VideoProcessController {
  static queueVideoProcess(req, res) {
    const { videoFileId, config } = req.body;
    const referenceId = videoProcessService.queueVideoProcess(videoFileId, config);
    res.json({ referenceId });
  }

  static getVideoStream(req, res) {
    const { referenceId } = req.params;
    try {
      const videoStream = videoProcessService.getVideoStream(referenceId);
      videoStream.pipe(res);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static getQueue(req, res) {
    const queue = videoProcessService.getQueue();
    res.json({ queue });
  }

  static getVideoStatus(req, res) {
    const { referenceId } = req.params;
    try {
      const status = videoProcessService.getVideoStatus(referenceId);
      res.json({ status });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static removeVideo(req, res) {
    const { referenceId } = req.params;
    try {
      videoProcessService.removeVideo(referenceId);
      res.json({ message: "Video removed successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default VideoProcessController;
