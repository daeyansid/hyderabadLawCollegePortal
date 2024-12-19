const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// router.post('/register-super-admin', authController.registerSuperAdmin);
router.post('/login', authController.login);

//Branch Admin
router.post('/register-branch-admin', authController.registerBranchAdmin);
router.get('/get-all-branch-admins', authMiddleware, authController.getAllBranchAdmins);
router.delete('/delete-branch-admin/:id', authMiddleware, authController.deleteBranchAdmin);
router.put('/update-branch-admin/:id', authMiddleware, authController.editBranchAdmin);
router.put('/get-user-by-id/:id', authMiddleware, authController.getBranchAdminById);

module.exports = router;