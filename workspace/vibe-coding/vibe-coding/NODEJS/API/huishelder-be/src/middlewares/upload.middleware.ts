import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

// Define upload folder
const UPLOADS_FOLDER = path.join(process.cwd(), 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOADS_FOLDER)) {
  fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_FOLDER);
  },
  filename: (req, file, cb) => {
    // Use timestamp to prevent filename conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  // Accept images and PDF files
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
    return cb(new Error('Only image files and PDFs are allowed!'));
  }
  cb(null, true);
};

// Configure the file upload middleware
export const uploadMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB in bytes
  },
  fileFilter: fileFilter,
});
