import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { randomUUID } from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

// Define storage location and filename strategy
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Create a unique filename with original extension
    const uniqueFilename = `${randomUUID()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

// File filter to allow only image files (jpg, jpeg, png)
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, and PNG file formats are allowed'));
  }
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // limit file size to 5MB
  },
});

// Export middleware for single file upload with field name 'photo'
export const uploadPhotoMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  upload.single('photo')(req, res, (err: any) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    next();
  });
};

// Export middleware for multiple file uploads with field name 'photos'
export const uploadPhotosMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  upload.array('photos', 5)(req, res, (err: any) => {
    if (err) {
      res.status(400).json({ message: err.message });
      return;
    }
    next();
  });
};
