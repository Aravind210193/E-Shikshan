import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import ResumeBuilding from './pages/ResumeBuilding'
import Home from './pages/Home'
import Content from './pages/Content'
import Courses from './pages/Courses'
import Hakathons from './pages/Hakathons'
import Roadmap from './pages/Roadmap'
import JobRole from './pages/JobRole'
import Footer from './components/Footer'
import Login from './pages/Login'
import Signin from './pages/Signin'
import AuthSuccess from './pages/AuthSuccess'
import ResumeStepper from './components/ResumeStepper'
import Subjects from './pages/Subjects'
import Semesters from './pages/Semesters'
import SubjectUnits from './pages/SubjectUnits'
import SubjectDetail from './pages/SubjectDetail'
import UnitContent from './pages/UnitContent'
import Folders from './pages/Folders'
import JobDetail from './pages/JobDetail'
import HackathonDetails from './components/HackathonDetails'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import RoadmapDetail from './pages/RoadmapDetail'
import CourseDetail from './pages/CourseDetail'
import TenthGradeTerms from './pages/TenthGradeTerms'
import TenthGradeSubjects from './pages/TenthGradeSubjects'
import IntermediateStreams from './pages/IntermediateStreams'
import IntermediateStreamView from './pages/IntermediateStreamView'
import IntermediateSubjects from './pages/IntermediateSubjects'
import PostGraduatePrograms from './pages/PostGraduatePrograms'
import PostGraduateProgramView from './pages/PostGraduateProgramView'
import PostGraduateSubjects from './pages/PostGraduateSubjects'
import ProtectedRoute from './components/ProtectedRoute'
import Chatbot from './components/Chatbot'

// Admin imports
import AdminLogin from './pages/Admin/AdminLogin'
import AdminLayout from './pages/Admin/AdminLayout'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminUsers from './pages/Admin/AdminUsersV2'
import AdminCourses from './pages/Admin/AdminCourses'
import AdminJobs from './pages/Admin/AdminJobs'
import AdminSettings from './pages/Admin/AdminSettings'
import AdminHackathons from './pages/Admin/AdminHackathons'
import AdminRoadmaps from './pages/Admin/AdminRoadmaps'
import AdminContent from './pages/Admin/AdminContent'
import AdminResumes from './pages/Admin/AdminResumes'
import AdminStudents from './pages/Admin/AdminStudents'
import AdminDoubts from './pages/Admin/AdminDoubts'
import AdminSubmissions from './pages/Admin/AdminSubmissions'
import InstructorStudents from './pages/Admin/InstructorStudents'
import StudentDashboard from './pages/StudentDashboard'
import StudentDoubts from './pages/StudentDoubts'
import StudentSidebar from './components/StudentSidebar'

