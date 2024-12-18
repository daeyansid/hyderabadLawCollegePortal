// middleware/uploadPdf.js

const multer = require('multer');
const path = require('path');
const fs = require("fs")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
         // Save to assets/docs directory
        const uploadPath = path.join(process.cwd(), '/public/docs');
        
        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // recursive: true ensures that nested directories are created
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const uploadPdf = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
        const fileTypes = /pdf/; // Accept only PDF files
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (mimeType && extName) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false); // Error for non-PDF files
        }
    }
}).single('docUrl');

// Middleware to handle multer errors and pass them to the response
const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle Multer errors (like file size limit)
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File size should not exceed 5MB.' });
        }
    } else if (err) {
        // Handle other errors (like file type)
        return res.status(400).json({ message: err.message });
    }
    next();
};

module.exports = { uploadPdf, handleUploadErrors };
