import Dashboard from "./users/branch-admin/Dashboard";
import ClassSection from "./users/branch-admin/ClassSection/ClassSection";
import UserManagementStudent from "./users/branch-admin/UserManagement/UserManagementStudent.jsx";
import UserManagementTeacher from "./users/branch-admin/UserManagement/UserManagementTeacher.jsx";
import AddStudent from "./users/branch-admin/UserManagement/Student/AddStudent.jsx";
import EditStudent from "./users/branch-admin/UserManagement/Student/EditStudent.jsx";
import ViewStudent from "./users/branch-admin/UserManagement/Student/ViewStudent.jsx";
import App from "./App";
import TeacherLayout from "./teacherLayout.jsx";
import TeacherDashboard from "./users/teacher/TeacherDashboard.jsx";
import LoginForm from "./loginForm";
import BranchClassDaysList from "./users/branch-admin/BranchClassDaysList.jsx";
import BranchDailyTimeSlotsList from "./users/branch-admin/timeSlots/BranchDailyTimeSlotsList.jsx";
import ClassSlotAssignmentsList from "./users/branch-admin/ClassSlotAssignmentsList.jsx";
import SelectSectionClass from "./users/branch-admin/scheduleAndAssign/SelectSectionClass.jsx";
import TeacherAssign from "./users/branch-admin/teacherAssign.jsx";
import TeacherAssignClassDays from "./users/teacher/TeacherAssignClassDays.jsx";
import AssignedClassesSlotsPage from "./users/teacher/scheduleAndAssign/AssignedClassesSlotsPage.jsx";
import ViewDayAttendance from "./users/teacher/attendance/ViewDayAttendance.jsx";
import ViewSlotsAttendance from "./users/teacher/attendance/ViewSlotsAttendance.jsx";
import TakeViewAttendance from "./users/teacher/attendance/TakeViewAttendance.jsx";
import ViewDayAttendanceSingle from "./users/teacher/attendanceSingle/ViewDayAttendanceSingle.jsx";
import ViewSlotsAttendanceSingle from "./users/teacher/attendanceSingle/ViewSlotsAttendanceSingle.jsx";


import SelectTeacher from "./users/branch-admin/attendanceSingle/SelectTeacher.jsx";
import TakeViewAttendanceSingleAdmin from "./users/branch-admin/attendanceSingle/TakeViewAttendanceSingle.jsx";
import ViewDayAttendanceSingleAdmin from "./users/branch-admin/attendanceSingle/ViewDayAttendanceSingle.jsx";
import ViewSlotsAttendanceSingleAdmin from "./users/branch-admin/attendanceSingle/ViewSlotsAttendanceSingle.jsx";


