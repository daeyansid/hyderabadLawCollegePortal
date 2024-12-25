const express = require('express');
const router = express.Router();
const {
    createNotice,
    getAllNotices,
    getNotice,
    updateNotice,
    deleteNotice
} = require('../controllers/teacherNotice');

const authMiddleware = require('../middleware/authMiddleware');

// Create notice
router.post('/create', authMiddleware, createNotice);

// Get all notices
router.get('/get-all', authMiddleware, getAllNotices);

// Get single notice
router.get('/get-by-id:id', authMiddleware, getNotice);

// Update notice
router.put('/update:id', authMiddleware, updateNotice);

// Delete notice
router.delete('/delete:id', authMiddleware, deleteNotice);

module.exports = router;
