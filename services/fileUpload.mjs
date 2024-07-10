import multer from 'multer';
import { join } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const storageConfig = multer.diskStorage({
  // destinations is uploads folder 
  // under the project directory
  destination: join(__dirname, '../files'),
  filename: (req, file, res) => {
    // file name is prepended with current time
    // in milliseconds to handle duplicate file names
    res(null, Date.now().toString().slice(0, -2) + '-' + file.originalname);
  },
});

// creating multer object for storing
// with configuration
export const upload = multer({
  // applying storage and file filter
  storage: storageConfig,
  limits: {
    // limits file size to 5 MB
    fileSize: 1024 * 1024 * 5,
  }
});
