// controllers/studentController.js

const Student = require("../models/Student");
const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Class = require('../models/Class');
const Branch = require('../models/Branch');
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");




const uploadStudent = require("../middleware/uploadStudent");
const Counter = require("../models/Counter.js"); // Assuming you save Counter model in the same folder
const { validateRequiredFields } = require("../utils/validateRequiredFields");

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
      monthlyFees,
      admissionFees,
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
      photoPath = req.file.path; // Save the file path
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
      monthlyFees,
      admissionFees,
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


// exports.registerStudent = async (req, res) => {
//   // Handle file upload (photo)
//   uploadStudent.single("photo")(req, res, async (err) => {
//     if (err) {
//       console.error("Image upload error:", err);
//       return res
//         .status(400)
//         .json({ message: "Image upload failed", error: err.message });
//     }

//     // Destructure and parse the request body
//     const {
//       password,
//       email,
//       fullName,
//       fatherName,
//       castSurname,
//       religion,
//       nationality,
//       dateOfBirth,
//       placeOfBirth,
//       gender,
//       permanentAddress,
//       emergencyContactPerson,
//       emergencyPhoneNumber,
//       studentOldAcademicInfo = "[]", // Default to empty array if not present
//       photocopiesCnic,
//       birthCertificate,
//       leavingCertificate,
//       schoolReport,
//       passportPhotos,
//       monthlyFees,
//       admissionFees,
//       branchId,
//       classId,
//       sectionId,
//       batchYear,
//     } = req.body;

//     // Validate required fields
//     const requiredFields = [
//       "password",
//       "email",
//       "fullName",
//       "fatherName",
//       "castSurname",
//       "religion",
//       "nationality",
//       "dateOfBirth",
//       "placeOfBirth",
//       "gender",
//       "permanentAddress",
//       "emergencyContactPerson",
//       "emergencyPhoneNumber",
//       "monthlyFees",
//       "branchId",
//       "classId",
//       "sectionId",
//       "batchYear",
//     ];

//     const missingFields = requiredFields.filter((field) => !req.body[field]);

//     if (missingFields.length > 0) {
//       return res
//         .status(400)
//         .json({
//           message: `Missing required fields: ${missingFields.join(", ")}`,
//         });
//     }

//     try {
//       // 1. Hash the password before saving
//       const saltRounds = 10;
//       const hashedPassword = await bcrypt.hash(password, saltRounds);

//       // 2. Create User with hashed password
//       const user = new User({
//         password: hashedPassword, // Use hashed password
//         email,
//         userRole: "student",
//       });

//       const savedUser = await user.save();

//       // Before generating roll number get roll number value from Counter collection

//       async function initializeRollNumberCounter() {
//         let rollNumber;
//         const existingCounter = await Counter.findOne({ key: `${batchYear}` });
//         if (!existingCounter) {
//           const counter = await new Counter({
//             key: `${batchYear}`,
//             value: 1,
//           }).save();
//           rollNumber = counter.value;
//           return rollNumber;
//         } else {
//           // Atomically increment the roll number
//           const counter = await Counter.findOneAndUpdate(
//             { key: `${batchYear}` },
//             { $inc: { value: 1 } },
//             { new: true, upsert: true } // upsert ensures the counter is created if it doesn't exist
//           );

//           // Use the incremented value as the new roll number
//           return (rollNumber = counter.value);
//         }
//       }

//       const rollNumberNumericPart = await initializeRollNumberCounter();

//       // 3. Generate Roll Number
//       // Fetch the current number of students in the specified batch year
//       // const studentsInBatch = await Student.countDocuments({ batchYear });
//       // const rollNumber = `${batchYear}/${studentsInBatch + 1}`;

//       const rollNumber = `${batchYear}/${rollNumberNumericPart}`;
//       console.log("Roll Number_>>>>>>>>>>>>>>>>>>>>>>:", rollNumber);

//       // 4. Handle Photo Upload
//       let photoFilename = null;
//       if (req.file) {
//         photoFilename = req.file.filename; // Assuming multer stores filename
//       }

//       // 5. Create Student Document
//       const student = new Student({
//         fullName,
//         fatherName,
//         castSurname,
//         religion,
//         nationality,
//         dateOfBirth,
//         placeOfBirth,
//         gender,
//         permanentAddress,
//         emergencyContactPerson,
//         emergencyPhoneNumber,
//         userId: savedUser._id, // Link to the User document
//         photocopiesCnic: photocopiesCnic === "true", // Convert to boolean
//         birthCertificate: birthCertificate === "true",
//         leavingCertificate: leavingCertificate === "true",
//         schoolReport: schoolReport === "true",
//         passportPhotos: passportPhotos === "true",
//         monthlyFees,
//         admissionFees: admissionFees || 0, // Optional field with default
//         branchId,
//         classId,
//         sectionId,
//         batchYear,
//         rollNumber,
//         photo: photoFilename, // Store photo filename if uploaded
//       });

//       const savedStudent = await student.save();

