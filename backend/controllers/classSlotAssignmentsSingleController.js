// controllers/classSlotAssignmentsSingleController.js

const ClassSlotAssignments = require('../models/ClassSlotAssignments');

exports.getAssignmentsByTeacherAndDay = async (req, res) => {
    try {
        const { branchDayId } = req.params;
        const { teacherId } = req.query;

        if (!teacherId) {
            return res.status(400).json({ message: 'Teacher ID is required.' });
        }

        const assignments = await ClassSlotAssignments.find({
            branchClassDaysId: branchDayId,
            teacherId: teacherId,
        })
            .populate('branchClassDaysId')
            .populate('branchDailyTimeSlotsId')
            .populate('classId')
            .populate('sectionId')
            .populate('subjectId')
            .populate('teacherId');

        res.status(200).json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};
