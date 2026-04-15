// backend/middleware/upload.js

const multer = require('multer');
const path = require('path');

// Use memory storage so file buffers can be uploaded into MongoDB Atlas GridFS
const storage = multer.memoryStorage();

// Only allow image file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) return cb(null, true);

  cb(new Error('Only image files are allowed (jpg, png, gif, webp)'));
};

// Initialize multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5 MB per file
});

module.exports = upload;