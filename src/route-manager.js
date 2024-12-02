import express from "express";
import filesRouter from "./routes/file.js";
import videoProcessRouter from "./routes/video-process.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "File Storage Service working fine !!" });
});

router.use("/bucket", filesRouter);
router.use("/video", videoProcessRouter);

// Export the router
export default router;
