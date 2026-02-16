const Notification = require('../models/Notification');

// Get notifications for the logged-in admin/instructor
exports.getNotifications = async (req, res) => {
    try {
        let email;
        if (req.admin && req.admin.email) {
            email = req.admin.email;
        } else if (req.user && req.user.email) {
            email = req.user.email;
        }

        if (!email) {
            console.error('Notification Controller: Email missing from request user/admin object.');
            // If no email identifiers, return empty list or specific error
            // Returning empty list prevents frontend crash
            return res.status(200).json([]);
        }

        const notifications = await Notification.find({ recipientEmail: email.toLowerCase() })
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
        const email = req.admin ? req.admin.email : req.user.email;
        await Notification.updateMany(
            { recipientEmail: email.toLowerCase(), isRead: false },
            { isRead: true }
        );
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
