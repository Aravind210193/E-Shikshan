import React, { useState } from 'react'
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
import Folders from './pages/Folders'
import JobDetail from './pages/JobDetail'
import HackathonDetails from './components/HackathonDetails'
const App = () => {
  const location = useLocation();
  const [showNav,setShownNav] = useState(true);
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const hideLayout = ["/login","/signup"].includes(location.pathname);
  return (
    <>
     {!hideLayout && showNav && <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      <Routes >
          <Route path='/' element={<Home />} />
          <Route path='/content' element={<Content />} />
          <Route path='/subjects/:branchId' element={<Subjects />} />
          <Route path='/folders/:branchId/:subjectId' element={<Folders />} />
          <Route path='/courses' element={<Courses />}/>
          <Route path='/hackathons' element={<Hakathons />} />
          <Route path='/hackathon/:id' element={<HackathonDetails />} />
          <Route path='/roadmaps' element={<Roadmap />} />
          <Route path='/resume' element={<ResumeBuilding />} />
          <Route path='/resumestepper' element={<ResumeStepper/>} />
          <Route path='/jobrole' element={<JobRole />} />
          <Route path='/jobs/:id' element={<JobDetail />} />
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn}  /> }  />
          <Route path='/signup' element={<Signin/>} />
          <Route path='/profile' element={isLoggedIn ? <div>Profile Details</div> : <Navigate to='/login' />} />
      </Routes>
    {!hideLayout && showNav && <Footer />}
    </>
  )
}

export default App

