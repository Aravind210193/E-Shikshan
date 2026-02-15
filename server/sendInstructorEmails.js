require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
const Course = require('./src/models/Course');
const connectDB = require('./src/config/db');
const sendEmail = require('./src/utils/sendEmail');

const sendInstructorNotifications = async () => {
    try {
        await connectDB();

        console.log('\n📧 Sending Course Assignment Notifications to Instructors...\n');

        // Get all instructors (course_manager role)
        const instructors = await Admin.find({ role: 'course_manager', isActive: true });

        if (instructors.length === 0) {
            console.log('⚠️  No instructors found!');
            process.exit(0);
        }

        console.log(`Found ${instructors.length} instructors\n`);

        // Send email to each instructor
        for (const instructor of instructors) {
            // Get courses assigned to this instructor
            const courses = await Course.find({
                instructorEmail: instructor.email
            }).select('title category level students');

            if (courses.length === 0) {
                console.log(`⚠️  No courses assigned to ${instructor.name} (${instructor.email})`);
                continue;
            }

            // Create course list HTML
            const courseListHTML = courses.map((course, index) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px; text-align: center; font-weight: 600; color: #6366f1;">${index + 1}</td>
          <td style="padding: 12px; font-weight: 600; color: #1f2937;">${course.title}</td>
          <td style="padding: 12px; color: #6b7280;">${course.category}</td>
          <td style="padding: 12px;">
            <span style="padding: 4px 12px; background: ${course.level === 'Beginner' ? '#dcfce7' :
                    course.level === 'Intermediate' ? '#fef3c7' : '#fee2e2'
                }; color: ${course.level === 'Beginner' ? '#166534' :
                    course.level === 'Intermediate' ? '#92400e' : '#991b1b'
                }; border-radius: 9999px; font-size: 12px; font-weight: 600;">
              ${course.level}
            </span>
          </td>
          <td style="padding: 12px; text-align: center; color: #6b7280;">${course.students || 0}</td>
        </tr>
      `).join('');

            const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">🎓 E-Shikshan</h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">Learning Management Platform</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 700;">
                Hello ${instructor.name}! 👋
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                We're excited to inform you that <strong>${courses.length} course${courses.length > 1 ? 's have' : ' has'}</strong> been assigned to you on the E-Shikshan platform.
              </p>

              <div style="background: #f9fafb; border-left: 4px solid #6366f1; padding: 16px 20px; margin: 20px 0; border-radius: 8px;">
                <p style="margin: 0; color: #374151; font-size: 14px;">
                  <strong>📚 Total Courses:</strong> ${courses.length}<br>
                  <strong>👤 Your Role:</strong> Course Instructor<br>
                  <strong>📧 Login Email:</strong> ${instructor.email}
                </p>
              </div>

              <h3 style="margin: 30px 0 15px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                Your Assigned Courses:
              </h3>

              <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background: #f9fafb;">
                    <th style="padding: 12px; text-align: center; font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase;">#</th>
                    <th style="padding: 12px; text-align: left; font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase;">Course Name</th>
                    <th style="padding: 12px; text-align: left; font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase;">Category</th>
                    <th style="padding: 12px; text-align: left; font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase;">Level</th>
                    <th style="padding: 12px; text-align: center; font-weight: 600; color: #6b7280; font-size: 12px; text-transform: uppercase;">Students</th>
                  </tr>
                </thead>
                <tbody>
                  ${courseListHTML}
                </tbody>
              </table>

              <div style="margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; border: 1px solid #bfdbfe;">
                <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                  🚀 Next Steps:
                </h4>
                <ol style="margin: 10px 0 0 0; padding-left: 20px; color: #1e3a8a; font-size: 14px; line-height: 1.8;">
                  <li>Login to the instructor portal using your credentials</li>
                  <li>Review your assigned courses and course materials</li>
                  <li>Respond to student doubts and questions</li>
                  <li>Monitor student progress and engagement</li>
                </ol>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:5173/admin" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);">
                  Access Instructor Portal →
                </a>
              </div>

              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                If you have any questions or need assistance, please don't hesitate to reach out to our support team.
              </p>

              <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px;">
                Best regards,<br>
                <strong style="color: #1f2937;">E-Shikshan Team</strong>
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © 2026 E-Shikshan. All rights reserved.<br>
                This is an automated notification. Please do not reply to this email.
              </p>
            </div>

          </div>
        </body>
        </html>
      `;

            // Send email
            console.log(`📤 Sending email to ${instructor.name} (${instructor.email})...`);

            const result = await sendEmail({
                to: instructor.email,
                subject: `🎓 Course Assignment Notification - ${courses.length} Course${courses.length > 1 ? 's' : ''} Assigned`,
                html: emailHTML
            });

            if (result.success) {
                console.log(`✅ Email sent successfully to ${instructor.name}\n`);
            } else {
                console.log(`❌ Failed to send email to ${instructor.name}: ${result.error}\n`);
            }

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log('\n✅ All notifications sent!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

sendInstructorNotifications();
