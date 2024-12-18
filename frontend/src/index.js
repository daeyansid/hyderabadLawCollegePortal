import Dashboard from "./users/branch-admin/Dashboard";
import ClassSection from "./users/branch-admin/ClassSection/ClassSection";
import UserManagementStaff from "./users/branch-admin/UserManagement/UserManagementStaff";
import UserManagementStudent from "./users/branch-admin/UserManagement/UserManagementStudent.jsx";
import UserManagementGuardian from "./users/branch-admin/UserManagement/UserManagementGuardian.jsx";
import UserManagementTeacher from "./users/branch-admin/UserManagement/UserManagementTeacher.jsx";
import AddStudent from "./users/branch-admin/UserManagement/Student/AddStudent.jsx";
import EditStudent from "./users/branch-admin/UserManagement/Student/EditStudent.jsx";
import ViewStudent from "./users/branch-admin/UserManagement/Student/ViewStudent.jsx";
import CombinedLeaveDataTable from "./users/branch-admin/CombinedLeaveDataTable.jsx";
import RejectedLeave from "./users/branch-admin/RejectedLeave";
import ApprovedLeave from "./users/branch-admin/ApprovedLeave";
import App from "./App";
import SuperAdminLayout from "./SuperAdminLayout.jsx";
import TeacherLayout from "./teacherLayout.jsx";
import SuperAdminDashboard from "./users/super-admin/SuperAdminDashboard.jsx";
import SuperAdminUser from "./users/super-admin/SuperAdminUser.jsx";
import SuperAdminBatch from "./users/super-admin/SuperAdminBranch.jsx";
import UpdateHolidayModal from "./users/super-admin/holiday/UpdateHolidayModal.jsx";
import ViewHolidayModal from "./users/super-admin/holiday/ViewHolidayModal.jsx";
import AddHolidayModal from "./users/super-admin/holiday/AddHolidayModal.jsx";
import SuperAdminHoliday from "./users/super-admin/SuperAdminHoliday.jsx";
import TeacherDashboard from "./users/teacher/TeacherDashboard.jsx";
import BranchAdminLeaveDataTable from "./users/branch-admin/BranchAdminLeaveDataTable.jsx";
import TeacherLeave from "./users/teacher/TeacherLeaveDataTable.jsx";
import LoginForm from "./loginForm";
import SuperAdminLeaveDataTable from "./users/super-admin/SuperAdminLeaveDataTable.jsx";
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
import TakeViewAttendanceSingle from "./users/teacher/attendanceSingle/TakeViewAttendanceSingle.jsx";
import DiaryDataTable from "./users/teacher/dairy/DiaryDataTable.jsx";
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

const adminName = localStorage.getItem("adminName");
const userRole = "Super Admin";
const adminEmail = localStorage.getItem("adminEmail");
const username = localStorage.getItem("username");
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
  username,
  branchTypeAdmin,
  Dashboard,
  ClassSection,
  UserManagementStaff,
  UserManagementGuardian,
  UserManagementStudent,
  UserManagementTeacher,
  App,
  LoginForm,
  ApprovedLeave,
  RejectedLeave,
  AddStudent,
  ViewStudent,
  EditStudent,
  SuperAdminLayout,
  SuperAdminDashboard,
  SuperAdminBatch,
  SuperAdminUser,
  SuperAdminHoliday,
  AddHolidayModal,
  ViewHolidayModal,
  UpdateHolidayModal,
  TeacherDashboard,
  TeacherLeave,
  TeacherLayout,
  baseURLDoc,
  CombinedLeaveDataTable,
  BranchAdminLeaveDataTable,
  SuperAdminLeaveDataTable,
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
};
