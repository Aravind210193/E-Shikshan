import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, BookOpen, Briefcase, Trophy, Map,
  FileText, Settings, LogOut, Menu, X, GraduationCap, Folder,
  School, BookMarked, FolderOpen, MessageSquare
} from "lucide-react";

import NotificationDropdown from "../../components/Admin/NotificationDropdown";

const AdminLayout = ({ setIsAdminLoggedIn, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminRole');
    sessionStorage.removeItem('adminData');
    setIsAdminLoggedIn(false);
    navigate('/admin');
  };

  // Determine role and base path
  const role = sessionStorage.getItem('adminRole');
  const base = role === 'course_manager' ? '/instructor' : '/admin';

  const menuItems =
    role === 'course_manager'
      ? [
        { path: `${base}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
        { path: `${base}/courses`, label: "Courses", icon: BookOpen },
        { path: `${base}/students`, label: "Students", icon: GraduationCap },
        { path: `${base}/doubts`, label: "Doubts", icon: MessageSquare },
        { path: `${base}/settings`, label: "Settings", icon: Settings }
      ]
      : [
        { path: `${base}/dashboard`, label: "Dashboard", icon: LayoutDashboard },
        { path: `${base}/users`, label: "Users", icon: Users },
        { path: `${base}/students`, label: "Students", icon: GraduationCap },
        { path: `${base}/courses`, label: "Courses", icon: BookOpen },
        { path: `${base}/doubts`, label: "Doubts", icon: MessageSquare },
        { path: `${base}/jobs`, label: "Jobs", icon: Briefcase },
        { path: `${base}/hackathons`, label: "Hackathons", icon: Trophy },
        { path: `${base}/roadmaps`, label: "Roadmaps", icon: Map },
        { path: `${base}/resumes`, label: "Resumes", icon: FileText },
        { path: `${base}/settings`, label: "Settings", icon: Settings }
      ];

  // Get admin data from localStorage
  const adminData = React.useMemo(() => {
    try {
      const data = sessionStorage.getItem('adminData');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }, []);

  const adminName = adminData?.name || 'Admin';
  const adminInitial = adminName.charAt(0).toUpperCase();
  const displayRole = adminData?.role === 'admin' ? 'Administrator' : 'Instructor';
  const roleColor = adminData?.role === 'admin' ? 'bg-red-600' : 'bg-blue-600';
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-[#10111a] overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className={`${sidebarOpen ? 'w-64' : 'w-0'
          } bg-[#1a1c2c] border-r border-[#2d2f45] flex flex-col fixed lg:relative h-full z-30 transition-all duration-300`}
      >
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20`}>
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-white font-extrabold text-2xl tracking-tight">E-<span className="text-indigo-500">Shikshan</span></h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                item.submenu ? (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between px-4 py-3 text-[#7a7f9a] hover:text-white cursor-pointer group transition-colors">
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 group-hover:text-indigo-400 transition-colors" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      <span className="text-[10px] opacity-50">▼</span>
                    </div>
                    <div className="ml-4 border-l border-[#2d2f45] pl-2 space-y-1">
                      {item.submenu.map((subitem) => (
                        <button
                          key={subitem.path}
                          onClick={() => navigate(subitem.path)}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-sm ${isActive(subitem.path)
                            ? 'bg-[#2d2f45] text-indigo-400 font-semibold'
                            : 'text-[#7a7f9a] hover:text-white hover:bg-[#25283c]'
                            }`}
                        >
                          <subitem.icon className="w-4 h-4" />
                          <span>{subitem.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.path)
                      ? 'bg-[#2d2f45] text-indigo-400'
                      : 'text-[#7a7f9a] hover:text-white hover:bg-[#25283c]'
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </button>
                )
              ))}
            </div>

            <div className="pt-4 border-t border-[#2d2f45]">
              <p className="px-4 text-[10px] font-bold text-[#5a5f7a] uppercase tracking-widest mb-2">Systems</p>
              <button
                onClick={() => navigate(`${base}/settings`)}
                className="w-full flex items-center gap-3 px-4 py-3 text-[#7a7f9a] hover:text-white hover:bg-[#25283c] rounded-lg transition-all"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium text-sm">Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-[#7a7f9a] hover:text-red-400 hover:bg-[#25283c] rounded-lg transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-[#1a1c2c] border-b border-[#2d2f45] px-6 py-3 flex items-center justify-between z-20">
          <div className="flex items-center gap-6 flex-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-[#7a7f9a] hover:text-white hover:bg-[#25283c] rounded-lg transition-all"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl relative">
              <input
                type="text"
                placeholder="Search for anything..."
                className="w-full bg-[#11121d] border border-[#2d2f45] text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500 transition-all text-sm"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7f9a]">
                <Settings className="w-4 h-4 rotate-90" /> {/* Using Settings as a temporary search icon placeholder if lucide has it */}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 ml-4">
            <div className="flex items-center gap-4 text-[#7a7f9a]">
              <button className="p-2 hover:bg-[#25283c] rounded-full transition-all relative">
                <LogOut className="w-5 h-5 rotate-180" /> {/* Message Icon substitute */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
              </button>
              <NotificationDropdown />
            </div>

            {/* Admin Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-[#2d2f45]">
              <div className="text-right hidden sm:block">
                <p className="text-white font-bold text-sm leading-none mb-1">{adminName}</p>
                <p className="text-[#7a7f9a] text-[10px] font-semibold">{displayRole}</p>
              </div>
              <div className={`w-10 h-10 ${roleColor} rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-[#2d2f45] overflow-hidden`}>
                <img src={`https://ui-avatars.com/api/?name=${adminName}&background=6366f1&color=fff`} alt="Admin" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#10111a] custom-scrollbar">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 lg:hidden z-20"
        />
      )}
    </div>
  );
};

export default AdminLayout;
