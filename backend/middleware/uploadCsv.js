// middleware/uploadCsv.js
import multer from "multer";

const MAX_FILE_SIZE_MB = 5;
const storage = multer.memoryStorage();

function csvFileFilter(req, file, cb) {
  const okMime =
    file.mimetype === "text/csv" ||
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype === "application/octet-stream"; // some browsers send this for .csv
  const okExt = file.originalname.toLowerCase().endsWith(".csv");

  if (!okMime && !okExt) {
    const err = new Error("Only CSV files are allowed for roster uploads.");
    err.status = 400;
    return cb(err);
  }
  cb(null, true);
}

const uploadCsv = multer({
  storage,
  fileFilter: csvFileFilter,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
});

export default uploadCsv;