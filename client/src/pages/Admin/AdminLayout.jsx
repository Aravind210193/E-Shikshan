import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Users, BookOpen, Briefcase, Trophy, Map, 
  FileText, Settings, LogOut, Menu, X, GraduationCap, Folder,
  School, BookMarked, FolderOpen
} from "lucide-react";

const AdminLayout = ({ setIsAdminLoggedIn, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
    navigate('/admin');
  };

  // Determine role
  const role = localStorage.getItem('adminRole');
  const menuItems =
    role === 'course_manager'
      ? [
          { path: "/admin/courses", label: "Courses", icon: BookOpen },
          { path: "/admin/settings", label: "Settings", icon: Settings }
        ]
      : [
          { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
          { path: "/admin/users", label: "Users", icon: Users },
          { path: "/admin/students", label: "Students", icon: GraduationCap },
          { path: "/admin/courses", label: "Courses", icon: BookOpen },
          { path: "/admin/jobs", label: "Jobs", icon: Briefcase },
          { path: "/admin/hackathons", label: "Hackathons", icon: Trophy },
          { path: "/admin/roadmaps", label: "Roadmaps", icon: Map },
          { 
            label: "Content Management", 
            icon: Folder, 
            submenu: [
              { path: "/admin/content", label: "All Content", icon: FileText },
              { path: "/admin/branches", label: "Branches", icon: Folder },
              { path: "/admin/education-levels", label: "Education Levels", icon: School },
              { path: "/admin/subjects", label: "Subjects", icon: BookOpen },
              { path: "/admin/programs", label: "Programs", icon: BookMarked },
              { path: "/admin/folders", label: "Folders & PDFs", icon: FolderOpen },
            ]
          },
          { path: "/admin/resumes", label: "Resumes", icon: FileText },
          { path: "/admin/settings", label: "Settings", icon: Settings }
        ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gray-800 border-r border-gray-700 flex flex-col fixed lg:relative h-full z-30 transition-all duration-300`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">E-Shikshan</h1>
              <p className="text-gray-400 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              item.submenu ? (
                <div key={index} className="space-y-1">
                  <div className="flex items-center gap-3 px-4 py-3 text-gray-400">
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <div className="ml-4 space-y-1">
                    {item.submenu.map((subitem) => (
                      <motion.button
                        key={subitem.path}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(subitem.path)}
                        className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all ${
                          isActive(subitem.path)
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                      >
                        <subitem.icon className="w-4 h-4" />
                        <span className="font-medium text-sm">{subitem.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.button
                  key={item.path}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.path)
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              )
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-gray-700 hover:bg-red-600 text-white rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-gray-400" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-400" />
                )}
              </button>
              <div>
                <h2 className="text-white font-semibold text-lg">
                  {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Panel'}
                </h2>
                <p className="text-gray-400 text-sm">Manage your platform</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Admin Profile */}
              <div className="flex items-center gap-3 px-4 py-2 bg-gray-700 rounded-xl">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  A
                </div>
                <div>
                  <p className="text-white font-medium text-sm">Admin</p>
                  <p className="text-gray-400 text-xs">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-900">
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
