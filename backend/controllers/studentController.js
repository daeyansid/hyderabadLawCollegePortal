// controllers/studentController.js

const Student = require("../models/Student");
const StudentOldAcademicInfo = require("../models/StudentOldAcademicInfo");
const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/response");
const { validateRequiredFields } = require("../utils/validateRequiredFields");
const uploadStudent = require("../middleware/uploadStudent");
const Counter = require("../models/Counter.js"); // Assuming you save Counter model in the same folder

// Create Student
exports.registerStudent = async (req, res) => {
  // Handle file upload (photo)
  uploadStudent.single("photo")(req, res, async (err) => {
    if (err) {
      console.error("Image upload error:", err);
      return res
        .status(400)
        .json({ message: "Image upload failed", error: err.message });
    }

    // Destructure and parse the request body
    const {
      username,
      password,
      email,
      fullName,
      admissionClass,
      castSurname,
      religion,
      nationality,
      dateOfBirth,
      placeOfBirth,
      gender,
      permanentAddress,
      emergencyContactPerson,
      emergencyPhoneNumber,
      guardianId,
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

    // Attempt to parse studentOldAcademicInfo
    let academicInfoArray = [];
    try {
      academicInfoArray = JSON.parse(studentOldAcademicInfo);
      if (!Array.isArray(academicInfoArray)) {
        throw new Error("studentOldAcademicInfo must be an array");
      }
    } catch (parseError) {
      console.error("Error parsing studentOldAcademicInfo:", parseError);
      return res
        .status(400)
        .json({ message: "Invalid format for studentOldAcademicInfo" });
    }

    // Validate required fields
    const requiredFields = [
      "username",
      "password",
      "email",
      "fullName",
      "admissionClass",
      "castSurname",
      "religion",
      "nationality",
      "dateOfBirth",
      "placeOfBirth",
      "gender",
      "permanentAddress",
      "emergencyContactPerson",
      "emergencyPhoneNumber",
      "guardianId",
      "monthlyFees",
      "branchId",
      "classId",
      "sectionId",
      "batchYear",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json({
          message: `Missing required fields: ${missingFields.join(", ")}`,
        });
    }

    try {
      // 1. Hash the password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // 2. Create User with hashed password
      const user = new User({
        username,
        password: hashedPassword, // Use hashed password
        email,
        userRole: "student",
      });

      const savedUser = await user.save();

      // Before generating roll number get roll number value from Counter collection

      async function initializeRollNumberCounter() {
        let rollNumber;
        const existingCounter = await Counter.findOne({ key: `${batchYear}` });
        if (!existingCounter) {
          const counter = await new Counter({
            key: `${batchYear}`,
            value: 1,
          }).save();
          rollNumber = counter.value;
          return rollNumber;
        } else {
          // Atomically increment the roll number
          const counter = await Counter.findOneAndUpdate(
            { key: `${batchYear}` },
            { $inc: { value: 1 } },
            { new: true, upsert: true } // upsert ensures the counter is created if it doesn't exist
          );

          // Use the incremented value as the new roll number
          return (rollNumber = counter.value);
        }
      }

      const rollNumberNumericPart = await initializeRollNumberCounter();
      // 3. Generate Roll Number
      // Fetch the current number of students in the specified batch year
      // const studentsInBatch = await Student.countDocuments({ batchYear });
      // const rollNumber = `${batchYear}/${studentsInBatch + 1}`;

      const rollNumber = `${batchYear}/${rollNumberNumericPart}`;
      console.log("Roll Number_>>>>>>>>>>>>>>>>>>>>>>:", rollNumber);

      // 4. Handle Photo Upload
      let photoFilename = null;
      if (req.file) {
        photoFilename = req.file.filename; // Assuming multer stores filename
      }

      // 5. Create Student Document
      const student = new Student({
        fullName,
        admissionClass,
        castSurname,
        religion,
        nationality,
        dateOfBirth,
        placeOfBirth,
        gender,
        permanentAddress,
        emergencyContactPerson,
        emergencyPhoneNumber,
        guardianId,
        userId: savedUser._id, // Link to the User document
        photocopiesCnic: photocopiesCnic === "true", // Convert to boolean
        birthCertificate: birthCertificate === "true",
        leavingCertificate: leavingCertificate === "true",
        schoolReport: schoolReport === "true",
        passportPhotos: passportPhotos === "true",
        monthlyFees,
        admissionFees: admissionFees || 0, // Optional field with default
        branchId,
        classId,
        sectionId,
        batchYear,
        rollNumber,
        photo: photoFilename, // Store photo filename if uploaded
      });

      const savedStudent = await student.save();

      // 6. Add Old Academic Information
      const academicInfoPromises = academicInfoArray.map(async (info) => {
        // Validate each academic info object
        const { instituteName, location, from, to, upToClass } = info;
        // if (!instituteName || !location || !from || !to || !upToClass) {
        //     throw new Error("Incomplete academic information provided");
        // }

        const academicInfo = new StudentOldAcademicInfo({
          studentId: savedStudent._id,
          instituteName,
          location,
          from,
          to,
          upToClass,
        });

        const savedAcademicInfo = await academicInfo.save();
        return savedAcademicInfo._id;
      });

      const academicInfoIds = await Promise.all(academicInfoPromises);

      // 7. Update the Student with Academic Info IDs
      savedStudent.studentOldAcademicInfoId = academicInfoIds;
      await savedStudent.save();

      // 8. Respond with Success
      res.status(201).json({
        message: "Student created successfully",
        student: savedStudent,
        user: savedUser,
      });
    } catch (err) {
      console.error("Server error:", err);
      // Handle duplicate key errors (e.g., unique fields like username or email)
      if (err.code === 11000) {
        const duplicateField = Object.keys(err.keyValue)[0];
        return res
          .status(400)
          .json({ message: `Duplicate value for field: ${duplicateField}` });
      }
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
};

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
      admissionClass,
      castSurname,
      religion,
      nationality,
      dateOfBirth,
      placeOfBirth,
      gender,
      permanentAddress,
      emergencyContactPerson,
      emergencyPhoneNumber,
      guardianId,
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
      student.admissionClass = admissionClass;
      student.castSurname = castSurname;
      student.religion = religion;
      student.nationality = nationality;
      student.dateOfBirth = dateOfBirth;
      student.placeOfBirth = placeOfBirth;
      student.gender = gender;
      student.permanentAddress = permanentAddress;
      student.emergencyContactPerson = emergencyContactPerson;
      student.emergencyPhoneNumber = emergencyPhoneNumber;
      student.guardianId = guardianId;
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
      .populate("guardianId")
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
      .populate("guardianId")
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
