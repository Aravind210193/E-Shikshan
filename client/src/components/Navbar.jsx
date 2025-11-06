import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';

const Navbar = ({ isLoggedIn, setIsLoggedIn, children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu,setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Fetch user data when logged in (from API so images persist reliably)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoggedIn) {
        setUser(null);
        return;
      }
      try {
        const response = await authAPI.getProfile();
        setUser(response.data);
        // Keep a lightweight copy in localStorage for rare fallbacks (avoid quota issues)
        try {
          const { token, ...rest } = response.data || {};
          localStorage.setItem('user', JSON.stringify(rest));
        } catch (e) {
          // Ignore storage quota errors
        }
      } catch (error) {
        console.error('Failed to fetch user for navbar:', error?.response?.data || error.message);
        // Fallback to stored user if present
        try {
          const cached = localStorage.getItem('user');
          setUser(cached ? JSON.parse(cached) : null);
        } catch {
          setUser(null);
        }
      }
    };
    fetchUserData();
  }, [isLoggedIn, location.pathname]);

  // Close profile dropdown on outside click or ESC
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!showMenu) return;
      const inDesktop = desktopMenuRef.current && desktopMenuRef.current.contains(e.target);
      const inMobile = mobileMenuRef.current && mobileMenuRef.current.contains(e.target);
      if (!inDesktop && !inMobile) {
        setShowMenu(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [showMenu]);

  const handleLogout = () => {
    // Clear token and user data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Update login state
    setIsLoggedIn(false);
    // Clear user state
    setUser(null);
    // Close menu
    setShowMenu(false);
    // Show success message
    toast.success('Logged out successfully!');
    // Redirect to home
    navigate('/');
  };

  function getLinkClasses(path) {
    return `block px-2 py-1 rounded-md transition ${
      location.pathname === path ? 'text-yellow-400 font-bold' : 'hover:text-yellow-300'
    }`;
  }

  return (
    <div className="flex justify-between   items-center px-6  ">
        <nav className='w-full'>
            <div className='max-w-7xl mx-auto flex items-center justify-between px-6 '>

              <div className='hidden md:flex items-center justify-between px-6   '>
                  <Link to='/' className={` transition-all duration-300 `}>
                       <div >
                          
                             <img src='/logo1.png' alt='logo' className='h-30 w-auto ' />
                          
                        </div>
                   
                    
                     </Link>
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
                <div className='relative' ref={desktopMenuRef}>
                            {!isLoggedIn ? (
                            <div className='hidden md:flex space-x-3'>
                
                                <button onClick={()=>navigate('/login')} className='px-4 py-2 
                                rounded-full cursor-pointer bg-blue-500 text-white hover:bg-blue-600 text-sm '>
                                Login
                                </button>  
                
                                <button onClick={()=>navigate('/signup')} className='cursor-pointer px-4 text-sm py-2 rounded-full bg-green-500 text-white hover:bg-green-600'>
                                Sign up
                                </button>
                            </div>
                            ):(
                            <div className='relative'>
                                {/* Profile Picture or User Icon */}
                                {user?.profilePicture ? (
                                  <img 
                                    src={user.profilePicture} 
                                    alt={user?.name || 'User'}
                                    onClick={()=>setShowMenu(!showMenu)}
                                    className='hidden md:flex w-9 h-9 rounded-full object-cover border-2 border-gray-600 hover:border-gray-400 cursor-pointer transition-all'
                                  />
                                ) : (
                                  <User size={36} onClick={()=>setShowMenu(!showMenu)} className=' hidden md:flex text-3xl rounded-full bg-gray-700 text-gray-300 hover:text-white cursor-pointer' />
                                )}
                                { showMenu && (
              <div className='absolute right-0 mt-2 w-56 z-50 rounded-lg bg-gray-800 border border-gray-700 shadow-2xl py-2'>
                
                <Link onClick={() => setShowMenu(false)} to='/profile' className='block px-4 py-2 text-gray-200 hover:bg-gray-700 transition-colors'>Profile</Link>
                <Link onClick={() => setShowMenu(false)} to='/profile?edit=true' className='block px-4 py-2 text-gray-200 hover:bg-gray-700 transition-colors'>Edit Details</Link>
                <Link onClick={() => setShowMenu(false)} to='/settings' className='block px-4 py-2 text-gray-200 hover:bg-gray-700 transition-colors'>Settings</Link>
                <button onClick={handleLogout} className='w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors'>Log out</button>
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
          <Link to="/content" onClick={() => setMenuOpen(false)} className={getLinkClasses('/content')}>Content</Link>
          <Link to="/courses" onClick={() => setMenuOpen(false)} className={getLinkClasses('/courses')}>Courses</Link>
          <Link to="/hackathons" onClick={() => setMenuOpen(false)} className={getLinkClasses('/hackathons')}>Hackathons</Link>
          <Link to="/roadmaps" onClick={() => setMenuOpen(false)} className={getLinkClasses('/roadmaps')}>Roadmaps</Link>
          <Link to="/jobrole" onClick={() => setMenuOpen(false)} className={getLinkClasses('/jobrole')}>Job Details</Link>
        </nav>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {menuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Top Bar (mobile hamburger) */}
      <div className="fixed top-0 left-0 w-full bg-gray-900 shadow-md z-40 md:hidden flex items-center justify-between px-4 py-3">
        <button onClick={() => setMenuOpen(true)}>
          <MenuIcon className="w-6 h-6 text-white" />
        </button>
            <div className=''>
                {!isLoggedIn ? (
                    <div className='flex  md:flex space-x-3'>
                        <button onClick={()=>navigate('/login')} className='px-4 py-2 
                        rounded-full bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'>
                        Login
                        </button>  

                        <button onClick={()=>navigate('/signup')} className='cursor-pointer px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600'>
                            Sign up
                        </button>
                    </div>
                ):(
          <div>
            <div className='relative' ref={mobileMenuRef}>
                                {/* Profile Picture or User Icon */}
                                {user?.profilePicture ? (
                                  <img 
                                    src={user.profilePicture} 
                                    alt={user?.name || 'User'}
                                    onClick={()=>setShowMenu(!showMenu)}
                                    className='w-9 h-9 rounded-full object-cover border-2 border-gray-600 hover:border-gray-400 cursor-pointer transition-all'
                                  />
                                ) : (
                                  <User size={36} onClick={()=>setShowMenu(!showMenu)} className='text-3xl rounded-full bg-gray-700 text-gray-300 hover:text-white cursor-pointer' />
                                )}
                                { showMenu && (
              <div className='absolute right-0 mt-2 w-56 rounded-lg bg-gray-800 border border-gray-700 shadow-2xl py-2 z-50'>
                
                <Link onClick={() => setShowMenu(false)} to='/profile' className='block px-4 py-2 text-gray-200 hover:bg-gray-700 transition-colors'>Profile</Link>
                <Link onClick={() => setShowMenu(false)} to='/profile?edit=true' className='block px-4 py-2 text-gray-200 hover:bg-gray-700 transition-colors'>Edit Details</Link>
                <Link onClick={() => setShowMenu(false)} to='/settings' className='block px-4 py-2 text-gray-200 hover:bg-gray-700 transition-colors'>Settings</Link>
                <button onClick={handleLogout} className='w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors'>Log out</button>
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

export default Navbar;













