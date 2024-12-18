// middleware/uploadPdfTeacherLeave.js

const multer = require('multer');
const path = require('path');
const fs = require("fs")

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Set the destination folder for uploads
        const uploadPath = path.join(process.cwd(), '/public/docs');
        
        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // recursive: true ensures that nested directories are created
        }
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Use a timestamp to avoid filename conflicts
    }
});

// File filter for accepting only PDF files
const fileFilter = (req, file, cb) => {
    const fileTypes = /pdf/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'));
    }
};

// Multer configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
    fileFilter: fileFilter,
});

module.exports = upload;
