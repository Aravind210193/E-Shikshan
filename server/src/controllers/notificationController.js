const Notification = require('../models/Notification');

// Get notifications for the logged-in admin/instructor
exports.getNotifications = async (req, res) => {
    try {
        let email, id;
        if (req.admin) {
            email = req.admin.email;
            id = req.admin.id || req.admin._id;
        } else if (req.user) {
            email = req.user.email;
            id = req.user.id || req.user._id;
        }

        const query = { $or: [] };
        if (email) query.$or.push({ recipientEmail: email.toLowerCase() });
        if (id) query.$or.push({ recipient: id });

        if (query.$or.length === 0) {
            return res.status(200).json([]);
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

// Get notifications for students (alias for clarity in routes)
exports.getStudentNotifications = exports.getNotifications;

// Mark a notification as read
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndUpdate(id, { isRead: true });
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Error updating notification' });
    }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
    try {
        let email, id;
        if (req.admin) {
            email = req.admin.email;
            id = req.admin.id || req.admin._id;
        } else if (req.user) {
            email = req.user.email;
            id = req.user.id || req.user._id;
        }

        const query = { isRead: false, $or: [] };
        if (email) query.$or.push({ recipientEmail: email.toLowerCase() });
        if (id) query.$or.push({ recipient: id });

        if (query.$or.length === 0) {
            return res.status(200).json({ message: 'No recipient identified' });
        }

        await Notification.updateMany(query, { isRead: true });
        res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({ message: 'Error updating notifications' });
    }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndDelete(id);
        res.status(200).json({ message: 'Notification deleted' });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: 'Error deleting notification' });
    }
};