import TakeViewAttendanceSingle from "./users/teacher/attendanceSingle/TakeViewAttendanceSingle.jsx";
import DiaryDataTable from "./users/branch-admin/dairy/DiaryDataTable.jsx";
import StudentLayout from "./studentLayout.jsx";
import StudentDashboard from "./users/student/StudentDashboard.jsx";
import GuardianDashboard from "./users/guardian/GuardianDashboard.jsx";
import GuardianLayout from "./guardianLayout.jsx";
import StudentAssignClassDays from "./users/student/ClassSchedule/StudentAssignClassDays.jsx";
import AssignedClassesSlotsPageStudent from "./users/student/ClassSchedule/AssignedClassesSlotsPageStudent.jsx";
import StudentDiaryPage from "./users/student/Diary/StudentDiaryPage.jsx";
import StudentAttendancePage from "./users/student/attendance/StudentAttendancePage.jsx";
import StudentSubjectsPage from "./users/student/attendance/StudentSubjectsPage.jsx";
import StudentAttendanceSinglePage from "./users/student/attendanceSingle/StudentAttendanceSinglePage.jsx";
import GuardianStudentsPageDiary from "./users/guardian/GuardianStudentsPageDiary.jsx";
import GuardianStudentsPageAttendance from "./users/guardian/GuardianStudentsPageAttendance.jsx";
import GuardianStudentAttendancePage from "./users/guardian/attendance/GuardianStudentAttendancePage.jsx";
import GuardianStudentsPageAttendanceSingle from "./users/guardian/attendanceSingle/GuardianStudentsPageAttendanceSingle.jsx";
import GuardianStudentAttendancePageSingle from "./users/guardian/attendanceSingle/GuardianStudentAttendancePageSingle.jsx";
import GuardianStudentDiaryPage from "./users/guardian/Diary/GuardianStudentDiaryPage.jsx";
import SuperAdminBatch from "./users/branch-admin/SuperAdminBranch.jsx";
import SuperAdminUser from "./users/branch-admin/SuperAdminUser.jsx";
import FeeMeta from "./users/branch-admin/fee/feeMeta/FeeMeta.jsx";
import FeeDetail from "./users/branch-admin/fee/feeDetail/FeeDetail.jsx";
import TestManagement from "./users/branch-admin/testManagement/TestManagment.jsx";
import TestMarksSheet from "./users/branch-admin/testManagement/TestMarksSheet.jsx";
import TeacherNotice from "./users/branch-admin/teacherNotice/TeacherNotice.jsx";
import TeacherSideNotice from "./users/teacher/TeacherNotice.jsx";

import StudentFee from "./users/student/fee/StudentFee.jsx";
import StudentTest from "./users/student/test/StudentTest.jsx";


const adminName = localStorage.getItem("adminName");
const userRole = "Super Admin";
const adminEmail = localStorage.getItem("adminEmail");
const dairy = localStorage.getItem("dairy");
const machineAttendance = localStorage.getItem("machineAttendance");
const branchTypeAdmin = localStorage.getItem("branchTypeAdmin");
const baseURL = `${import.meta.env.VITE_BASE_URL}/images/`;
const baseURLDoc = `${import.meta.env.VITE_BASE_URL}/`;

export {
  baseURL,
  userRole,
  adminName,
  adminEmail,
  branchTypeAdmin,
  Dashboard,
  ClassSection,
  UserManagementStudent,
  UserManagementTeacher,
  App,
  LoginForm,
  AddStudent,
  ViewStudent,
  EditStudent,
  SuperAdminBatch,
  SuperAdminUser,
  TeacherDashboard,
  TeacherLayout,
  baseURLDoc,
  BranchClassDaysList,
  BranchDailyTimeSlotsList,
  TeacherAssign,
  ClassSlotAssignmentsList,
  SelectSectionClass,
  machineAttendance,
  dairy,
  TeacherAssignClassDays,
  AssignedClassesSlotsPage,
  ViewSlotsAttendance,
  ViewDayAttendance,
  TakeViewAttendance,
  ViewDayAttendanceSingle,
  ViewSlotsAttendanceSingle,
  TakeViewAttendanceSingle,
  DiaryDataTable,
  StudentLayout,
  StudentDashboard,
  GuardianDashboard,
  GuardianLayout,
  StudentAssignClassDays,
  AssignedClassesSlotsPageStudent,
  StudentDiaryPage,
  StudentAttendancePage,
  StudentSubjectsPage,
  GuardianStudentsPageDiary,
  GuardianStudentsPageAttendance,
  GuardianStudentAttendancePage,
  GuardianStudentsPageAttendanceSingle,
  GuardianStudentAttendancePageSingle,
  GuardianStudentDiaryPage,
  StudentAttendanceSinglePage,
  FeeMeta,
  FeeDetail,
  TestManagement,
  TestMarksSheet,
  TeacherNotice,
  TeacherSideNotice,
  StudentFee,
  StudentTest,
  TakeViewAttendanceSingleAdmin,
  ViewDayAttendanceSingleAdmin,
  ViewSlotsAttendanceSingleAdmin,
  SelectTeacher,
};
