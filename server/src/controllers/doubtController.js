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
        const { reply } = req.body;

        const doubt = await Doubt.findByIdAndUpdate(
            id,
            { reply: reply, status: 'resolved' },
            { new: true }
        ).populate('student', 'name email').populate('course', 'title');

        if (!doubt) {
            return res.status(404).json({ message: 'Doubt not found' });
        }

        // Create notification for student
        if (doubt.student && doubt.student.email) {
            await Notification.create({
                recipientEmail: doubt.student.email.toLowerCase(),
                type: 'doubt',
                relatedId: doubt._id,
                title: 'Doubt Resolved',
                message: `Your doubt in ${doubt.course?.title || 'a course'} has been resolved. Reply: "${reply.substring(0, 50)}${reply.length > 50 ? '...' : ''}"`
            });
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
