const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const guardianSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required."],
    },
    relationship: {
      type: String,
      required: [true, "Relationship is required."],
    },
    workOrganisation: {
      type: String,
      //required: [true, 'Work Organisation is required.']
      default: "-",
    },
    workStatus: {
      type: String,
      //required: [true, 'Work Status is required.']
      default: "-",
    },
    cnicNumber: {
      type: String,
      required: [true, "CNIC Number is required."],
    },
    studentMotherName: {
      type: String,
      required: [true, "Student Mother Name is required."],
    },
    motherCnicNumber: {
      type: String,
      required: [true, "Mother's CNIC Number is required."],
    },
    motherOccupation: {
      type: String,
      //required: [true, 'Mother\'s Occupation is required.']
      default: "-",
    },
    guardianPhoneNumber: {
      type: String,
      required: [true, "Guardian Phone Number is required."],
    },
    residentialAddress: {
      type: String,
      required: [true, "Residential Address is required."],
    },
    workAddress: {
      type: String,
      //required: [true, 'Work Address is required.']
      default: "-",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("guardian", guardianSchema);
