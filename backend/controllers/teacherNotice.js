const TeacherNotice = require('../models/TeacherNotice');

// Create notice
exports.createNotice = async (req, res) => {
    try {
        const notice = new TeacherNotice(req.body);
        await notice.save();
        res.status(201).json(notice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all notices
exports.getAllNotices = async (req, res) => {
    try {
        const notices = await TeacherNotice.find().populate('assignedTeachers');
        res.status(200).json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single notice
exports.getNotice = async (req, res) => {
    try {
        const notice = await TeacherNotice.findById(req.params.id).populate('assignedTeachers');
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }
        res.status(200).json(notice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update notice
exports.updateNotice = async (req, res) => {
    try {

        const id = req.params.id.replace('&id=', '');

        const notice = await TeacherNotice.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }
        res.status(200).json(notice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete notice
exports.deleteNotice = async (req, res) => {
    try {

        const id = req.params.id.replace('&id=', '');


        const notice = await TeacherNotice.findByIdAndDelete(id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }
        res.status(200).json({ message: 'Notice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
