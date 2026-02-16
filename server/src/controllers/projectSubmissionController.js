const ProjectSubmission = require('../models/ProjectSubmission');
const Course = require('../models/Course');
const Notification = require('../models/Notification'); // Import Notification model
const User = require('../models/User'); // Import User model

// @desc    Submit a project
// @route   POST /api/project-submissions
// @access  Private/Student
exports.submitProject = async (req, res) => {
    try {
        const { courseId, roadmapId, workId, workType, title, submissionUrl, comments } = req.body;
        const userId = req.user._id;
        const studentName = req.user.name || 'Student';

        let instructorEmail = '';
        let contextTitle = '';
        let notificationType = 'project';

        if (workType === 'roadmap_project') {
            // Handle Roadmap Submission
            const Roadmap = require('../models/AdminRoadmap');
            const Admin = require('../models/Admin');
            const roadmap = await Roadmap.findById(roadmapId || courseId).populate('createdBy');
            if (!roadmap) {
                return res.status(404).json({ message: 'Roadmap not found' });
            }

            // Fetch instructor email from the creator of the roadmap
            if (roadmap.createdBy && roadmap.createdBy.email) {
                instructorEmail = roadmap.createdBy.email;
            } else {
                instructorEmail = 'roadmap@eshikshan.com'; // Fallback
            }

            contextTitle = roadmap.title;
            notificationType = 'roadmap';
        } else {
            // Handle Course Submission
            const course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            if (!course.instructorEmail) {
                return res.status(400).json({ message: 'This course does not have an assigned instructor to receive submissions.' });
            }
            instructorEmail = course.instructorEmail;
            contextTitle = course.title;
            notificationType = workType === 'project' ? 'Project' : 'Assignment';
        }

        const submission = await ProjectSubmission.create({
            course: workType === 'roadmap_project' ? null : courseId,
            roadmap: workType === 'roadmap_project' ? (roadmapId || courseId) : null,
            student: userId,
            instructorEmail: instructorEmail,
            workId,
            workType,
            title,
            submissionUrl,
            comments
        });

        // Create notification for instructor
        // For roadmap, we might need to find the user with that email first if we want to add notification to their feed
        // Or if 'recipientEmail' works directly in your Notification model logic (it seems it does)
        await Notification.create({
            recipientEmail: instructorEmail.toLowerCase(),
            sender: userId,
            type: 'general',
            title: `New ${notificationType} Submission`,
            message: `${studentName} submitted: ${title} in ${contextTitle}`,
            relatedId: submission._id
        });

        res.status(201).json({
            success: true,
            message: 'Project submitted successfully',
            data: submission
        });
    } catch (error) {
        console.error('Submit project error:', error);
        res.status(500).json({ message: 'Server error during submission' });
    }
};

