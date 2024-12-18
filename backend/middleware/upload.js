// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require("fs")
// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), '/public/images/branchAdmin');
        
        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // recursive: true ensures that nested directories are created
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Use a timestamp to make each filename unique
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: function (req, file, cb) {
        // Accept only images
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (mimeType && extName) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    }
});

module.exports = upload;
