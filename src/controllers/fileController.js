import dotenv from "dotenv";
import FileStorage from "../services/file-storage.js";
import paginateResponse from "../plugins/paginate.js";

dotenv.config();

const fileStorage = new FileStorage({
  endPoint: process.env.MINIO_ENDPOINT,
  port: parseInt(process.env.MINIO_PORT) ,
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
});

const fileController = {
  async getBucketList(req, res) {
    try {
      const buckets = await fileStorage.getBucketList();
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const paginatedBuckets = paginateResponse(buckets, page, limit);
      res.status(200).json(paginatedBuckets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getFileList(req, res) {
    try {
      const { bucketName } = req.params;
      const files = await fileStorage.getFileList(bucketName);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const paginatedFiles = paginateResponse(files, page, limit);
      res.status(200).json(paginatedFiles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getFile(req, res) {
    try {
      const { bucketName, filePath } = req.params;
      const file = await fileStorage.getFile(bucketName, filePath);
      res.status(200).send(file);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  },

  async createBucket(req, res) {
    try {
      const { bucketName } = req.body;
      await fileStorage.createBucket(bucketName);
      res.status(201).json({ message: "Bucket created successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async uploadFile(req, res) {
    try {
      const { bucketName, filePath } = req.body;
      const file = req.file;
      await fileStorage.uploadFile(bucketName, filePath, file);
      res.status(201).json({ message: "File uploaded successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateFile(req, res) {
    try {
      const { bucketName, filePath } = req.params;
      const file = req.file;
      await fileStorage.updateFile(bucketName, filePath, file);
      res.status(200).json({ message: "File updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteBucket(req, res) {
    try {
      const { bucketName } = req.params;
      await fileStorage.deleteBucket(bucketName);
      res.status(200).json({ message: "Bucket deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteFile(req, res) {
    try {
      const { bucketName, filePath } = req.params;
      await fileStorage.deleteFile(bucketName, filePath);
      res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default fileController;
