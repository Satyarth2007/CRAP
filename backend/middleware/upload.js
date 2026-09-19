// middleware/upload.js
// In-memory storage — files go straight to ImageKit and never touch disk,
// so there's nothing to clean up on this server.

import multer from "multer";

const MAX_FILE_SIZE_MB = 5;

const storage = multer.memoryStorage();

function imageFileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    const err = new Error("Only image files are allowed for result documents.");
    err.status = 400;
    return cb(err);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
});

export default upload;