import multer from 'multer';
const storage = multer.memoryStorage(); // using memory for streaming to Cloudinary
export const upload = multer({ storage });
