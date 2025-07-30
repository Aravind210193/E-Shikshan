import React, { useState } from 'react'
import Navbar2 from './components/Navbar2'
import {Navigate, Route, Routes} from 'react-router-dom'
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
const App = () => {

  const [isLoggedIn,setIsLoggedIn] = useState(false)
  return (
    <>
    <Navbar2  isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes >
          <Route path='/' element={<Home />} />
          <Route path='/content' element={<Content />} />
          <Route path='/courses' element={<Courses />}/>
          <Route path='/hackathons' element={<Hakathons />} />
          <Route path='/roadmaps' element={<Roadmap />} />
          <Route path='/resume' element={<ResumeBuilding />} />
          <Route path='/jobrole' element={<JobRole />} />
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path='/signup' element={<Signin/>} />
          <Route path='/profile' element={isLoggedIn ? <div>Profile Details</div> : <Navigate to='/login' />} />
      </Routes>
    <Footer />
    </>
  )
}

export default App

