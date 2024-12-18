// backend/routes/branchDailyTimeSlotsRoutes.js

const express = require('express');
const router = express.Router();
const branchDailyTimeSlotsController = require('../controllers/branchDailyTimeSlotsController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes in this router
router.use(authMiddleware);

// Create a new Branch Daily Time Slot
router.post('/', branchDailyTimeSlotsController.createBranchDailyTimeSlot);

// Get all Branch Daily Time Slots
router.get('/', branchDailyTimeSlotsController.getAllBranchDailyTimeSlots);

// **New Route: Get Branch Daily Time Slots by BranchClassDaysId**
router.get('/by-branch-class-days/dayId/:branchClassDaysId', branchDailyTimeSlotsController.getBranchDailyTimeSlots);

// Get a single Branch Daily Time Slot by ID
router.get('/:id', branchDailyTimeSlotsController.getBranchDailyTimeSlotById);

// Update a Branch Daily Time Slot by ID
router.put('/:id', branchDailyTimeSlotsController.updateBranchDailyTimeSlot);

// Delete a Branch Daily Time Slot by ID
router.delete('/:id', branchDailyTimeSlotsController.deleteBranchDailyTimeSlot);

router.get('/by-day/:branchClassDaysId', branchDailyTimeSlotsController.getBranchDailyTimeSlotsByDay);

// Get Branch Daily Time Slots by BranchClassDaysId
router.get('/by-branch-class-days/:branchClassDaysId', authMiddleware, branchDailyTimeSlotsController.getBranchDailyTimeSlotsByBranchClassDaysId);

router.get('/by-branch-class-days-setting/:branchClassDaysId', authMiddleware, branchDailyTimeSlotsController.getBranchDailyTimeSlotsByBranchClassDaysIdForSettings);

module.exports = router;