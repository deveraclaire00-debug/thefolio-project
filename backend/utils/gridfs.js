const mongoose = require('mongoose');
const { GridFSBucket, ObjectId } = require('mongodb');

let bucket;

const getBucket = () => {
  if (bucket) return bucket;

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error('MongoDB connection not established yet');
  }

  bucket = new GridFSBucket(db, {
    bucketName: 'uploads',
  });

  return bucket;
};

const uploadToGridFS = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.buffer) {
      return reject(new Error('No file buffer available for GridFS upload'));
    }

    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    uploadStream.end(file.buffer);

    uploadStream.on('error', reject);
    uploadStream.on('finish', resolve);
  });
};

const getFileStream = (idOrName) => {
  const bucket = getBucket();

  if (ObjectId.isValid(idOrName)) {
    return bucket.openDownloadStream(new ObjectId(idOrName));
  }

  return bucket.openDownloadStreamByName(idOrName);
};

module.exports = {
  uploadToGridFS,
  getFileStream,
};
