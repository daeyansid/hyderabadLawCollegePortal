// Fetch All Sections with Class Data
exports.getAllSections = async (req, res) => {
    try {
        const sections = await Section.find()
            .populate('classId', 'className')
            .exec();
        res.json(sections);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sections', error });
    }
};

// Fetch Section by ID with Class Data
exports.getSectionById = async (req, res) => {
    try {
        const section = await Section.findById(req.params.id)
            .populate('classId', 'className')
            .exec();
        if (!section) {
            return res.status(404).json({ message: 'Section not found' });
        }
        res.json(section);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching section', error });
    }
};
