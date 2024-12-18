// middleware/uploadTeacher.js

const multer = require('multer');
const path = require('path');
const fs = require("fs")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(process.cwd(), '/public/images/teacher');
        
        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // recursive: true ensures that nested directories are created
        }
        
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadTeacher = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 }, 
    fileFilter: function (req, file, cb) {
        const fileTypes = /jpeg|jpg|png/;
        const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (mimeType && extName) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    }
});

module.exports = uploadTeacher;
