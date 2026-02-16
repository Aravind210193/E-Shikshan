const Doubt = require('../models/Doubt');
const Course = require('../models/Course');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Create a new doubt
exports.createDoubt = async (req, res) => {
    try {
        const { courseId, itemType, itemId, itemTitle, question } = req.body;
        const student = req.user.id;

        // Fetch the course and student
        const [course, studentObj] = await Promise.all([
            Course.findById(courseId),
            User.findById(student)
        ]);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        const studentName = studentObj ? studentObj.name : 'A student';

        const newDoubt = new Doubt({
            course: courseId,
            student: student,
            instructorEmail: course.instructorEmail,
            itemType: itemType,
            itemId: itemId,
            itemTitle: itemTitle,
            question: question,

        });

        const savedDoubt = await newDoubt.save();

        // Create notification for instructor
        if (course.instructorEmail) {
            await Notification.create({
                recipientEmail: course.instructorEmail.toLowerCase(),
                sender: student,
                type: 'doubt',
                title: 'New Doubt Asked',
                message: `${studentName} asked a doubt in ${course.title}: "${question.substring(0, 50)}${question.length > 50 ? '...' : ''}"`,
                relatedId: savedDoubt._id
            });
        }

        res.status(201).json(savedDoubt);
    } catch (error) {
        console.error('Error creating doubt:', error);
        res.status(500).json({ message: 'Error creating doubt' });
    }
};

// Get doubts for a student
exports.getStudentDoubts = async (req, res) => {
    try {
        const studentId = req.user.id;
        const doubts = await Doubt.find({ student: studentId })
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json(doubts);
    } catch (error) {
        console.error('Error fetching student doubts:', error);
        res.status(500).json({ message: 'Error fetching doubts' });
    }
};

// Get doubts for an instructor
exports.getDoubtsForInstructor = async (req, res) => {
    try {
        // For instructor logic, we expect the logged-in user to be from the Admin model (role: course_manager or admin)
        const instructorEmail = req.admin.email;

        // Check if the user is an admin or course_manager
        // If admin (super admin), maybe show all doubts? Or just their own if they have courses. 
        // The previous implementation uses req.admin for admin users.
        // This controller might be used by both student (to view their doubts) and instructor.
        // Let's assume this is for INSTRUCTORS for now, using the admin auth middleware.

        const doubts = await Doubt.find({ instructorEmail: instructorEmail })
            .populate('student', 'name email')
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        // Flatten for frontend
        const flattenedDoubts = doubts.map(doubt => ({
            ...doubt._doc,
            studentName: doubt.student?.name || 'Unknown Student',
            courseTitle: doubt.course?.title || 'Unknown Course'
        }));

        res.status(200).json({ doubts: flattenedDoubts });
    } catch (error) {
        console.error('Error fetching doubts:', error);
        res.status(500).json({ message: 'Error fetching doubts' });
    }
};

// Get all doubts (for super admin)
exports.getAllDoubts = async (req, res) => {
    try {
        const doubts = await Doubt.find()
            .populate('student', 'name email')
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        // Flatten for frontend
        const flattenedDoubts = doubts.map(doubt => ({
            ...doubt._doc,
            studentName: doubt.student?.name || 'Unknown Student',
            courseTitle: doubt.course?.title || 'Unknown Course'
        }));

        res.status(200).json({ doubts: flattenedDoubts });
    } catch (error) {
        console.error('Error fetching all doubts:', error);
        res.status(500).json({ message: 'Error fetching doubts' });
    }
};

