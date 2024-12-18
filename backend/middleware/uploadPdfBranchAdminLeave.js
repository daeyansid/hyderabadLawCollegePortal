// middleware/uploadPdfBranchAdminLeave.js

const multer = require('multer');
const path = require('path');
const fs = require("fs")

// Set up storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const uploadPath = path.join(process.cwd(), '/public/docs');
        
        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // recursive: true ensures that nested directories are created
        }
        
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// File filter to accept only PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

// Set up multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
    fileFilter: fileFilter
});

module.exports = upload;
