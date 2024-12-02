import * as Minio from "minio";

class FileStorageService {
  constructor(options) {
    this.minioClient = new Minio.Client(options);
  }

  async getBucketList() {
    return this.minioClient.listBuckets();
  }

  async createBucket(bucketName) {
    return this.minioClient.makeBucket(bucketName, "us-east-1");
  }

  async renameBucket(oldBucketName, newBucketName) {
    await this.createBucket(newBucketName);
    const objects = await this.getFileList(oldBucketName);
    for (const obj of objects) {
      await this.minioClient.copyObject(
        newBucketName,
        obj.name,
        `/${oldBucketName}/${obj.name}`
      );
      await this.minioClient.removeObject(oldBucketName, obj.name);
    }
    return this.minioClient.removeBucket(oldBucketName);
  }

  async removeBucket(bucketName) {
    return this.minioClient.removeBucket(bucketName);
  }

  async getFileList(bucketName, prefix = "") {
    const stream = this.minioClient.listObjectsV2(bucketName, prefix, true);
    const objects = [];
    return new Promise((resolve, reject) => {
      stream.on("data", (obj) => objects.push(obj));
      stream.on("end", () => resolve(objects));
      stream.on("error", (err) => reject(err));
    });
  }

  async getFile(bucketName,filePath) {
    const fileName = filePath.split("/").pop();
    console.log("Getting file", fileName, "from bucket", bucketName, "from path", filePath);  
    return this.minioClient.fGetObject(bucketName, fileName, `/${filePath}`);
    
  }

  async addFile(bucketName, filePath, fileStream) {
    return this.minioClient.putObject(bucketName, filePath, fileStream);
  }

  async moveFile(bucketName, oldFilePath, newFilePath) {
    await this.minioClient.copyObject(
      bucketName,
      newFilePath,
      `/${bucketName}/${oldFilePath}`
    );
    return this.minioClient.removeObject(bucketName, oldFilePath);
  }

  async deleteFile(bucketName, filePath) {
    return this.minioClient.removeObject(bucketName, filePath);
  }
}

export default FileStorageService;