// Reply to a doubt / Resolve it
exports.replyDoubt = async (req, res) => {
    try {
        const { id } = req.params;
        const { reply, status } = req.body;

        const doubt = await Doubt.findById(id);
        if (!doubt) {
            return res.status(404).json({ message: 'Doubt not found' });
        }

        // Migration for legacy doubts
        if ((!doubt.discussion || doubt.discussion.length === 0) && doubt.reply) {
            if (!doubt.discussion) doubt.discussion = [];
            doubt.discussion.push({
                sender: 'instructor',
                message: doubt.reply,
                timestamp: doubt.updatedAt || new Date()
            });
        }

        if (!doubt.discussion) doubt.discussion = [];

        doubt.discussion.push({
            sender: 'instructor',
            message: reply,
            timestamp: new Date()
        });

        doubt.reply = reply; // Keep latest reply for legacy/preview

        if (status) {
            doubt.status = status;
        }
        // If no status provided, we don't change it (keeps it as 'pending' usually)

        await doubt.save();

        // Populate for return
        await doubt.populate('student', 'name email');
        await doubt.populate('course', 'title');

        // Create notification for student
        if (doubt.student && doubt.student.email) {
            let notifTitle = 'New Reply to your Doubt';
            let notifMessage = `Instructor replied to your doubt in ${doubt.course?.title || 'a course'}: "${reply.substring(0, 50)}${reply.length > 50 ? '...' : ''}"`;

            if (status === 'resolved') {
                notifTitle = 'Doubt Resolved';
                notifMessage = `Your doubt in ${doubt.course?.title || 'a course'} has been resolved. Reply: "${reply.substring(0, 50)}${reply.length > 50 ? '...' : ''}"`;
            }

            await Notification.create({
                recipientEmail: doubt.student.email.toLowerCase(),
                type: 'doubt',
                relatedId: doubt._id,
                title: notifTitle,
                message: notifMessage
            });

            // Add points for resolution ONLY if resolved now
            if (status === 'resolved') {
                try {
                    const { trackDoubtResolved } = require('../utils/gamification');
                    await trackDoubtResolved(doubt.student._id, {
                        courseId: doubt.course?._id,
                        doubtId: doubt._id,
                        question: doubt.question
                    });
                } catch (err) {
                    console.error('Failed to award points for doubt resolution:', err);
                }
            }
        }

        res.status(200).json(doubt);
    } catch (error) {
        console.error('Error replying to doubt:', error);
        res.status(500).json({ message: 'Error replying to doubt' });
    }
};

// Get pending doubts count for dashboard stats
exports.getPendingDoubtsCount = async (req, res) => {
    try {
        const instructorEmail = req.admin.email;
        const count = await Doubt.countDocuments({
            instructorEmail: instructorEmail,
            status: 'pending'
        });
        res.status(200).json({ count });
    } catch (error) {
        console.error('Error fetching pending doubts count:', error);
        res.status(500).json({ message: 'Error fetching stats' });
    }
};

// Delete a doubt (for students)
exports.deleteDoubt = async (req, res) => {
    try {
        const { id } = req.params;
        const studentId = req.user.id;

        const doubt = await Doubt.findById(id);
        if (!doubt) {
            return res.status(404).json({ message: 'Doubt not found' });
        }

        // Verify ownership
        if (doubt.student.toString() !== studentId.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Delete the doubt
        await Doubt.findByIdAndDelete(id);

        res.status(200).json({ message: 'Doubt deleted successfully' });
    } catch (error) {
        console.error('Error deleting doubt:', error);
        res.status(500).json({ message: 'Error deleting doubt' });
    }
};

// Student Reply to a doubt
exports.studentReply = async (req, res) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const studentId = req.user.id;

        const doubt = await Doubt.findById(id);

        if (!doubt) {
            return res.status(404).json({ message: 'Doubt not found' });
        }

        if (doubt.student.toString() !== studentId.toString()) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Add reply to discussion and change status to pending
        if (!doubt.discussion) {
            doubt.discussion = [];
        }

        // Migration for legacy doubts: If discussion is empty but there is a legacy reply, add it to discussion first
        if (doubt.discussion.length === 0 && doubt.reply) {
            doubt.discussion.push({
                sender: 'instructor',
                message: doubt.reply,
                timestamp: doubt.updatedAt || new Date()
            });
        }

        doubt.discussion.push({
            sender: 'student',
            message: message,
            timestamp: new Date()
        });
        doubt.status = 'pending';

        await doubt.save();

        res.status(200).json(doubt);
    } catch (error) {
        console.error('Error adding student reply:', error);
        res.status(500).json({ message: 'Error adding reply' });
    }
};
