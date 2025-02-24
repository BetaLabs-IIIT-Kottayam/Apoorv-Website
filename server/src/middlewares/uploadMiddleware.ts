import multer from 'multer';
import { Request } from 'express';
import { BadRequestError } from '../errors';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function to validate uploaded files
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new BadRequestError('Please upload image files only'));
    }
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB file size limit
        files: 4 // Maximum 4 files per upload
    }
});

export default upload;