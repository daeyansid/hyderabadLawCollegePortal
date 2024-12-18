// backend/routes/branchSettingsRoute.js

const express = require('express');
const router = express.Router();
const branchSettingsController = require('../controllers/branchSettingsController');
const authMiddleware = require('../middleware/authMiddleware'); 

// Apply authentication middleware
router.use(authMiddleware);

// GET /api/branch-settings/:branchId
router.get('/:branchId', branchSettingsController.getBranchSettingsByBranchId);

module.exports = router;
