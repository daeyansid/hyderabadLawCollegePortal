const express = require('express');
const router = express.Router();
const { promoteStudents } = require('../controllers/promoteController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware , promoteStudents);

module.exports = router;