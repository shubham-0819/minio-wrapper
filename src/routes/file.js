import express from "express";
import fileController from "../controllers/fileController.js";

const router = express.Router();

// Route to get the list of buckets
router.get("/", fileController.getBucketList);

// Route to get the list of files in a bucket
router.get("/:bucketName", fileController.getFileList);
router.get("/:bucketName/files", fileController.getFileList);

// Route to get a specific file from a bucket
router.get("/:bucketName/files/:filePath", fileController.getFile);

// Route to create a new bucket
router.post("/", fileController.createBucket);

// Route to upload a file to a bucket
router.post("/:bucketName/files", fileController.uploadFile);

// Route to update a file in a bucket
router.put("/:bucketName/files/:fileName", fileController.updateFile);

// Route to delete a bucket
router.delete("/:bucketName", fileController.deleteBucket);

// Route to delete a file in a bucket
router.delete("/:bucketName/files/:fileName", fileController.deleteFile);

export default router;