const App = () => {
  const location = useLocation();
  const [showNav, setShownNav] = useState(true);
  // Initialize state based on localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return !!sessionStorage.getItem('adminToken');
  });

  // Sync state with localStorage on mount and location change
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const hideLayout = ["/login", "/signup"].includes(location.pathname) ||
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/instructor') ||
    location.pathname.startsWith('/dashboard');
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1c2c',
            color: '#fff',
            border: '1px solid #2d2f45',
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            fontSize: '14px',
            maxWidth: '400px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
            style: {
              background: '#1a1c2c',
              border: '1px solid #10b981',
              color: '#d1fae5',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              background: '#1a1c2c',
              border: '1px solid #ef4444',
              color: '#fee2e2',
            },
          },
          loading: {
            style: {
              background: '#1a1c2c',
              border: '1px solid #6366f1',
              color: '#fff',
            },
          }
        }}
        containerStyle={{
          top: 40,
        }}
      />
      {!hideLayout && showNav && <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      <Routes >
        <Route path='/' element={<Home />} />
        <Route path='/content' element={<Content />} />
        <Route path='/content/10th' element={<TenthGradeTerms />} />
        <Route path='/content/intermediate' element={<IntermediateStreams />} />
        <Route path='/content/intermediate/:stream' element={<IntermediateStreamView />} />
        <Route path='/content/postgraduate' element={<PostGraduatePrograms />} />
        <Route path='/content/postgraduate/:program' element={<PostGraduateProgramView />} />
        <Route path='/content/:branch' element={<Semesters />} />
        <Route path='/subjects/:branch/:semester/:subjectCode' element={<SubjectDetail />} />
        <Route path='/content/:branch/:semester/:subjectCode/unit/:unitIndex' element={<UnitContent />} />
        <Route path='/subjects/:branchId' element={<Subjects />} />
        <Route path='/folders/:branchId/:subjectId' element={<Folders />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/courses/:id' element={<CourseDetail />} />
        <Route path='/hackathons' element={<Hakathons />} />
        <Route path='/hackathon/:id' element={<HackathonDetails />} />
        <Route path='/roadmap' element={<Roadmap />} />
        <Route path='/roadmap/:id' element={<RoadmapDetail />} />
        <Route path='/resume' element={<ResumeBuilding />} />
        <Route path='/resume-builder' element={<ResumeBuilding />} />
        <Route path='/resumestepper' element={<ResumeStepper />} />
        <Route path='/jobs' element={<JobRole />} />
        <Route path='/jobs/:id' element={<JobDetail />} />
        <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/signin' element={<Signin setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/signup' element={<Signin setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/auth/success' element={<AuthSuccess setIsLoggedIn={setIsLoggedIn} />} />
        <Route path='/profile' element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Student Portal Routes */}
        <Route path='/dashboard/*' element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <div className="flex bg-[#0f111a] min-h-screen">
              <aside className="hidden lg:block">
                <StudentSidebar />
              </aside>
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<StudentDashboard />} />
                  <Route path="doubts" element={<StudentDoubts />} />
                  {/* Add more student tracks here */}
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        } />

        <Route path='/settings' element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Settings />
          </ProtectedRoute>
        } />

        {/* 10th Grade Routes */}
        <Route path='/10th-grade' element={<TenthGradeTerms />} />
        <Route path='/10th-grade/:semester' element={<TenthGradeSubjects />} />

        {/* Intermediate Routes */}
        <Route path='/intermediate' element={<IntermediateStreams />} />
        <Route path='/intermediate/:stream/:semester' element={<IntermediateSubjects />} />

        {/* Post Graduate Routes */}
        <Route path='/postgraduate' element={<PostGraduatePrograms />} />
        <Route path='/postgraduate/:program/:specialization/:semester' element={<PostGraduateSubjects />} />
        <Route path='/postgraduate/:program//:semester' element={<PostGraduateSubjects />} />

        {/* Admin Routes */}
        <Route path='/admin' element={<AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} />} />
        <Route
          path='/admin/*'
          element={
            isAdminLoggedIn && sessionStorage.getItem('adminRole') === 'admin' ? (
              <AdminLayout setIsAdminLoggedIn={setIsAdminLoggedIn}>
                <Routes>
                  <Route path='dashboard' element={<AdminDashboard />} />
                  <Route path='users' element={<AdminUsers />} />
                  <Route path='students' element={<AdminStudents />} />
                  <Route path='courses' element={<AdminCourses />} />
                  <Route path='doubts' element={<AdminDoubts />} />
                  <Route path='submissions' element={<AdminSubmissions />} />
                  <Route path='jobs' element={<AdminJobs />} />
                  <Route path='hackathons' element={<AdminHackathons />} />
                  <Route path='roadmaps' element={<AdminRoadmaps />} />
                  <Route path='content' element={<AdminContent />} />
                  <Route path='resumes' element={<AdminResumes />} />
                  <Route path='settings' element={<AdminSettings />} />
                  <Route path='*' element={<Navigate to='/admin/dashboard' replace />} />
                </Routes>
              </AdminLayout>
            ) : (
              <Navigate to='/admin' replace />
            )
          }
        />

        {/* Instructor Routes */}
        <Route
          path='/instructor/*'
          element={
            isAdminLoggedIn && sessionStorage.getItem('adminRole') === 'course_manager' ? (
              <AdminLayout setIsAdminLoggedIn={setIsAdminLoggedIn}>
                <Routes>
                  <Route path='dashboard' element={<AdminDashboard />} />
                  <Route path='courses' element={<AdminCourses />} />
                  <Route path='students' element={<InstructorStudents />} />
                  <Route path='doubts' element={<AdminDoubts />} />
                  <Route path='submissions' element={<AdminSubmissions />} />
                  <Route path='settings' element={<AdminSettings />} />
                  <Route path='*' element={<Navigate to='/instructor/dashboard' replace />} />
                </Routes>
              </AdminLayout>
            ) : (
              <Navigate to='/admin' replace />
            )
          }
        />
        {/* Fallback for unknown routes */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      {!hideLayout && showNav && <Footer />}
      <Chatbot />
    </>
  )
}

export default App

