// controllers/studentController.js

const mongoose = require("mongoose");
const Student = require("../models/Student");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const Class = require('../models/Class');
const Branch = require('../models/Branch');
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const fs = require('fs');
const path = require('path');

// Create Student
exports.createStudent = async (req, res) => {
  try {
    // Extract form data from request body
    const {
      password,
      email,
      fullName,
      fatherName,
      castSurname,
      religion,
      nationality,
      dateOfBirth,
      placeOfBirth,
      gender,
      permanentAddress,
      emergencyContactPerson,
      emergencyPhoneNumber,
      branchId,
      classId,
      batchYear,
      rollNumber,
      latMarks,
      cnic
    } = req.body;

    // **1. Validate Required Fields**
    const requiredFields = {
      password,
      email,
      fullName,
      fatherName,
      castSurname,
      religion,
      nationality,
      dateOfBirth,
      placeOfBirth,
      gender,
      permanentAddress,
      emergencyContactPerson,
      emergencyPhoneNumber,
      branchId,
      classId,
      batchYear,
      rollNumber,
      latMarks,
      cnic
    };

    const missingFields = Object.keys(requiredFields).filter(field => {
      return !requiredFields[field];
    });

    if (missingFields.length > 0) {
      return sendErrorResponse(res, 400, `Missing fields: ${missingFields.join(', ')}`);
    }

    // **2. Validate CNIC Format**
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicPattern.test(cnic)) {
      return sendErrorResponse(res, 400, 'Invalid CNIC format. Expected format: 00000-0000000-0');
    }

    // **3. Check if Email Already Exists**
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return sendErrorResponse(res, 409, 'Email is already registered.');
    }

    // **4. Validate Class and Branch Existence**
    const cls = await Class.findById(classId);
    if (!cls) {
      return sendErrorResponse(res, 404, 'Class not found.');
    }

    const branch = await Branch.findById(branchId);
    if (!branch) {
      return sendErrorResponse(res, 404, 'Branch not found.');
    }

    // **6. Validate Roll Number Uniqueness**
    const existingStudent = await Student.findOne({ rollNumber: rollNumber });
    if (existingStudent) {
      return sendErrorResponse(res, 409, 'Roll Number already exists.');
    }

    // **7. Handle Photo Upload**
    let photoPath = '';
    if (req.file) {
      // Save only the file name
      photoPath = path.basename(req.file.path);
    } else {
      photoPath = ''; // Or set a default image path if necessary
    }

    // **8. Hash the Password**
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // **9. Create User Document**
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      userRole: 'student', // Assuming 'student' role
      isActive: true
    });

    const savedUser = await newUser.save();

    // **10. Create Student Document**
    const newStudent = new Student({
      fullName,
      fatherName,
      castSurname,
      religion,
      nationality,
      dateOfBirth,
      placeOfBirth,
      gender,
      permanentAddress,
      emergencyContactPerson,
      emergencyPhoneNumber,
      branchId,
      classId,
      batchYear: parseInt(batchYear, 10),
      rollNumber,
      photo: photoPath,
      latMarks,
      cnic,
      userId: savedUser._id
    });

    const savedStudent = await newStudent.save();

    // **11. Respond with Success**
    return sendSuccessResponse(res, 201, 'Student created successfully.', savedStudent);

  } catch (error) {
    console.error('Error creating student:', error);

    // Handle specific Mongoose errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return sendErrorResponse(res, 400, `Validation Error: ${messages.join(', ')}`);
    }

    if (error.code === 11000) { // Duplicate key error
      const duplicateField = Object.keys(error.keyPattern)[0];
      return sendErrorResponse(res, 409, `${duplicateField} already exists.`);
    }

    // General server error
    return sendErrorResponse(res, 500, 'Server Error', error);
  }
};


