// main.jsx
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import RefrshHandler from './RefrshHandler';
import {
  ClassSection,
  Dashboard,
  UserManagementStaff,
  App,
  SuperAdminLayout,
  LoginForm,
  UserManagementGuardian,
  UserManagementStudent,
  EditStudent,
  ViewStudent,
  AddStudent,
  UserManagementTeacher,
  SuperAdminDashboard,
  SuperAdminBatch,
  SuperAdminUser,
  SuperAdminHoliday,
  TeacherDashboard,
  TeacherLeave,
  TeacherLayout,
  CombinedLeaveDataTable,
  BranchAdminLeaveDataTable,
  SuperAdminLeaveDataTable,
  BranchClassDaysList,
  BranchDailyTimeSlotsList,
  TeacherAssign,
  ClassSlotAssignmentsList,
  SelectSectionClass,
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
  StudentAttendanceSinglePage
} from './index';
import './index.css';

// PrivateRoute component to ensure routes are protected
const PrivateRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function MainApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Refresh handler to manage role-based redirects on authentication */}
        <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Branch Admin Routes */}
          <Route
            path="/branch-admin/*"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                element={<App />}
              />
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="class-section" element={<ClassSection />} />
            <Route path="user-management/teacher" element={<UserManagementTeacher />} />
            <Route path="user-management/staff" element={<UserManagementStaff />} />
            <Route path="user-management/guardian" element={<UserManagementGuardian />} />
            <Route path="user-management/student" element={<UserManagementStudent />} />
            <Route path="user-management/student-add" element={<AddStudent />} />
            <Route path="user-management/student-view/:id" element={<ViewStudent />} />
            <Route path="user-management/student-edit/:id" element={<EditStudent />} />
            <Route path="user-management/view-leave-request/" element={<CombinedLeaveDataTable />} />
            <Route path="user-management/apply-leave-request/" element={<BranchAdminLeaveDataTable />} />
            <Route path="scheduleAndAssign/teacherAssign" element={<TeacherAssign />} />
            <Route path="scheduleAndAssign/day" element={<BranchClassDaysList />} />
            <Route path="scheduleAndAssign/timeSlot/:branchClassDaysId" element={<BranchDailyTimeSlotsList />} />
            <Route path="scheduleAndAssign/SectionSelectionList/:branchClassDayIdParam" element={<SelectSectionClass />} />
            <Route path="scheduleAndAssign/ClassSlotAssignmentsList/:branchClassDaysIdParam/:sectionIdParam" element={<ClassSlotAssignmentsList />} />
          </Route>

          {/* Super Admin Routes */}
          <Route
            path="/super-admin/*"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                element={<SuperAdminLayout />}
              />
            }
          >
            <Route path="dashboard" element={<SuperAdminDashboard />} />
            <Route path="branch" element={<SuperAdminBatch />} />
            <Route path="user" element={<SuperAdminUser />} />
            <Route path="leave" element={<SuperAdminLeaveDataTable />} />
            <Route path="holiday" element={<SuperAdminHoliday />} />
          </Route>

          {/* Teacher Routes */}
          <Route
            path="/teacher/*"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                element={<TeacherLayout />}
              />
            }
          >
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="leave" element={<TeacherLeave />} />
            {/* <Route path="branch" element={<TeacherLeave />} /> */}
            {/* <Route path="user" element={<TeacherLeave />} /> */}
            {/* <Route path="holiday" element={<TeacherLeave />} /> */}
            <Route path="dairy" element={<DiaryDataTable />} />
            <Route path="assigned-classes" element={<TeacherAssignClassDays />} />
            <Route path="assigned-classes/slots/:branchDayId" element={<AssignedClassesSlotsPage />} />
            {/* for attendance for subject wise*/}
            <Route path="assigned-classes-attendance" element={<ViewDayAttendance />} />
            <Route path="assigned-classes-attendance/slots/:branchDayId" element={<ViewSlotsAttendance />} />
            <Route path="attendance/take/:branchDayId" element={<TakeViewAttendance />} />
            {/* for attendance for Single wise*/}
            <Route path="assigned-classes-attendance-single" element={<ViewDayAttendanceSingle />} />
            <Route path="assigned-classes-attendance-single/slots/:branchDayId" element={<ViewSlotsAttendanceSingle />} />
            <Route path="attendance-single/take/:branchDayId" element={<TakeViewAttendanceSingle />} />

          </Route>

          {/* Student Routes */}
          <Route
            path="/student/*"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                element={<StudentLayout />}
              />
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="assigned-classes" element={<StudentAssignClassDays />} />
            <Route path="assigned-classes/slots/:branchDayId" element={<AssignedClassesSlotsPageStudent />} />
            <Route path="dairy" element={<StudentDiaryPage />} />
            {/* for attendance for subject wise*/}
            <Route path="view-subjects" element={<StudentSubjectsPage />} />
            <Route path="view-attendance/:subjectId" element={<StudentAttendancePage />} />
            {/* for attendance for Single wise*/}
            <Route path="view-attendance-single" element={<StudentAttendanceSinglePage />} />
              
          </Route>

          {/* Guardian Routes */}
          <Route
            path="/guardian/*"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                element={<GuardianLayout />}
              />
            }
          >
            <Route path="dashboard" element={<GuardianDashboard />} />
            <Route path="diary" element={<GuardianStudentsPageDiary />} />
            <Route path="select-student-diary/:studentId" element={<GuardianStudentDiaryPage />} />
            {/* Student Attendance subject */}
            <Route path="attendance" element={<GuardianStudentsPageAttendance />} />
            <Route path="select-student-attendance/:studentId" element={<GuardianStudentAttendancePage />} />
            {/* Student Attendance single */}
            <Route path="attendance-single" element={<GuardianStudentsPageAttendanceSingle />} />
            <Route path="select-student-attendance-single/:studentId" element={<GuardianStudentAttendancePageSingle />} />
          </Route>

          {/* Fallback for unmatched routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>
);
