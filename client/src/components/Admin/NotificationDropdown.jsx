import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminNotificationAPI } from '../../services/adminApi';

const NotificationDropdown = () => {
    console.log('NotificationDropdown rendering, API:', adminNotificationAPI);
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const response = await adminNotificationAPI.getNotifications();
            setNotifications(response.data);
            setUnreadCount(response.data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();

        // Set up polling every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await adminNotificationAPI.markAsRead(id);
            setNotifications(notifications.map(n =>
                n._id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await adminNotificationAPI.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await adminNotificationAPI.delete(id);
            const updated = notifications.filter(n => n._id !== id);
            setNotifications(updated);
            setUnreadCount(updated.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                            <h3 className="text-white font-semibold">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-red-500 hover:text-red-400 font-medium"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-12 h-12 text-gray-600 mx-auto mb-2 opacity-20" />
                                    <p className="text-gray-500 text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleMarkAsRead(notification._id)}
                                        className={`p-4 border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition-colors relative group ${!notification.isRead ? 'bg-gray-750/30' : ''
                                            }`}
                                    >
                                        {!notification.isRead && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />
                                        )}
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm font-medium ${notification.isRead ? 'text-gray-300' : 'text-white'}`}>
                                                {notification.title}
                                            </h4>
                                            <button
                                                onClick={(e) => handleDelete(e, notification._id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 transition-opacity"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                            <Clock className="w-3 h-3" />
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-gray-700 text-center">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs text-gray-400 hover:text-white"
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