// Get All Students
exports.getAllStudent = async (req, res) => {
  const { branchId } = req.query;

  if (!branchId) {
    return res.status(400).json({ message: "Branch ID is required" });
  }

  try {
    const students = await Student.find({ branchId })
      .populate("userId")
      .populate("branchId")
      .populate("classId")

    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Get Student by ID
exports.getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findById(id)
      .populate("userId")
      .populate("branchId")
      .populate("classId")

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    // Extract student ID from request parameters
    const { studentId } = req.params;

    if (!studentId) {
      return sendErrorResponse(res, 400, 'Student ID is required.');
    }

    // Find the existing student
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return sendErrorResponse(res, 404, 'Student not found.');
    }

    // Find the associated user
    const associatedUser = await User.findById(existingStudent.userId);
    if (!associatedUser) {
      return sendErrorResponse(res, 404, 'Associated user not found.');
    }

    // Extract fields from request body
    const {
      password, // Optional
      email,
      fullName,
      fatherName,
      castSurname,
      religion,
      nationality,
      dateOfBirth,
      placeOfBirth,
      gender,
      permanentAddress,
      emergencyContactPerson,
      emergencyPhoneNumber,
      branchId,
      classId,
      batchYear,
      rollNumber,
      latMarks,
      cnic
    } = req.body;

    // **1. Validate CNIC Format (if provided)**
    if (cnic) {
      const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
      if (!cnicPattern.test(cnic)) {
        return sendErrorResponse(res, 400, 'Invalid CNIC format. Expected format: 00000-0000000-0');
      }
    }

    // **2. Validate Email Format (if provided)**
    if (email) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        return sendErrorResponse(res, 400, 'Invalid email format.');
      }
    }

    // **3. Check if Email Already Exists (if email is being updated)**
    if (email && email.toLowerCase() !== associatedUser.email.toLowerCase()) {
      const emailUser = await User.findOne({ email: email.toLowerCase() });
      if (emailUser) {
        return sendErrorResponse(res, 409, 'Email is already registered.');
      }
    }

    // **4. Check if CNIC Already Exists (if CNIC is being updated)**
    if (cnic && cnic !== existingStudent.cnic) {
      const cnicStudent = await Student.findOne({ cnic });
      if (cnicStudent) {
        return sendErrorResponse(res, 409, 'CNIC is already registered.');
      }
    }

    // **5. Check if Roll Number Already Exists (if rollNumber is being updated)**
    if (rollNumber && rollNumber !== existingStudent.rollNumber) {
      const rollStudent = await Student.findOne({ rollNumber });
      if (rollStudent) {
        return sendErrorResponse(res, 409, 'Roll Number already exists.');
      }
    }

    // **6. Validate Class and Branch Existence (if being updated)**
    if (classId) {
      const cls = await Class.findById(classId);
      if (!cls) {
        return sendErrorResponse(res, 404, 'Class not found.');
      }
    }

    if (branchId) {
      console.log("branchId", branchId);
      const branch = await Branch.findById(branchId);
      if (!branch) {
        return sendErrorResponse(res, 404, 'Branch not found.');
      }
    }
    // return sendSuccessResponse(res, 405, 'Check point.');


    // **8. Prepare Update Data**
    const updateData = {
      fullName,
      fatherName,
      castSurname,
      religion,
      nationality,
      dateOfBirth,
      placeOfBirth,
      gender,
      permanentAddress,
      emergencyContactPerson,
      emergencyPhoneNumber,
      branchId,
      classId,
      batchYear: batchYear ? parseInt(batchYear, 10) : existingStudent.batchYear,
      rollNumber,
      latMarks,
      cnic
    };

    // Remove undefined fields to allow partial updates
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // **9. Handle Password Update (if provided)**
    let userUpdateData = {};
    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      userUpdateData.password = hashedPassword;
    }

    // **10. Update User Document (if email or password is being updated)**
    if (email || password) {
      if (email) {
        associatedUser.email = email.toLowerCase();
      }

      if (password) {
        associatedUser.password = userUpdateData.password;
      }

      await associatedUser.save();
    }

    // **11. Update Student Document**
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true }
    );

    // **12. Respond with Success**
    return sendSuccessResponse(res, 200, 'Student updated successfully.', updatedStudent);

  } catch (error) {
    console.error('Error updating student:', error);

    // Handle specific Mongoose errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return sendErrorResponse(res, 400, `Validation Error: ${messages.join(', ')}`);
    }

    if (error.code === 11000) { // Duplicate key error
      const duplicateField = Object.keys(error.keyPattern)[0];
      return sendErrorResponse(res, 409, `${duplicateField} already exists.`);
    }

    // General server error
    return sendErrorResponse(res, 500, 'Server Error', error);
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  console.log("deleteStudent In");

  try {
    // Extract student ID from request parameters
    const { studentId } = req.params;

    if (!studentId) {
      return sendErrorResponse(res, 400, 'Student ID is required.');
    }

    // Find the existing student
    const existingStudent = await Student.findById(studentId);
    if (!existingStudent) {
      return sendErrorResponse(res, 404, 'Student not found.');
    }

    // Find the associated user
    const associatedUser = await User.findById(existingStudent.userId);
    if (!associatedUser) {
      return sendErrorResponse(res, 404, 'Associated user not found.');
    }

    // **Optional:** Delete the student's photo from the server/storage
    if (existingStudent.photo) {
      const photoPath = path.resolve(existingStudent.photo);
      fs.unlink(photoPath, (err) => {
        if (err) {
          console.error('Error deleting photo:', err);
          // Optionally, you can decide whether to proceed or return an error
        } else {
          console.log('Photo deleted successfully.');
        }
      });
    }

    // **Delete the Student Document**
    await Student.findByIdAndDelete(studentId);

    // **Delete the Associated User Document**
    await User.findByIdAndDelete(existingStudent.userId);

    // **Respond with Success**
    return sendSuccessResponse(res, 200, 'Student deleted successfully.');

  } catch (error) {
    console.error('Error deleting student:', error);

    // Handle specific Mongoose errors
    if (error.name === 'CastError') {
      return sendErrorResponse(res, 400, 'Invalid Student ID format.');
    }

    // General server error
    return sendErrorResponse(res, 500, 'Server Error', error);
  }
};

// Fetch students by class ID and section ID
exports.getStudentsByClass = async (req, res) => {
  const { classId } = req.params;
  try {
    const students = await Student.find({ classId });
    sendSuccessResponse(res, 200, "Students fetched successfully", students);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Server error", error);
  }
};


// Fetch students by batch year
// exports.getStudentsByBatchYear = async (req, res) => {
//   const { batchYear } = req.query;

//   if (!batchYear) {
//     return res.status(400).json({ message: "Batch Year is required" });
//   }

//   try {
//     const students = await Student.find({ batchYear: batchYear });

//     res.status(200).json(students);
//   } catch (err) {
//     console.error("Error fetching students by batch year:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// };


// Fetch students by batch year and branchId
// exports.getStudentsByBatchYearAndBranch = async (req, res) => {
//     const { batchYear, branchId } = req.query;

//     if (!batchYear || !branchId) {
//         return res.status(400).json({ message: 'Batch Year and Branch ID are required' });
//     }

//     try {
//         const students = await Student.find({
//             batchYear: batchYear,
//             branchId: branchId
//         });

//         res.status(200).json(students);
//     } catch (err) {
//         console.error('Error fetching students by batch year and branch ID:', err);
//         res.status(500).json({ message: 'Server error', error: err.message });
//     }
// };

// Fetch students by batch year

