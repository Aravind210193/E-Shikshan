import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MenuIcon, XIcon, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api';
import StudentNotificationDropdown from './StudentNotificationDropdown';
const Navbar = ({ isLoggedIn, setIsLoggedIn, children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
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

    // Listen for profile updates from Profile page
    const handleProfileUpdate = (event) => {
      if (event.detail) {
        setUser(event.detail);
      }
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
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
    return `block px-2 py-1 rounded-md transition ${location.pathname === path ? 'text-yellow-400 font-bold' : 'hover:text-yellow-300'
      }`;
  }

  return (
    <div className="w-full">
      <nav className='w-full bg-gray-900 shadow-lg'>
        <div className='max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 md:px-6 py-3'>

          <div className='hidden md:flex items-center flex-shrink-0'>
            <Link to='/' className='transition-all duration-300'>
              <div className='flex items-center'>
                <span className='text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:from-blue-500 hover:via-purple-600 hover:to-pink-600 transition-all'>
                  E-Shikshan
                </span>
              </div>
            </Link>
          </div>
          <div className='hidden md:flex rounded-full border border-gray-700 p-1 mx-4'>
            <Link to='/' className={`px-5 py-2 rounded-full text-sm font-medium transition-all
                    duration-300 ${location.pathname === "/" ? 'text-white hover:bg-gray-500' : 'hover:bg-gray-400'}`}>
              Home
            </Link>

            <Link to='/courses' className={`px-5 py-2 rounded-full text-sm font-medium transition-all
                    duration-300 ${location.pathname === "/courses" ? 'text-white hover:bg-gray-500' : 'hover:bg-gray-400'}`}>
              Courses
            </Link>

            <Link to='/roadmap' className={`px-5 py-2 rounded-full text-sm font-medium transition-all
                    duration-300 ${location.pathname === "/roadmap" ? 'text-white hover:bg-gray-500' : 'hover:bg-gray-400'}`}>
              Roadmaps
            </Link>

            <Link to='/jobs' className={`px-5 py-2 rounded-full text-sm font-medium transition-all
                    duration-300 ${location.pathname === "/jobs" ? 'text-white hover:bg-gray-500' : 'hover:bg-gray-400'}`}>
              Job Details
            </Link>

          </div>
          <div className='relative' ref={desktopMenuRef}>
            {!isLoggedIn ? (
              <div className='hidden md:flex space-x-2 lg:space-x-3 flex-shrink-0'>

                <button onClick={() => navigate('/login')} className='px-3 lg:px-4 py-2 
                                rounded-full cursor-pointer bg-blue-500 text-white hover:bg-blue-600 text-xs lg:text-sm font-medium transition-colors'>
                  Login
                </button>

                <button onClick={() => navigate('/signup')} className='cursor-pointer px-3 lg:px-4 text-xs lg:text-sm py-2 rounded-full bg-green-500 text-white hover:bg-green-600 font-medium transition-colors'>
                  Sign up
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <StudentNotificationDropdown />
                </div>

                <div className='relative'>
                  {/* Profile Picture or User Icon */}
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user?.name || 'User'}
                      onClick={() => setShowMenu(!showMenu)}
                      className='hidden md:flex w-9 h-9 rounded-full object-cover border-2 border-gray-600 hover:border-gray-400 cursor-pointer transition-all'
                    />
                  ) : (
                    <User size={36} onClick={() => setShowMenu(!showMenu)} className=' hidden md:flex text-3xl rounded-full bg-gray-700 text-gray-300 hover:text-white cursor-pointer' />
                  )}
                  {showMenu && (
                    <div className='absolute right-0 mt-2 w-48 lg:w-56 z-[100] rounded-lg bg-gray-800 border border-gray-700 shadow-2xl py-2'>

                      <Link onClick={() => setShowMenu(false)} to='/dashboard' className='block px-4 py-2 text-sm text-indigo-400 font-bold hover:bg-gray-700 transition-colors'>Dashboard</Link>
                      <Link onClick={() => setShowMenu(false)} to='/profile' className='block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors'>Profile</Link>
                      <Link onClick={() => setShowMenu(false)} to='/profile?edit=true' className='block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors'>Edit Details</Link>
                      <Link onClick={() => setShowMenu(false)} to='/settings' className='block px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors'>Settings</Link>
                      <button onClick={handleLogout} className='w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors'>Log out</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-72 sm:w-80 bg-gray-950 shadow-2xl transition-transform duration-300 ease-in-out z-[200] ${menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-700 bg-gray-900">
          <span className="text-white text-xl font-bold">Menu</span>
          <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <XIcon className="w-6 h-6 text-white" />
          </button>
        </div>
        <nav className="flex flex-col p-5 space-y-2">
          <Link to="/" onClick={() => setMenuOpen(false)} className={`${getLinkClasses('/')} text-base py-3 px-4 touch-manipulation`}>Home</Link>
          <Link to="/content" onClick={() => setMenuOpen(false)} className={`${getLinkClasses('/content')} text-base py-3 px-4 touch-manipulation`}>Content</Link>
          <Link to="/courses" onClick={() => setMenuOpen(false)} className={`${getLinkClasses('/courses')} text-base py-3 px-4 touch-manipulation`}>Courses</Link>
          <Link to="/hackathons" onClick={() => setMenuOpen(false)} className={`${getLinkClasses('/hackathons')} text-base py-3 px-4 touch-manipulation`}>Hackathons</Link>
          <Link to="/roadmap" onClick={() => setMenuOpen(false)} className={`${getLinkClasses('/roadmap')} text-base py-3 px-4 touch-manipulation`}>Roadmaps</Link>
          <Link to="/jobs" onClick={() => setMenuOpen(false)} className={`${getLinkClasses('/jobs')} text-base py-3 px-4 touch-manipulation`}>Job Details</Link>
        </nav>
      </div>

      {/* Overlay for mobile sidebar */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-[190] md:hidden backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Top Bar (mobile hamburger) */}
      <div className="fixed top-0 left-0 w-full bg-gray-900 shadow-lg z-[180] md:hidden flex items-center justify-between px-3 sm:px-4 py-3 border-b border-gray-800">
        <button onClick={() => setMenuOpen(true)} className="flex-shrink-0 p-2 hover:bg-gray-800 rounded-lg transition-colors touch-manipulation">
          <MenuIcon className="w-6 h-6 text-white" />
        </button>

        {/* Login/Profile section */}
        <div className='flex-shrink-0 ml-auto'>
          {!isLoggedIn ? (
            <div className='flex space-x-1.5 sm:space-x-2'>
              <button onClick={() => navigate('/login')} className='px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm
              rounded-full bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 cursor-pointer font-medium transition-colors touch-manipulation'>
                Login
              </button>

              <button onClick={() => navigate('/signup')} className='cursor-pointer px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm rounded-full bg-green-500 text-white hover:bg-green-600 active:bg-green-700 font-medium transition-colors touch-manipulation'>
                Sign up
              </button>
            </div>
          ) : (
            <div className='relative' ref={mobileMenuRef}>
              {/* Profile Picture or User Icon */}
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt={user?.name || 'User'}
                  onClick={() => setShowMenu(!showMenu)}
                  className='w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-600 hover:border-gray-400 active:border-gray-500 cursor-pointer transition-all touch-manipulation'
                />
              ) : (
                <User size={36} onClick={() => setShowMenu(!showMenu)} className='w-9 h-9 sm:w-10 sm:h-10 p-1 rounded-full bg-gray-700 text-gray-300 hover:text-white active:bg-gray-600 cursor-pointer transition-colors touch-manipulation' />
              )}

              {/* Profile Dropdown - Mobile */}
              {showMenu && (
                <div className='absolute right-0 mt-2 w-44 sm:w-48 rounded-lg bg-gray-800 border border-gray-700 shadow-2xl py-2 z-[200]'>
                  <Link onClick={() => setShowMenu(false)} to='/dashboard' className='block px-4 py-2.5 text-sm text-indigo-400 font-bold hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation'>Dashboard</Link>
                  <Link onClick={() => setShowMenu(false)} to='/profile' className='block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation'>Profile</Link>
                  <Link onClick={() => setShowMenu(false)} to='/profile?edit=true' className='block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation'>Edit Details</Link>
                  <Link onClick={() => setShowMenu(false)} to='/settings' className='block px-4 py-2.5 text-sm text-gray-200 hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation'>Settings</Link>
                  <button onClick={handleLogout} className='w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-700 active:bg-gray-600 transition-colors touch-manipulation'>Log out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main content spacer for mobile navbar */}
      <div className="md:hidden h-16" />
      {children}
    </div>
  );
};

export default Navbar;













