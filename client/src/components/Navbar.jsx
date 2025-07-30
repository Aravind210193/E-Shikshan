import React, { useEffect, useState } from 'react'
import { Link,useLocation, useNavigate } from 'react-router-dom'
import {XIcon , SearchIcon, MenuIcon, HomeIcon} from 'lucide-react'

const Navbar = ({isLoggedIn,setIsLoggedIn}) => {

    const [showMenu,setShowMenu] = useState(false);
    const [menuOpen,setMenuOpen] = useState(false);
    const [visible,setVisible] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

      useEffect(()=>{
        setMenuOpen(false);
      },[location.pathname]);
      
      function getLinkClasses(path){
        return `block px-2 py-1 rounded-md transition ${location.pathname === path ? 'text-yellow-400 font-bold' :
          'hover:text-yellow-300'}`;
      }
  return (
  <div className='flex justify-between items-center px-6 py-3 shadow-md'>

    <div className='hidden md:flex  rounded-full border border-gray-700 p-1 '>
      <Link to='/' className={`px-5 py-2 rounded-full text-sm font-medium transition-all
        duration-300 ${location.pathname === "/" ? 'text-white hover:bg-gray-500':'hover:bg-gray-400'}`}>
         <HomeIcon className='w-6 h-6' />Home
      </Link>

      <Link to='/courses' className={`px-5 py-2 rounded-full text-sm font-medium transition-all
        duration-300 ${location.pathname === "/courses" ? 'text-white hover:bg-gray-500':'hover:bg-gray-400'}`}>
          Courses
      </Link>

      <Link to='/roadmaps' className={`px-5 py-2 rounded-full text-sm font-medium transition-all
        duration-300 ${location.pathname === "/roadmaps" ? 'text-white hover:bg-gray-500':'hover:bg-gray-400'}`}>
          Roadmaps
      </Link>

      <Link to='/jobrole' className={`px-5 py-2 rounded-full text-sm font-medium transition-all
        duration-300 ${location.pathname === "/jobrole" ? 'text-white hover:bg-gray-500':'hover:bg-gray-400'}`}>
          Job Details
      </Link>

    </div>
        <div className='relative '>

          {!isLoggedIn ? (
            <div className='hidden md:flex space-x-3'>

              <button onClick={()=>navigate('/login')} className='px-4 py-2 
                rounded-md bg-blue-500 text-white hover:bg-blue-600'>
                Login
              </button>  

              <button onClick={()=>navigate('/signup')} className='px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600'>
                Sign up
              </button>
            </div>
          ):(
            <div className='relative'>
              {/* <FauserCircle onClick={()=>setShowMenu(!showMenu)} className='text-3xl text-gray-300 hover:text-white curser-pointer' /> */}
              
              { showMenu && (
            <div className='absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-2'>

              <Link to='/profile' className='block px-4 py-2 text-gray-200 hover:bg-gray-700'>Profile</Link>
              <Link to='/profile' className='block px-4 py-2 text-gray-200 hover:bg-gray-700'>Settings</Link>
              <Link onClick={()=> setIsLoggedIn(false)}  to='/profile' className='w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700'>Log out</Link>
            </div>
              )}
            </div>
          )}
        
        
        <button className='md:hidden p-2 rounded' onClick={()=>setMenuOpen(!menuOpen)}>
        {
          menuOpen ? 
          <XIcon className='w-6 h-6 ' size={28}/> : <MenuIcon size={28} className='w-6 h-6 top-0 left-0' />
        }
      </button>
        </div>
        {/* Overlay + Sliding Sidebar */}
<div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? 'block' : 'hidden'}`}>
  {/* Dark overlay */}
  <div 
    className="absolute inset-0 bg-black bg-opacity-50"
    onClick={() => setMenuOpen(false)}
  ></div>

  {/* Sliding Sidebar */}
  <div className={`fixed top-0 left-0 h-screen w-64 bg-gray-950 z-50 shadow-lg p-5 transform transition-transform duration-[700ms]
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex justify-between items-center mb-6">
          <span className="text-white text-xl font-semibold">Menu</span>
          <XIcon className="w-6 h-6 text-white cursor-pointer" onClick={() => setMenuOpen(false)} />
        </div>

        <nav className="flex flex-col space-y-4">
          <Link to='/' onClick={() => setMenuOpen(false)} className={getLinkClasses('/')}>Home</Link>
          <Link to='/courses' onClick={() => setMenuOpen(false)} className={getLinkClasses('/courses')}>Courses</Link>
          <Link to='/roadmaps' onClick={() => setMenuOpen(false)} className={getLinkClasses('/roadmaps')}>Roadmaps</Link>
          <Link to='/jobrole' onClick={() => setMenuOpen(false)} className={getLinkClasses('/jobrole')}>Job Details</Link>

          {isLoggedIn ? (
            <Link to='/profile' onClick={() => setMenuOpen(false)} className="text-yellow-400">Profile</Link>
          ) : (
            <>
              <Link to='/login' onClick={() => setMenuOpen(false)} className="text-white">Login</Link>
              <Link to='/signup' onClick={() => setMenuOpen(false)} className="text-yellow-400">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </div>
  </div>
  
  )
}

export default Navbar