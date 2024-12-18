const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HolidaySchema = new Schema(
  {
    leaveTitle: {
      type: String,
      required: [true, "Leave title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
    },
    month: {
      type: Number,
      required: [true, "Month is required"],
      min: 1,
      max: 12,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Holiday", HolidaySchema);
