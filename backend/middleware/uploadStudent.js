const multer = require('multer');
const path = require('path');
const fs = require("fs")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), '/public/images/student');
        
        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // recursive: true ensures that nested directories are created
        }
        
        cb(null, uploadPath);
        
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only images are allowed (jpeg, jpg, png)'));
    }
};

const uploadStudent = multer({
    storage: storage,
    limits: { fileSize: 1 * 1024 * 1024 },
    fileFilter: fileFilter,
});

module.exports = uploadStudent;
