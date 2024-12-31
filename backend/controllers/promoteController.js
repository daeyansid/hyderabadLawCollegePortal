const Student = require('../models/Student');
const StudentTest = require('../models/StudentTest');
const FeeDetails = require('../models/FeeDetails');

exports.promoteStudents = async (req, res) => {
    const { fromClassId, toClassId, studentIds } = req.body;

    // To keep track of what has been updated
    let studentTestUpdated = false;
    let feeDetailsUpdated = false;
    let studentsUpdated = false;

    try {
        // 1. Update StudentTest records
        const studentTestUpdateResult = await StudentTest.updateMany(
            {
                studentId: { $in: studentIds },
                classId: fromClassId
            },
            { $set: { IsDelete: true } }
        );
        studentTestUpdated = true;

        // 2. Update FeeDetails records
        const feeDetailsUpdateResult = await FeeDetails.updateMany(
            {
                studentId: { $in: studentIds },
                classId: fromClassId
            },
            { $set: { IsDelete: true } }
        );
        feeDetailsUpdated = true;

        // 3. Update Student records
        const studentUpdateResult = await Student.updateMany(
            { _id: { $in: studentIds } },
            { $set: { classId: toClassId } }
        );
        studentsUpdated = true;

        res.status(200).json({
            success: true,
            message: 'Students promoted successfully',
            data: {
                promotedStudents: studentIds,
                fromClass: fromClassId,
                toClass: toClassId,
                updates: {
                    studentTestUpdated: studentTestUpdateResult.nModified,
                    feeDetailsUpdated: feeDetailsUpdateResult.nModified,
                    studentsUpdated: studentUpdateResult.nModified
                }
            }
        });

    } catch (error) {
        console.error('Error in promoting students:', error);

        // Compensating actions
        try {
            if (studentsUpdated) {
                await Student.updateMany(
                    { _id: { $in: studentIds } },
                    { $set: { classId: fromClassId } }
                );
            }
            if (feeDetailsUpdated) {
                await FeeDetails.updateMany(
                    {
                        studentId: { $in: studentIds },
                        classId: fromClassId
                    },
                    { $set: { IsDelete: false } }
                );
            }
            if (studentTestUpdated) {
                await StudentTest.updateMany(
                    {
                        studentId: { $in: studentIds },
                        classId: fromClassId
                    },
                    { $set: { IsDelete: false } }
                );
            }
        } catch (compensateError) {
            console.error('Error during compensating actions:', compensateError);
            // Decide how to handle compensation failures
        }

        res.status(500).json({
            success: false,
            message: 'Failed to promote students. Partial updates have been rolled back.',
            error: error.message
        });
    }
};