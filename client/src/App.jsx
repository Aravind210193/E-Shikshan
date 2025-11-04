import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import {Navigate, Route, Routes, useLocation} from 'react-router-dom'
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
import ResumeStepper from './components/ResumeStepper'
import Subjects from './pages/Subjects'
import Semesters from './pages/Semesters'
import SubjectUnits from './pages/SubjectUnits'
import UnitContent from './pages/UnitContent'
import Folders from './pages/Folders'
import JobDetail from './pages/JobDetail'
import HackathonDetails from './components/HackathonDetails'
import Profile from './pages/Profile'
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

const App = () => {
  const location = useLocation();
  const [showNav,setShownNav] = useState(true);
  // Initialize state based on localStorage
  const [isLoggedIn,setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('token');
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return !!localStorage.getItem('adminToken');
  });
  
  // Sync state with localStorage on mount and location change
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location.pathname]);
  
  const hideLayout = ["/login","/signup"].includes(location.pathname) || location.pathname.startsWith('/admin');
  return (
    <>
     <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: 'green',
            },
          },
          error: {
            style: {
              background: 'red',
            },
          },
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
          <Route path='/subjects/:branch/:semester/:subjectCode' element={<SubjectUnits />} />
          <Route path='/content/:branch/:semester/:subjectCode/unit/:unitIndex' element={<UnitContent />} />
          <Route path='/subjects/:branchId' element={<Subjects />} />
          <Route path='/folders/:branchId/:subjectId' element={<Folders />} />
          <Route path='/courses' element={<Courses />}/>
          <Route path='/courses/:id' element={<CourseDetail />}/>
          <Route path='/hackathons' element={<Hakathons />}/>
          <Route path='/hackathon/:id' element={<HackathonDetails />} />
          <Route path='/roadmaps' element={<Roadmap />} />
          <Route path='/roadmaps/:id' element={<RoadmapDetail />} />
          <Route path='/resume' element={<ResumeBuilding />} />
          <Route path='/resumestepper' element={<ResumeStepper/>} />
          <Route path='/jobrole' element={<JobRole />} />
          <Route path='/jobs/:id' element={<JobDetail />} />
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn}  /> }  />
          <Route path='/signup' element={<Signin setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/profile' element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Profile />
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
              isAdminLoggedIn ? (
                <AdminLayout setIsAdminLoggedIn={setIsAdminLoggedIn}>
                  <Routes>
                    {localStorage.getItem('adminRole') === 'course_manager' ? (
                      <>
                        <Route path='courses' element={<AdminCourses />} />
                        <Route path='settings' element={<AdminSettings />} />
                        <Route path='*' element={<Navigate to='/admin/courses' replace />} />
                      </>
                    ) : (
                      <>
                        <Route path='dashboard' element={<AdminDashboard />} />
                        <Route path='users' element={<AdminUsers />} />
                        <Route path='students' element={<AdminStudents />} />
                        <Route path='courses' element={<AdminCourses />} />
                        <Route path='jobs' element={<AdminJobs />} />
                        <Route path='hackathons' element={<AdminHackathons />} />
                        <Route path='roadmaps' element={<AdminRoadmaps />} />
                        <Route path='content' element={<AdminContent />} />
                        <Route path='resumes' element={<AdminResumes />} />
                        <Route path='settings' element={<AdminSettings />} />
                        <Route path='*' element={<Navigate to='/admin/dashboard' replace />} />
                      </>
                    )}
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

