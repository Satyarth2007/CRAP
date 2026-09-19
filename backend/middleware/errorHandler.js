// middleware/errorHandler.js
// Registered LAST in app.js, after every route — Express recognizes error
// middleware by its 4-argument signature (err, req, res, next).
//
//   app.use("/api/auth", authRoutes);
//   app.use("/api/student", studentRoutes);
//   app.use("/api/team", teamRoutes);
//   app.use(errorHandler);   // <-- must come after all routes

import multer from "multer";

const MULTER_MESSAGES = {
  LIMIT_FILE_SIZE: "File is too large.",
  LIMIT_FILE_COUNT: "Too many files uploaded.",
  LIMIT_UNEXPECTED_FILE: "Unexpected file field, or too many files for this field.",
};

export default function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: MULTER_MESSAGES[err.code] || "File upload error." });
  }

  // Thrown by middleware/upload.js's fileFilter for non-image uploads.
  if (err.message === "Only image files are allowed for result documents.") {
    return res.status(400).json({ message: err.message });
  }

  // Mongoose duplicate-key error (e.g. a unique index collision that
  // slipped past an application-level check).
  if (err.code === 11000) {
    return res.status(409).json({ message: "A record with these details already exists." });
  }

  console.error(err);
  const status = err.status || 500;
  return res.status(status).json({ message: err.message || "Something went wrong." });
}