// @desc    Get submissions for instructor
// @route   GET /api/project-submissions/instructor
// @access  Private/Instructor
exports.getInstructorSubmissions = async (req, res) => {
    try {
        let query = {};
        if (req.admin.role === 'roadmap_instructor') {
            // Find roadmaps created by this instructor
            const Roadmap = require('../models/AdminRoadmap');
            const myRoadmaps = await Roadmap.find({ createdBy: req.admin._id }).select('_id');
            const roadmapIds = myRoadmaps.map(r => r._id);

            // Filter submissions by these roadmaps
            query = {
                workType: 'roadmap_project',
                roadmap: { $in: roadmapIds }
            };
        } else if (req.admin.role === 'admin') {
            // Global admin sees everything
            query = {};
        } else {
            // Course instructors see their course submissions
            query = { instructorEmail: req.admin.email };
        }

        const submissions = await ProjectSubmission.find(query)
            .populate('student', 'name email')
            .populate('course', 'title') // Might be null for roadmap
            .populate('roadmap', 'title') // Populate roadmap title
            .sort('-createdAt');

        res.json({
            success: true,
            data: submissions
        });
    } catch (error) {
        console.error('Get instructor submissions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update submission status/feedback (grading)
// @route   PUT /api/project-submissions/:id
// @access  Private/Instructor
exports.updateSubmission = async (req, res) => {
    try {
        const { status, grade, feedback } = req.body;
        const submission = await ProjectSubmission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        submission.status = status || submission.status;
        submission.grade = grade || submission.grade;
        submission.feedback = feedback || submission.feedback;
        submission.reviewedAt = new Date();

        await submission.save();

        // If graded, update enrollment progress and award points
        if (status === 'graded') {
            try {
                const Enrollment = require('../models/Enrollment');
                const Course = require('../models/Course');
                const enrollment = await Enrollment.findOne({
                    userId: submission.student,
                    courseId: submission.course
                });

                if (enrollment) {
                    // Add workId to progress arrays if not already present
                    if (submission.workType === 'assignment') {
                        if (!enrollment.progress.assignmentsCompleted.includes(submission.workId)) {
                            enrollment.progress.assignmentsCompleted.push(submission.workId);
                        }
                    } else if (submission.workType === 'project') {
                        if (!enrollment.progress.projectsCompleted.includes(submission.workId)) {
                            enrollment.progress.projectsCompleted.push(submission.workId);
                        }
                    }

                    // Recalculate overall progress
                    const course = await Course.findById(submission.course);
                    if (course) {
                        const totalVideos = course.videoLectures?.length || 0;
                        const totalAssignments = course.assignments?.length || 0;
                        const totalProjects = course.projectsDetails?.length || 0;
                        const totalItems = totalVideos + totalAssignments + totalProjects;

                        if (totalItems > 0) {
                            const completedVideos = enrollment.progress.videosWatched?.length || 0;
                            const completedAssignments = enrollment.progress.assignmentsCompleted?.length || 0;
                            const completedProjects = enrollment.progress.projectsCompleted?.length || 0;
                            const completedItems = completedVideos + completedAssignments + completedProjects;

                            enrollment.progress.overallProgress = Math.min(100, Math.round((completedItems / totalItems) * 100));
                        }
                    }

                    await enrollment.save();
                }

                // Award points
                const { trackSubmissionGraded } = require('../utils/gamification');
                await trackSubmissionGraded(submission.student, {
                    courseId: submission.course,
                    submissionId: submission._id,
                    title: submission.title
                });
            } catch (err) {
                console.error('Failed to update progress/points for submission grading:', err);
            }
        }

        res.json({
            success: true,
            message: 'Submission updated successfully',
            data: submission
        });
    } catch (error) {
        console.error('Update submission error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Reply to submission comment
// @route   POST /api/project-submissions/:id/reply
// @access  Private/Instructor
exports.replyToSubmission = async (req, res) => {
    try {
        const { reply } = req.body;
        const submission = await ProjectSubmission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        submission.instructorReply = reply;
        submission.instructorRepliedAt = new Date();
        await submission.save();

        // Populate student info for notification
        const student = await User.findById(submission.student);
        const course = await Course.findById(submission.course);

        if (student) {
            await Notification.create({
                recipientEmail: student.email.toLowerCase(),
                sender: req.admin ? req.admin._id : null, // Assuming instructor is admin
                type: 'general',
                title: `Instructor Reply on ${submission.workType === 'project' ? 'Project' : 'Assignment'}`,
                message: `Instructor replied to your submission for ${submission.title} in ${course ? course.title : 'course'}: "${reply.substring(0, 50)}${reply.length > 50 ? '...' : ''}"`,
                relatedId: submission._id
            });
        }

        res.json({
            success: true,
            message: 'Reply sent successfully',
            data: submission
        });
    } catch (error) {
        console.error('Reply to submission error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete submission
// @route   DELETE /api/project-submissions/:id
// @access  Private/Instructor or Student
exports.deleteSubmission = async (req, res) => {
    try {
        const submission = await ProjectSubmission.findById(req.params.id);

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        // Allow deletion by the student who submitted it or the instructor/admin
        if (req.admin) {
            // Admin can delete any submission
            await ProjectSubmission.findByIdAndDelete(req.params.id);
        } else if (req.user) {
            // Student can only delete if it's their own AND it's still pending
            if (submission.student.toString() !== req.user.id.toString()) {
                return res.status(403).json({ message: 'You can only delete your own submissions' });
            }

            if (submission.status !== 'pending') {
                return res.status(400).json({ message: 'Cannot delete a submission that has already been reviewed' });
            }

            await ProjectSubmission.findByIdAndDelete(req.params.id);
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.json({
            success: true,
            message: 'Submission deleted successfully'
        });
    } catch (error) {
        console.error('Delete submission error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
// @desc    Get student submissions
// @route   GET /api/project-submissions/student
// @access  Private/Student
exports.getStudentSubmissions = async (req, res) => {
    try {
        const studentId = req.user._id;

        const submissions = await ProjectSubmission.find({ student: studentId })
            .populate('course', 'title instructor')
            .sort('-createdAt');

        res.json({
            success: true,
            data: submissions
        });
    } catch (error) {
        console.error('Get student submissions error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
