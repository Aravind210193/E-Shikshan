const mongoose = require('mongoose');
const User = require('./src/models/User');
const Enrollment = require('./src/models/Enrollment');
const Course = require('./src/models/Course');
const sendEmail = require('./src/utils/sendEmail');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const triggerEmails = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            console.error("MONGODB_URI not found");
            return;
        }
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const studentEmail = 'bujjisekhar345@gmail.com';
        const user = await User.findOne({ email: studentEmail });

        if (!user) {
            console.log(`User ${studentEmail} not found`);
            return;
        }

        // Find enrollments for this user
        const enrollments = await Enrollment.find({ userId: user._id }).populate('courseId');
        console.log(`Found ${enrollments.length} enrollments for ${user.name}`);

        for (const enrollment of enrollments) {
            const course = enrollment.courseId;
            if (!course) {
                console.log(`Enrollment ${enrollment._id} has no course linked!`);
                continue;
            }

            console.log(`Processing emails for ${course.title}...`);

            // Email to student
            await sendEmail({
                to: user.email,
                subject: `You are enrolled in: ${course.title} - E-Shikshan`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2>Welcome to the course!</h2>
                        <p>Hi ${user.name},</p>
                        <p>You have successfully enrolled in <b>${course.title}</b>.</p>
                        <p>Your instructor for this course is assigned and ready to help you.</p>
                        <p>You can now access all the course content, videos, and assignments on your dashboard.</p>
                        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard" style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
                        <br/><br/>
                        <p>Happy learning!<br/>Team E-Shikshan</p>
                    </div>
                `
            });
            console.log(`Sent email to student: ${user.email}`);

            // Email to instructor
            if (course.instructorEmail) {
                await sendEmail({
                    to: course.instructorEmail,
                    subject: `New Student Enrolled: ${course.title}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2>New Enrollment Alert</h2>
                            <p>Hello Instructor,</p>
                            <p>A new student <b>${user.name}</b> (${user.email}) has enrolled in your course <b>${course.title}</b>.</p>
                            <p>Please check your dashboard to view their progress and assist them.</p>
                            <br/>
                            <p>Best Regards,<br/>E-Shikshan Platform</p>
                        </div>
                    `
                });
                console.log(`Sent email to instructor: ${course.instructorEmail}`);
            } else {
                console.log('No instructor email found for this course.');
            }
        }

    } catch (error) {
        console.error('Error triggering emails:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Done.');
    }
};

triggerEmails();
