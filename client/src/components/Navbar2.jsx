import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon, User } from 'lucide-react';
import logo from '../assets/images/logo.jpeg'
const Navbar2 = ({ isLoggedIn, setIsLoggedIn, children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu,setShowMenu] = useState(false);

  function getLinkClasses(path) {
    return `block px-2 py-1 rounded-md transition ${
      location.pathname === path ? 'text-yellow-400 font-bold' : 'hover:text-yellow-300'
    }`;
  }

  return (
    <div className="flex justify-between cursor-pointer  items-center px-6 py-1 ">
        <nav className='w-full'>
            <div className='max-w-7xl mx-auto flex items-center justify-between px-6 py-0.01'>

              <div className='hidden md:flex items-center justify-between px-6 py-3  '>
                  <img src='/logo.png' alt='logo' className='h-30 w-auto' />
              </div>
                <div className='hidden md:flex   rounded-full border border-gray-700 p-1 '>
                    <Link to='/' className={`px-5 py-2 rounded-full text-sm font-medium transition-all
                    duration-300 ${location.pathname === "/" ? 'text-white hover:bg-gray-500':'hover:bg-gray-400'}`}>
                        Home
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
                <div className='relative'>
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
                                <User size={36} onClick={()=>setShowMenu(!showMenu)} className=' hidden md:flex text-3xl rounded-full bg-gray-700 text-gray-300 hover:text-white curser-pointer' />
                                { showMenu && (
                            <div className='absolute right-0 mt-2 w-48  rounded-md  py-2'>
                
                                <Link to='/profile' className='block px-4 py-2 text-gray-200 hover:bg-gray-700'>Profile</Link>
                                <Link to='/profile' className='block px-4 py-2 text-gray-200 hover:bg-gray-700'>Settings</Link>
                                <Link onClick={()=> setIsLoggedIn(false)}  to='/profile' className='w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700'>Log out</Link>
                            </div>
                                )}
                            </div>
                            )}
                    </div>
                    </div>
                    </nav>
      
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-950 shadow-md transition-transform duration-500 z-50 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <span className="text-white text-lg font-semibold">Menu</span>
          <XIcon className="w-6 h-6 text-white cursor-pointer" onClick={() => setMenuOpen(false)} />
        </div>
        <nav className="flex flex-col p-4 space-y-3">
          <Link to="/" onClick={() => setMenuOpen(false)} className={getLinkClasses('/')}>Home</Link>
          <Link to="/courses" onClick={() => setMenuOpen(false)} className={getLinkClasses('/courses')}>Courses</Link>
          <Link to="/roadmaps" onClick={() => setMenuOpen(false)} className={getLinkClasses('/roadmaps')}>Roadmaps</Link>
          <Link to="/jobrole" onClick={() => setMenuOpen(false)} className={getLinkClasses('/jobrole')}>Job Details</Link>
        </nav>
        </div>
      

      {/* Top Bar (mobile hamburger) */}
      <div className="fixed top-0 left-0 w-full bg-gray-900 shadow-md z-40 md:hidden flex items-center justify-between px-4 py-3">
        <button onClick={() => setMenuOpen(true)}>
          <MenuIcon className="w-6 h-6 text-white" />
        </button>
            <div className=''>
                {!isLoggedIn ? (
                    <div className='flex  md:flex space-x-3'>
                        <button onClick={()=>navigate('/login')} className='px-4 py-2 
                        rounded-md bg-blue-500 text-white hover:bg-blue-600'>
                        Login
                        </button>  

                        <button onClick={()=>navigate('/signup')} className='px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600'>
                            Sign up
                        </button>
                    </div>
                ):(
                    <div>
                        <div className='relative'>
                                {/* <FauserCircle onClick={()=>setShowMenu(!showMenu)} className='text-3xl text-gray-300 hover:text-white curser-pointer' /> */}
                                <User size={36} onClick={()=>setShowMenu(!showMenu)} className='text-3xl rounded-full bg-gray-700 text-gray-300 hover:text-white curser-pointer' />
                                { showMenu && (
                            <div className='absolute right-0 mt-2 w-48  rounded-md shadow-lg py-2'>
                
                                <Link to='/profile' className='block px-4 py-2 text-gray-200 hover:bg-gray-700'>Profile</Link>
                                <Link to='/profile' className='block px-4 py-2 text-gray-200 hover:bg-gray-700'>Settings</Link>
                                <Link onClick={()=> setIsLoggedIn(false)}  to='/profile' className='w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700'>Log out</Link>
                            </div>
                                )}
                            </div>
                    </div>
                )}
              
            </div>
      </div>

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-500 pt-16 px-4 ${
          menuOpen ? 'ml-64' : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Navbar2;