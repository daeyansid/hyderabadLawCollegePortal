const FeeDetails = require('../models/FeeDetails');
const FeeStructureLink = require('../models/feeStructureLink');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response');

exports.createFeeDetails = async (req, res) => {
    // console.log(req.body);
    try {
        const {
            admissionConfirmationFee,
            totalAdmissionFee,
            semesterFeesTotal,
            studentId,
            classId,
            discount,
            semesterFeesPaid,
            lateFeeSurcharged,
            otherPenalties
        } = req.body;

        // Check if FeeStructureLink exists for the student
        let feeStructureLink = await FeeStructureLink.findOne({ studentId });
        
        // If no FeeStructureLink exists, create one
        if (!feeStructureLink) {
            feeStructureLink = new FeeStructureLink({
                studentId,
                totalAdmissionFee,
                semesterFeesTotal
            });
            await feeStructureLink.save();
        }

        // Create new FeeDetails using the IDs from FeeStructureLink
        const newFeeDetails = new FeeDetails({
            admissionConfirmationFee: admissionConfirmationFee,
            totalAdmissionFee: feeStructureLink.totalAdmissionFee,
            semesterFeesTotal: feeStructureLink.semesterFeesTotal,
            studentId,
            classId,
            discount: Number(discount),
            semesterFeesPaid: Number(semesterFeesPaid),
            lateFeeSurcharged: Number(lateFeeSurcharged),
            otherPenalties: Number(otherPenalties),
            challanPicture: req.file ? req.file.path : null
        });

        const savedFeeDetails = await newFeeDetails.save();
        
        // Populate the saved document with referenced data
        const populatedFeeDetails = await FeeDetails.findById(savedFeeDetails._id)
            .populate('totalAdmissionFee')
            .populate('semesterFeesTotal')
            .populate('studentId')
            .populate('classId');

        sendSuccessResponse(res, 201, 'Fee details created successfully', populatedFeeDetails);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

exports.getAllFeeDetails = async (req, res) => {
    try {
        const feeDetails = await FeeDetails.find({ IsDelete: false })
            .populate('totalAdmissionFee')
            .populate('semesterFeesTotal')
            .populate('studentId')
            .populate('classId')
            .sort({ createdAt: -1 });

        sendSuccessResponse(res, 200, 'Fee details retrieved successfully', feeDetails);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

exports.getFeeDetailsByStudentId = async (req, res) => {
    try {
        const feeDetails = await FeeDetails.find({ 
            studentId: req.params.studentId,
        })
            .populate('totalAdmissionFee')
            .populate('semesterFeesTotal')
            .populate('studentId')
            .populate('classId');
        if (!feeDetails.length) {
            return sendErrorResponse(res, 404, 'Fee details not found for this student');
        }
        sendSuccessResponse(res, 200, 'Fee details retrieved successfully', feeDetails);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

exports.getFeeDetailsLinkByStudentId = async (req, res) => {
    try {
        const feeDetails = await FeeStructureLink.findOne({ 
            studentId: req.params.studentId,
        })

        .populate('studentId')
        .populate('totalAdmissionFee')
        .populate('semesterFeesTotal')
        .lean();
        
        if (!feeDetails) {
            return sendErrorResponse(res, 404, 'Fee details Link not found for this student');
        }

        const formattedResponse = {
            studentId: feeDetails.studentId,
            totalAdmissionFee: feeDetails.totalAdmissionFee,
            semesterFeesTotal: feeDetails.semesterFeesTotal
        };

        sendSuccessResponse(res, 200, 'Fee details link retrieved successfully', formattedResponse);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

exports.updateFeeDetails = async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            updatedAt: Date.now()
        };

        if (req.file) {
            updateData.challanPicture = req.file.path;
        }

        // Convert string values to appropriate types
        if (updateData.discount) updateData.discount = Number(updateData.discount);
        if (updateData.semesterFeesPaid) updateData.semesterFeesPaid = Number(updateData.semesterFeesPaid);
        if (updateData.lateFeeSurcharged) updateData.lateFeeSurcharged = Number(updateData.lateFeeSurcharged);
        if (updateData.otherPenalties) updateData.otherPenalties = Number(updateData.otherPenalties);
        if (updateData.admissionConfirmationFee) updateData.admissionConfirmationFee = updateData.admissionConfirmationFee;

        const feeDetails = await FeeDetails.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )
        .populate('totalAdmissionFee')
        .populate('semesterFeesTotal')
        .populate('studentId')
        .populate('classId');

        if (!feeDetails) {
            return sendErrorResponse(res, 404, 'Fee details not found');
        }
        sendSuccessResponse(res, 200, 'Fee details updated successfully', feeDetails);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

exports.deleteFeeDetails = async (req, res) => {
    try {
        const feeDetails = await FeeDetails.findById(req.params.id);
        if (!feeDetails) {
            return sendErrorResponse(res, 404, 'Fee details not found');
        }

        const updatedFeeDetails = await FeeDetails.findByIdAndUpdate(
            req.params.id,
            { IsDelete: true },
            { new: true }
        );

        sendSuccessResponse(res, 200, 'Fee details deleted successfully', updatedFeeDetails);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get fee details by classId
exports.getFeeDetailsByClassId = async (req, res) => {
    try {
        const feeDetails = await FeeDetails.find({ 
            classId: req.params.classId,
            IsDelete: false 
        })
            .populate('totalAdmissionFee')
            .populate('semesterFeesTotal')
            .populate('studentId')
            .populate('classId');

        if (!feeDetails.length) {
            return sendErrorResponse(res, 404, 'No fee details found for this class');
        }
        sendSuccessResponse(res, 200, 'Fee details retrieved successfully', feeDetails);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Get fee detail by ID
exports.getFeeDetailById = async (req, res) => {
    try {
        const feeDetail = await FeeDetails.findOne({
            _id: req.params.id,
            IsDelete: false
        })
            .populate('totalAdmissionFee')
            .populate('semesterFeesTotal')
            .populate('studentId')
            .populate('classId');

        if (!feeDetail) {
            return sendErrorResponse(res, 404, 'Fee detail not found');
        }

        sendSuccessResponse(res, 200, 'Fee detail retrieved successfully', feeDetail);
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};

// Check if fee detail exists
exports.checkFeeDetailExists = async (req, res) => {
    try {
        const { studentId, classId } = req.query;
        
        const existingFeeDetail = await FeeDetails.findOne({
            studentId,
            classId,
            IsDelete: false
        });

        if (existingFeeDetail) {
            return sendSuccessResponse(res, 200, 'Fee detail already exists for this student in this semester', { exists: true, feeDetail: existingFeeDetail });
        }

        sendSuccessResponse(res, 200, 'No existing fee detail found', { exists: false });
    } catch (err) {
        console.error(err.message);
        sendErrorResponse(res, 500, 'Server error', err);
    }
};
