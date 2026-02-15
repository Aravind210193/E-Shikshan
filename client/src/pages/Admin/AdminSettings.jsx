import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, User, Lock, Bell, Shield, Globe, Save } from "lucide-react";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: "E-Shikshan",
    siteEmail: "admin@eshikshan.com",
    maintenanceMode: false,
    emailNotifications: true,
    pushNotifications: false,
    twoFactorAuth: false,
  });

  const handleSaveSettings = () => {
    // Save settings logic
    console.log("Settings saved:", settings);
  };

  // Get admin data for personalization
  const adminData = React.useMemo(() => {
    try {
      const data = sessionStorage.getItem('adminData');
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }, []);

  const adminName = adminData?.name || 'Admin';
  const adminEmail = adminData?.email || 'admin@eshikshan.com';
  const displayRole = adminData?.role === 'admin' ? 'Super Admin' : 'Instructor';
  const roleColor = adminData?.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage system and account settings</p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Site Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl border border-gray-700 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Site Settings</h2>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Site Email</label>
            <input
              type="email"
              value={settings.siteEmail}
              onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-white font-medium">Maintenance Mode</p>
              <p className="text-sm text-gray-400">Enable site maintenance</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`relative w-14 h-7 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-blue-600' : 'bg-gray-600'
                }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-7' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-2xl border border-gray-700 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-semibold text-white">Security</h2>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-400">Add extra security layer</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
              className={`relative w-14 h-7 rounded-full transition-colors ${settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-600'
                }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.twoFactorAuth ? 'translate-x-7' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </button>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-2xl border border-gray-700 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-sm text-gray-400">Receive updates via email</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
              className={`relative w-14 h-7 rounded-full transition-colors ${settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-600'
                }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.emailNotifications ? 'translate-x-7' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-white font-medium">Push Notifications</p>
              <p className="text-sm text-gray-400">Receive browser notifications</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
              className={`relative w-14 h-7 rounded-full transition-colors ${settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-600'
                }`}
            >
              <span
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${settings.pushNotifications ? 'translate-x-7' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-2xl border border-gray-700 p-6 space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Account</h2>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Full Name</p>
            <p className="text-white font-medium">{adminName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Admin Email</p>
            <p className="text-white font-medium">{adminEmail}</p>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Role</p>
            <span className={`px-3 py-1 ${roleColor} rounded-full text-xs font-medium`}>
              {displayRole}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-1">Last Login</p>
            <p className="text-white font-medium">{adminData?.lastLogin ? new Date(adminData.lastLogin).toLocaleString() : 'Recently'}</p>
          </div>
        </motion.div>
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveSettings}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 shadow-lg"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AdminSettings;
