const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes.js");
const branchRoutes = require("./routes/branchRoutes.js");
const branchAdminRoutes = require("./routes/branchAdmin.js");
const branchTypeRoutes = require("./routes/branchTypeRoutes.js");

const classRoutes = require("./routes/classRoutes.js");
const subjectRoutes = require("./routes/subjectRoutes.js");

const teacherRoutes = require("./routes/teacherRoutes.js");
const studentRoute = require("./routes/studentRoutes.js");


const branchClassDaysRoutes = require("./routes/branchClassDaysRoutes.js");
const branchDailyTimeSlotsRoutes = require("./routes/branchDailyTimeSlotsRoutes.js");
const branchSettingsRoutes = require("./routes/branchSettingsRoute.js");


const classSlotAssignmentsRoutes = require("./routes/classSlotAssignmentsRoutes.js");
const classSlotAssignmentsSingleRoutes = require("./routes/classSlotAssignmentsSingleRoutes.js");
const classSlotAssignmentsStudentRoutes = require("./routes/classSlotAssignmentsStudentRoutes.js");
const classAttendanceRoutes = require("./routes/classAttendanceRoutes.js");
const classAttendanceSingleRoutes = require("./routes/classAttendanceSingleRoutes.js");

const diaryRoutes = require("./routes/diaryRoutes.js");
const studentDiaryRoutes = require("./routes/studentDiaryRoutes.js");
const studentSubjectRoutes = require("./routes/studentSubjectRoutes.js");
const studentAttendanceRoutes = require("./routes/studentAttendanceRoutes.js");
const studentAttendanceSingleRoutes = require("./routes/studentAttendanceSingleRoutes.js");

const studentDashboardRoutes = require("./routes/studentDashboardRoutes.js");
const branchAdminDashboardRoutes = require("./routes/branchAdminDashboardRoutes.js");

const feeMeta = require("./routes/feeMeta.js");
const feeDetails = require("./routes/feeDetails.js");


const path = require("path");

const app = express();
connectDB();

app.get("/ping", (req, res) => {
  res.send("pinged");
});
// Middlewares

const corsOptions = {
  // origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

if (process.env.NODE_ENV === "development") {
  corsOptions.origin = process.env.REACT_APP_API_URL;
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/branch-admin", branchAdminRoutes);
app.use("/api/branch-type", branchTypeRoutes);



app.use("/api/class", classRoutes);
app.use("/api/subject", subjectRoutes);


app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoute);



app.use("/api/branch-class-days", branchClassDaysRoutes);
app.use("/api/branch-daily-time-slots", branchDailyTimeSlotsRoutes);
app.use("/api/branch-settings", branchSettingsRoutes);


app.use("/api/class-slot-assignments", classSlotAssignmentsRoutes);
app.use("/api/class-slot-assignments-single", classSlotAssignmentsSingleRoutes);
app.use("/api/class-slot-assignments-student", classSlotAssignmentsStudentRoutes);


app.use("/api/class-attendance", classAttendanceRoutes);
app.use("/api/class-attendance-single", classAttendanceSingleRoutes);


app.use("/api/diary", diaryRoutes);
app.use("/api/student-diary", studentDiaryRoutes);
app.use("/api/student-subjects", studentSubjectRoutes);
app.use("/api/student-attendance", studentAttendanceRoutes);
app.use("/api/student-attendance-single", studentAttendanceSingleRoutes);
app.use("/api/student-dashboard", studentDashboardRoutes);
app.use("/api/branch-admin-dashboard", branchAdminDashboardRoutes);


app.use("/api/feeMeta", feeMeta);
app.use("/api/feeDetails", feeDetails);



/**
 * --------SERVE REACT--------
 */
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
