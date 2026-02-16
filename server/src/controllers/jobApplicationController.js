const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const AdminJob = require('../models/AdminJob');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Admin = require('../models/Admin');
const sendEmail = require('../utils/sendEmail');

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Student)
exports.applyToJob = async (req, res) => {
    try {
        const studentId = req.user.id;
        const jobId = req.params.id;
        const { resumeUrl, coverLetter } = req.body;

        // Check if job exists in either Job or AdminJob
        let job = await AdminJob.findById(jobId);
        let jobSource = 'admin';

        if (!job) {
            job = await Job.findById(jobId);
            jobSource = 'public';
        }

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already applied
        const existingApplication = await JobApplication.findOne({ job: jobId, student: studentId });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // For admin jobs, we know the instructor. For public jobs, we might not have one assigned yet.
        // If public job doesn't have postedBy, we might need a default admin or handle it.
        const instructorId = job.postedBy;
        if (!instructorId && jobSource === 'admin') {
            return res.status(400).json({ message: 'This job does not have an assigned instructor' });
        }

        const application = await JobApplication.create({
            job: jobId,
            jobModel: jobSource === 'admin' ? 'AdminJob' : 'Job',
            student: studentId,
            instructor: instructorId || null, // Allow null for non-admin jobs if not set
            resumeUrl,
            coverLetter
        });

        // Notify Instructor
        if (instructorId) {
            const student = await User.findById(studentId);
            const instructor = await Admin.findById(instructorId);

            if (student && instructor) {
                // Platform Notification
                await Notification.create({
                    recipient: instructorId,
                    recipientType: 'Admin',
                    title: 'New Job Application',
                    message: `${student.name} has applied for the position: ${job.title}`,
                    data: {
                        applicationId: application._id,
                        jobId: job._id,
                        studentDetails: {
                            name: student.name,
                            email: student.email
                        }
                    },
                    type: 'job_application'
                });

                // Email Notification
                if (instructor.email) {
                    try {
                        const companyName = job.company || job.organization || 'E-Shikshan Partner';
                        await sendEmail({
                            to: instructor.email,
                            subject: `New Job Application: ${job.title}`,
                            html: `
                                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f9f9f9;">
                                    <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                        <div style="background: #a855f7; padding: 20px; text-align: center;">
                                            <h1 style="color: white; margin: 0;">New Job Application</h1>
                                        </div>
                                        <div style="padding: 20px;">
                                            <p>Hello <b>${instructor.name}</b>,</p>
                                            <p>A student has applied for your job posting: <b>${job.title}</b> at <b>${companyName}</b>.</p>
                                            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                                            <h3>Applicant Details:</h3>
                                            <ul>
                                                <li><b>Student:</b> ${student.name}</li>
                                                <li><b>Email:</b> ${student.email}</li>
                                                <li><b>Applied On:</b> ${new Date().toLocaleDateString()}</li>
                                            </ul>
                                            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                                <p style="margin: 0; font-size: 14px;"><b>Cover Letter Preview:</b></p>
                                                <p style="margin: 5px 0 0; font-size: 13px; color: #666;">${coverLetter ? coverLetter.substring(0, 150) + (coverLetter.length > 150 ? '...' : '') : 'No cover letter provided.'}</p>
                                            </div>
                                            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/job-instructor/applications" style="display: block; width: 200px; margin: 30px auto; padding: 12px; background: #a855f7; color: white; text-align: center; text-decoration: none; border-radius: 5px; font-weight: bold;">View Application</a>
                                        </div>
                                    </div>
                                </div>
                            `
                        });
                    } catch (emailErr) {
                        console.error('Failed to send job application email:', emailErr);
                    }
                }
            }
        }

        res.status(201).json({ success: true, application });
    } catch (error) {
        console.error('Job application error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get student's applications
// @route   GET /api/jobs/my-applications
// @access  Private (Student)
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find({ student: req.user.id })
            .populate('job', 'title company location type salary')
            .sort('-appliedAt');

        res.json({ success: true, applications });
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get applications for an instructor
// @route   GET /api/admin/jobs/applications
// @access  Private (Instructor/Admin)
exports.getInstructorApplications = async (req, res) => {
    try {
        const instructorId = req.admin.id;
        const applications = await JobApplication.find({ instructor: instructorId })
            .populate('job', 'title company')
            .populate('student', 'name email')
            .sort('-appliedAt');

        res.json({ success: true, applications });
    } catch (error) {
        console.error('Get instructor applications error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update application status
// @route   PUT /api/jobs/applications/admin/:id/status
// @access  Private (Instructor/Admin)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const { status, message } = req.body;
        const applicationId = req.params.id;

        const application = await JobApplication.findById(applicationId)
            .populate('job', 'title')
            .populate('student', 'name email');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.status = status;
        await application.save();

        // Notify Student
        await Notification.create({
            recipient: application.student._id,
            recipientType: 'User',
            title: `Job Application Update: ${application.job.title}`,
            message: `Your application for "${application.job.title}" has been updated to: ${status}${message ? `. Message: ${message}` : ''}`,
            type: 'job_application',
            relatedId: application.job._id
        });

        // Email Notification to Student
        try {
            await sendEmail({
                to: application.student.email,
                subject: `Update on your application: ${application.job.title}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #f4f4f4;">
                        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                            <div style="background: ${status === 'rejected' ? '#ef4444' : '#10b981'}; padding: 25px; text-align: center;">
                                <h1 style="color: white; margin: 0; font-size: 24px;">Application Update</h1>
                            </div>
                            <div style="padding: 30px;">
                                <p style="font-size: 16px;">Hi <b>${application.student.name}</b>,</p>
                                <p style="font-size: 15px; line-height: 1.6;">There has been an update to your application for the position: <b>${application.job.title}</b>.</p>
                                
                                <div style="margin: 25px 0; padding: 20px; background: #f8fafc; border-left: 4px solid ${status === 'rejected' ? '#ef4444' : '#10b981'}; border-radius: 4px;">
                                    <p style="margin: 0; font-size: 14px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">New Status</p>
                                    <p style="margin: 5px 0 0; font-size: 20px; color: #1e293b; font-weight: bold;">${status.charAt(0).toUpperCase() + status.slice(1)}</p>
                                    ${message ? `<p style="margin: 15px 0 0; font-size: 14px; color: #475569; border-top: 1px solid #e2e8f0; pt-15"><b>Instructor's Message:</b><br/>${message}</p>` : ''}
                                </div>

                                <p style="font-size: 14px; color: #64748b;">Visit your dashboard to see more details and track your applications.</p>
                                
                                <div style="text-align: center; margin-top: 30px;">
                                    <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/profile" style="display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Go to Dashboard</a>
                                </div>
                            </div>
                            <div style="background: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
                                © 2026 E-Shikshan. All rights reserved.
                            </div>
                        </div>
                    </div>
                `
            });
        } catch (emailErr) {
            console.error('Failed to send student application update email:', emailErr);
        }

        res.json({ success: true, application });
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete job application by instructor
// @route   DELETE /api/job-applications/admin/:id
// @access  Private (Instructor/Admin)
exports.deleteApplication = async (req, res) => {
    try {
        const applicationId = req.params.id;

        const application = await JobApplication.findById(applicationId)
            .populate('job', 'title company')
            .populate('student', 'name email');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Email Notification to Student before deletion
        try {
            if (application.student && application.student.email) {
                await sendEmail({
                    to: application.student.email,
                    subject: `Application Update: ${application.job.title}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; background-color: #fef2f2;">
                            <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                                <div style="background: #dc2626; padding: 25px; text-align: center;">
                                    <h1 style="color: white; margin: 0; font-size: 24px;">Application Status Update</h1>
                                </div>
                                <div style="padding: 30px;">
                                    <p style="font-size: 16px;">Hi <b>${application.student.name}</b>,</p>
                                    <p style="font-size: 15px; line-height: 1.6;">Your application for <b>${application.job.title}</b> at <b>${application.job.company || 'E-Shikshan Partner'}</b> has been removed from the system by the administrator.</p>
                                    
                                    <div style="margin: 25px 0; padding: 20px; background: #fef2f2; border-left: 4px solid #dc2626; border-radius: 4px;">
                                        <p style="margin: 0; font-size: 14px; color: #991b1b; font-weight: bold;">Status: REMOVED / CLOSED</p>
                                    </div>

                                    <p style="font-size: 14px; color: #64748b;">Visit the job portal to explore other exciting opportunities.</p>
                                    
                                    <div style="text-align: center; margin-top: 30px;">
                                        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/jobs" style="display: inline-block; padding: 12px 30px; background: #3b82f6; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">View New Jobs</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `
                });
            }
        } catch (emailErr) {
            console.error('Failed to send job application deletion email:', emailErr);
        }

        await JobApplication.findByIdAndDelete(applicationId);

        res.json({ success: true, message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Delete job application error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
