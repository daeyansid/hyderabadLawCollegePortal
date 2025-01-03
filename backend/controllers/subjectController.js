const Subject = require('../models/Subject');
const Class = require('../models/Class');
const Branch = require('../models/Branch');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');
const { validateRequiredFields } = require('../utils/validateRequiredFields');

// Create a new subject
exports.createSubject = async (req, res) => {
    const { classIdGet, subjectName } = req.body;

    try {
        // Validate required fields
        const missingFields = validateRequiredFields({ classIdGet, subjectName });
        if (missingFields.length > 0) {
            return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
        }

        // Validate existence of section
        const classId = await Class.findById(classIdGet);
        if (!classId) {
            return sendErrorResponse(res, 404, 'Class not found');
        }

        // Create a new Subject entry
        const subject = new Subject({ classId, subjectName });
        const savedSubject = await subject.save();

        sendSuccessResponse(res, 201, 'Subject created successfully', savedSubject);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
    const { branchId } = req.query;
    if (!branchId) {
        return sendErrorResponse(res, 400, 'Branch ID is required');
    }

    try {
        // Find all sections that match the branchId
        const classes = await Class.find({ branchId });
        if (classes.length === 0) {
            return sendErrorResponse(res, 404, 'No Class found for this branch');
        }

        const classIds = classes.map(section => section._id);

        // Find all subjects that are in the above sections
        const subjects = await Subject.find({ classId: { $in: classIds } }).populate('classId');

        sendSuccessResponse(res, 200, 'Subjects retrieved successfully', subjects);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get all subjects with class data
exports.getAllSubjectsNew = async (req, res) => {
    const { branchId } = req.query;

    // Validate if branchId is provided
    if (!branchId) {
        return sendErrorResponse(res, 400, 'Branch ID is required');
    }

    try {
        // Find all classes that belong to the provided branchId
        const classes = await Class.find({ branchId }).lean();

        // If no classes are found, return an error
        if (classes.length === 0) {
            return sendErrorResponse(res, 404, 'No classes found for this branch');
        }

        const classIds = classes.map(cls => cls._id);

        // Find all subjects related to the found classes
        const subjects = await Subject.find({ classId: { $in: classIds } })
            .populate({
                path: 'classId',
                select: 'className description createdAt updatedAt' // Select desired fields
            })
            .lean();

        // If no subjects are found, you may choose to return an empty array or an error
        if (subjects.length === 0) {
            return sendErrorResponse(res, 404, 'No subjects found for the classes in this branch');
        }

        // Structure the response with subjects and class data
        const data = subjects.map(subject => ({
            subject: {
                id: subject._id,
                name: subject.subjectName,
                createdAt: subject.createdAt,
                updatedAt: subject.updatedAt
            },
            class: {
                id: subject.classId._id,
                name: subject.classId.className,
                description: subject.classId.description,
                createdAt: subject.classId.createdAt,
                updatedAt: subject.classId.updatedAt
            }
        }));

        // Send the success response with the structured data
        sendSuccessResponse(res, 200, 'Subjects retrieved successfully', data);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get a subject by ID
exports.getSubjectById = async (req, res) => {
    const { id } = req.params;

    try {
        const subject = await Subject.findById(id).populate('classId');
        if (!subject) {
            return sendErrorResponse(res, 404, 'Subject not found');
        }
        sendSuccessResponse(res, 200, 'Subject retrieved successfully', subject);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Update a subject by ID
exports.updateSubject = async (req, res) => {
    const { id } = req.params;
    const { classId, subjectName } = req.body;

    try {
        // Validate required fields
        const missingFields = validateRequiredFields({ classId, subjectName });
        if (missingFields.length > 0) {
            return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
        }

        // Validate existence of classes
        const classes = await Class.findById(classId);
        if (!classes) {
            return sendErrorResponse(res, 404, 'Section not found');
        }

        // Update the Subject entry
        const updatedSubject = await Subject.findByIdAndUpdate(
            id,
            { classId, subjectName },
            { new: true, runValidators: true }
        ).populate('classId');

        if (!updatedSubject) {
            return sendErrorResponse(res, 404, 'Subject not found');
        }

        sendSuccessResponse(res, 200, 'Subject updated successfully', updatedSubject);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Delete a subject by ID
exports.deleteSubject = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedSubject = await Subject.findByIdAndDelete(id);
        if (!deletedSubject) {
            return sendErrorResponse(res, 404, 'Subject not found');
        }
        sendSuccessResponse(res, 200, 'Subject deleted successfully', deletedSubject);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

exports.fetchSubjectByClassAndBranch = async (req, res) => {
    const { classId, branchId } = req.query;

    try {
        // Validate presence of classId and branchId
        const missingFields = [];
        if (!classId) missingFields.push('classId');
        if (!branchId) missingFields.push('branchId');

        if (missingFields.length > 0) {
            return sendErrorResponse(
                res,
                400,
                `Missing query parameter(s): ${missingFields.join(', ')}`
            );
        }

        // Validate that classId and branchId are valid ObjectIds
        if (
            !mongoose.Types.ObjectId.isValid(classId) ||
            !mongoose.Types.ObjectId.isValid(branchId)
        ) {
            return sendErrorResponse(
                res,
                400,
                'Invalid classId or branchId format.'
            );
        }

        // Check if Class exists
        const cls = await Class.findById(classId);
        if (!cls) {
            return sendErrorResponse(res, 404, 'Class not found.');
        }

        // Check if Branch exists
        const branch = await Branch.findById(branchId);
        if (!branch) {
            return sendErrorResponse(res, 404, 'Branch not found.');
        }

        // Fetch Subjects based on classId and branchId
        const subjects = await Subject.find({
            classId: classId,
            branchId: branchId,
        })
            .populate({
                path: 'classId',
                select: 'className description branchId',
                populate: {
                    path: 'branchId',
                    select: 'name',
                },
            })
            .populate({
                path: 'branchId',
                select: 'name address',
            })
            .exec();

        if (subjects.length === 0) {
            return sendErrorResponse(
                res,
                404,
                'No subjects found for the provided class and branch.'
            );
        }

        return sendSuccessResponse(
            res,
            200,
            'Subjects retrieved successfully.',
            subjects
        );
    } catch (error) {
        console.error('Error fetching subjects:', error);
        return sendErrorResponse(res, 500, 'Server error.', error);
    }
};

exports.fetchSubjectByClass = async (req, res) => {

    const { classId } = req.query;
    try {
        if (!classId) {
            return sendErrorResponse(res, 400, 'Class ID is required');
        }

        const subjects = await Subject.find({ classId })
            .populate({
                path: 'classId',
                select: 'className description'
            });

        // console.log("subjects", subjects);

        if (!subjects || subjects.length === 0) {
            return sendErrorResponse(res, 404, 'No subjects found for this class');
        }

        sendSuccessResponse(res, 200, 'Subjects retrieved successfully', subjects);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};