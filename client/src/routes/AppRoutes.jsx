import { Route, Routes, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Branches from "../pages/Branches";
import Subjects from "../pages/Subjects";
import Folders from "../pages/Folders";
import Content from "../pages/Content";
import Semesters from "../pages/Semesters";
import Courses from "../pages/Courses";
import CourseDetail from "../pages/CourseDetail";
import Hakathons from "../pages/Hakathons";
import JobRole from "../pages/JobRole";
import JobDetail from "../pages/JobDetail";
import Roadmap from "../pages/Roadmap";
import RoadmapDetail from "../pages/RoadmapDetail";
import Login from "../pages/Login";
import Signin from "../pages/Signin";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import ResumeBuilding from "../pages/ResumeBuilding";
import HackathonDetails from "../components/HackathonDetails";
import SubjectUnits from "../pages/SubjectUnits";
import TenthGradeTerms from "../pages/TenthGradeTerms";
import TenthGradeSubjects from "../pages/TenthGradeSubjects";
import IntermediateSubjects from "../pages/IntermediateSubjects";
import PostGraduateSubjects from "../pages/PostGraduateSubjects";
import IntermediateStreams from "../pages/IntermediateStreams";
import IntermediateStreamView from "../pages/IntermediateStreamView";
import PostGraduatePrograms from "../pages/PostGraduatePrograms";
import PostGraduateProgramView from "../pages/PostGraduateProgramView";
import AdminDashboard from "../pages/AdminDashboard";

// Admin imports
import AdminLogin from "../pages/Admin/AdminLogin";
import AdminLayout from "../pages/Admin/AdminLayout";
// Legacy AppRoutes is no longer used. Keeping file to avoid breaking imports.
// Admin routes are now declared directly in App.jsx.
import AdminUsers from "../pages/Admin/AdminUsersV2";
import AdminCourses from "../pages/Admin/AdminCourses";
import AdminJobs from "../pages/Admin/AdminJobs";
import AdminSettings from "../pages/Admin/AdminSettings";
import AdminBranches from "../pages/Admin/AdminBranches";
import AdminEducationLevels from "../pages/Admin/AdminEducationLevels";
import AdminSubjects from "../pages/Admin/AdminSubjects";
import AdminPrograms from "../pages/Admin/AdminPrograms";
import AdminFolders from "../pages/Admin/AdminFolders";
import AdminContent from "../pages/Admin/AdminContent";

export default function AppRoutes({ isAdminLoggedIn, setIsAdminLoggedIn }) {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/branches" element={<Branches />} />
      <Route path="/content" element={<Content />} />
      <Route path="/content/:branch" element={<Semesters />} />
      <Route path="/subjects/:branch" element={<Subjects />} />
      <Route path="/subjects/:branch/:semester/:subjectCode" element={<SubjectUnits />} />
      <Route path="/folders/:branch/:subject" element={<Folders />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/hackathons" element={<Hakathons />} />
      <Route path="/hackathon/:id" element={<HackathonDetails />} />
      <Route path="/jobs" element={<JobRole />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/roadmap" element={<Roadmap />} />
      <Route path="/roadmap/:id" element={<RoadmapDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/resume-builder" element={<ResumeBuilding />} />
      
      {/* 10th Grade Routes */}
      <Route path="/content/10th-grade" element={<TenthGradeTerms />} />
      <Route path="/10th-grade/:semester" element={<TenthGradeSubjects />} />
      
      {/* Intermediate Routes */}
      <Route path="/content/intermediate" element={<IntermediateStreams />} />
      <Route path="/content/intermediate/:stream" element={<IntermediateStreamView />} />
      <Route path="/intermediate/:stream/:semester" element={<IntermediateSubjects />} />
      
      {/* Post Graduate Routes */}
      <Route path="/content/postgraduate" element={<PostGraduatePrograms />} />
      <Route path="/content/postgraduate/:program" element={<PostGraduateProgramView />} />
      <Route path="/content/postgraduate/:program/:specialization" element={<PostGraduateProgramView />} />
      <Route path="/postgraduate/:program/:specialization/:semester" element={<PostGraduateSubjects />} />
      {/* This route is for programs without specializations like MBA */}
      <Route path="/postgraduate/:program//:semester" element={<PostGraduateSubjects />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} />} />
      <Route
        path="/admin/*"
        element={
          isAdminLoggedIn ? (
            <AdminLayout setIsAdminLoggedIn={setIsAdminLoggedIn}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="jobs" element={<AdminJobs />} />
                <Route path="hackathons" element={<div className="p-6 text-white">Hackathons Management (Coming Soon)</div>} />
                <Route path="roadmaps" element={<div className="p-6 text-white">Roadmaps Management (Coming Soon)</div>} />
                <Route path="content" element={<AdminContent />} />
                <Route path="branches" element={<AdminBranches />} />
                <Route path="education-levels" element={<AdminEducationLevels />} />
                <Route path="subjects" element={<AdminSubjects />} />
                <Route path="programs" element={<AdminPrograms />} />
                <Route path="folders" element={<AdminFolders />} />
                <Route path="resumes" element={<div className="p-6 text-white">Resumes Management (Coming Soon)</div>} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </AdminLayout>
          ) : (
            <Navigate to="/admin" replace />
          )
        }
      />
    </Routes>
  );
}