//       // 8. Respond with Success
//       res.status(201).json({
//         message: "Student created successfully",
//         student: savedStudent,
//         user: savedUser,
//       });
//     } catch (err) {
//       console.error("Server error:", err);
//       // Handle duplicate key errors (e.g., unique fields like email)
//       if (err.code === 11000) {
//         const duplicateField = Object.keys(err.keyValue)[0];
//         return res
//           .status(400)
//           .json({ message: `Duplicate value for field: ${duplicateField}` });
//       }
//       res.status(500).json({ message: "Server error", error: err.message });
//     }
//   });
// };

// Update Student
exports.updateStudent = async (req, res) => {
  uploadStudent.single("photo")(req, res, async (err) => {
    if (err) {
      console.error("Image upload error:", err);
      return res
        .status(400)
        .json({ message: "Image upload failed", error: err.message });
    }

    const { id } = req.params;
    const {
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
      studentOldAcademicInfo = "[]", // Default to empty array if not present
      photocopiesCnic,
      birthCertificate,
      leavingCertificate,
      schoolReport,
      passportPhotos,
      monthlyFees,
      admissionFees,
      branchId,
      classId,
      sectionId,
      batchYear,
    } = req.body;

    // Parse studentOldAcademicInfo if it is a string
    let academicInfoArray = [];
    try {
      academicInfoArray = JSON.parse(studentOldAcademicInfo);
    } catch (parseError) {
      console.error("Error parsing studentOldAcademicInfo:", parseError);
      return res
        .status(400)
        .json({ message: "Invalid format for studentOldAcademicInfo" });
    }

    try {
      // Find the student by ID
      const student = await Student.findById(id);

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      // Handle file upload if present
      if (req.file) {
        student.photo = req.file.filename; // Update the photo if a new file is uploaded
      }

      // Update Student fields
      student.fullName = fullName;
      student.fatherName = fatherName;
      student.castSurname = castSurname;
      student.religion = religion;
      student.nationality = nationality;
      student.dateOfBirth = dateOfBirth;
      student.placeOfBirth = placeOfBirth;
      student.gender = gender;
      student.permanentAddress = permanentAddress;
      student.emergencyContactPerson = emergencyContactPerson;
      student.emergencyPhoneNumber = emergencyPhoneNumber;
      student.photocopiesCnic = photocopiesCnic;
      student.birthCertificate = birthCertificate;
      student.leavingCertificate = leavingCertificate;
      student.schoolReport = schoolReport;
      student.passportPhotos = passportPhotos;
      student.monthlyFees = monthlyFees;
      student.admissionFees = admissionFees;
      student.branchId = branchId;
      student.classId = classId;
      student.sectionId = sectionId;
      student.batchYear = batchYear;

      const updatedStudent = await student.save();

      // Update Old Academic Info if provided and is an array
      if (academicInfoArray.length > 0) {
        // Remove existing academic info linked to the student
        await StudentOldAcademicInfo.deleteMany({ studentId: id });

        // Save new academic info entries
        const academicInfoPromises = academicInfoArray.map(async (info) => {
          const academicInfo = new StudentOldAcademicInfo({
            studentId: updatedStudent._id,
            instituteName: info.instituteName,
            location: info.location,
            from: info.from,
            to: info.to,
            upToClass: info.upToClass,
          });

          return await academicInfo.save();
        });

        const savedAcademicInfos = await Promise.all(academicInfoPromises);
        // Update student document with the IDs of the saved academic infos
        updatedStudent.studentOldAcademicInfoId = savedAcademicInfos.map(
          (info) => info._id
        );
        await updatedStudent.save();
      }

      res
        .status(200)
        .json({
          message: "Student updated successfully",
          student: updatedStudent,
        });
    } catch (err) {
      console.error("Error updating student:", err);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
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
      .populate("studentOldAcademicInfoId")
      .populate("branchId")
      .populate("classId")
      .populate("sectionId");

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
      .populate("studentOldAcademicInfoId")
      .populate("branchId")
      .populate("classId")
      .populate("sectionId");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the student by ID
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete the associated user
    await User.findByIdAndDelete(student.userId);

    // Delete associated old academic info
    await StudentOldAcademicInfo.deleteMany({ studentId: id });

    // Delete the student
    await Student.findByIdAndDelete(id);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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
exports.getStudentsByBatchYear = async (req, res) => {
  const { batchYear } = req.query;

  if (!batchYear) {
    return res.status(400).json({ message: "Batch Year is required" });
  }

  try {
    const students = await Student.find({ batchYear: batchYear });

    res.status(200).json(students);
  } catch (err) {
    console.error("Error fetching students by batch year:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getStudentsByClassAndSection = async (req, res) => {
  const { classId, sectionId } = req.params;
  try {
    const students = await Student.find({ classId, sectionId });
    sendSuccessResponse(res, 200, "Students fetched successfully", students);
  } catch (error) {
    console.error(error);
    sendErrorResponse(res, 500, "Server error", error);
  }
};
