import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Setup multer memory storage
const storage = multer.memoryStorage();

// Allowed MIME types
const allowedMimeTypes = [
  'image/jpeg', 
  'image/png', 
  'image/webp', 
  'application/pdf'
];

// Configure file filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`));
  }
};

// Size limit in bytes (Default 10MB)
const maxSize = process.env.MAX_FILE_SIZE ? parseInt(process.env.MAX_FILE_SIZE) : 10 * 1024 * 1024;

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter
});

/**
 * Handle Multer errors gracefully
 */
const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File is too large' });
    }
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

export const uploadSingle = (fieldName: string) => {
  return [upload.single(fieldName), handleMulterError];
};

export const uploadMultiple = (fieldName: string, maxCount: number = 5) => {
  return [upload.array(fieldName, maxCount), handleMulterError];
};
