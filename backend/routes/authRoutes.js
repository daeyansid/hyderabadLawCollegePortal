const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register-super-admin', authController.registerSuperAdmin);
router.post('/login', authController.login);
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);
// router.post('/switch-session', authMiddleware, authController.switchSession);


//Branch Admin
router.post('/register-branch-admin', authController.registerBranchAdmin);
router.get('/get-all-branch-admins', authMiddleware, authController.getAllBranchAdmins);
router.delete('/delete-branch-admin/:id', authMiddleware, authController.deleteBranchAdmin);
router.put('/update-branch-admin/:id', authMiddleware, authController.editBranchAdmin);
router.put('/get-user-by-id/:id', authMiddleware, authController.getBranchAdminById);

module.exports = router;