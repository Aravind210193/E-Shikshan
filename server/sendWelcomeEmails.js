require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');
const Course = require('./src/models/Course');
const connectDB = require('./src/config/db');
const sendEmail = require('./src/utils/sendEmail');

const sendWelcomeEmails = async () => {
    try {
        await connectDB();

        console.log('\n🎉 Sending Welcome Emails to Instructors...\n');

        // Get all instructors (course_manager role)
        const instructors = await Admin.find({ role: 'course_manager', isActive: true });

        if (instructors.length === 0) {
            console.log('⚠️  No instructors found!');
            process.exit(0);
        }

        console.log(`Found ${instructors.length} instructors\n`);

        // Send welcome email to each instructor
        for (const instructor of instructors) {
            // Get courses assigned to this instructor
            const courses = await Course.find({
                instructorEmail: instructor.email
            }).select('title category');

            const courseCount = courses.length;

            const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
          <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            
            <!-- Celebration Header -->
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%); padding: 50px 30px; text-align: center; position: relative;">
              <div style="font-size: 60px; margin-bottom: 10px;">🎉</div>
              <h1 style="margin: 0; color: white; font-size: 32px; font-weight: 700; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                Welcome to E-Shikshan!
              </h1>
              <p style="margin: 15px 0 0 0; color: #e0e7ff; font-size: 16px; font-weight: 500;">
                Congratulations on joining our teaching team! 🎊
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 700;">
                Dear ${instructor.name}, 👋
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.8;">
                We are absolutely <strong style="color: #6366f1;">thrilled</strong> to have you as part of the <strong>E-Shikshan family</strong>! 
                Your expertise and passion for teaching will make a tremendous impact on our students' learning journey.
              </p>

              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-left: 4px solid #f59e0b; padding: 20px; margin: 25px 0; border-radius: 12px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.15);">
                <div style="font-size: 24px; margin-bottom: 10px;">🌟</div>
                <p style="margin: 0; color: #92400e; font-size: 15px; line-height: 1.7; font-weight: 500;">
                  <strong style="font-size: 16px;">You're now an official instructor at E-Shikshan!</strong><br>
                  You have been assigned <strong>${courseCount} course${courseCount > 1 ? 's' : ''}</strong> to teach and mentor students.
                </p>
              </div>

              <h3 style="margin: 30px 0 15px 0; color: #1f2937; font-size: 20px; font-weight: 700;">
                📚 Your Instructor Dashboard
              </h3>

              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 15px; line-height: 1.7;">
                We've created a powerful instructor portal just for you! Here's what you can do:
              </p>

              <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
                <ul style="margin: 0; padding-left: 20px; color: #374151; font-size: 15px; line-height: 2;">
                  <li><strong>📖 Manage Your Courses</strong> - View and update course content</li>
                  <li><strong>👥 Track Students</strong> - Monitor student enrollments and progress</li>
                  <li><strong>💬 Answer Doubts</strong> - Respond to student questions and queries</li>
                  <li><strong>📊 View Analytics</strong> - See course performance and engagement</li>
                  <li><strong>✏️ Create Content</strong> - Add videos, assignments, and projects</li>
                </ul>
              </div>

              <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 2px solid #60a5fa;">
                <h4 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px; font-weight: 700;">
                  🔐 Your Login Credentials
                </h4>
                <div style="background: white; border-radius: 8px; padding: 15px; margin: 10px 0;">
                  <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                  <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace;">${instructor.email}</p>
                </div>
                <div style="background: white; border-radius: 8px; padding: 15px; margin: 10px 0;">
                  <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Password</p>
                  <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 600; font-family: 'Courier New', monospace;">instructor123</p>
                </div>
                <p style="margin: 15px 0 0 0; color: #1e40af; font-size: 13px; line-height: 1.6;">
                  ⚠️ <strong>Important:</strong> Please change your password after your first login for security.
                </p>
              </div>

              <div style="text-align: center; margin: 35px 0;">
                <a href="http://localhost:5173/admin" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 17px; box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4); transition: all 0.3s;">
                  🚀 Access Your Dashboard Now
                </a>
              </div>

              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 20px; margin: 30px 0; border-left: 4px solid #22c55e;">
                <h4 style="margin: 0 0 12px 0; color: #166534; font-size: 16px; font-weight: 700;">
                  💡 Quick Start Tips
                </h4>
                <ol style="margin: 0; padding-left: 20px; color: #166534; font-size: 14px; line-height: 1.9;">
                  <li>Login to your instructor dashboard</li>
                  <li>Review your assigned courses</li>
                  <li>Check for any pending student doubts</li>
                  <li>Explore the course management features</li>
                  <li>Update your profile and preferences</li>
                </ol>
              </div>

              <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 15px; line-height: 1.7;">
                We're excited to see the amazing impact you'll make on our students' lives. If you have any questions or need assistance, 
                our support team is always here to help!
              </p>

              <div style="margin: 30px 0; padding: 20px; background: #fef3c7; border-radius: 12px; text-align: center;">
                <p style="margin: 0; color: #92400e; font-size: 16px; font-weight: 600;">
                  🎓 Together, let's make learning extraordinary! 🌟
                </p>
              </div>

              <p style="margin: 25px 0 0 0; color: #6b7280; font-size: 15px;">
                Warm regards,<br>
                <strong style="color: #1f2937; font-size: 16px;">The E-Shikshan Team</strong><br>
                <span style="color: #9ca3af; font-size: 13px;">Building the future of education, together 🚀</span>
              </p>
            </div>

            <!-- Footer -->
            <div style="background: linear-gradient(135deg, #1f2937 0%, #111827 100%); padding: 25px 30px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #e5e7eb; font-size: 14px; font-weight: 600;">
                🎓 E-Shikshan - Empowering Education
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.6;">
                © 2026 E-Shikshan. All rights reserved.<br>
                This is an automated welcome email.
              </p>
            </div>

          </div>
        </body>
        </html>
      `;

            // Send email
            console.log(`📤 Sending welcome email to ${instructor.name} (${instructor.email})...`);

            // Send to both instructor and bhuchiki12@gmail.com
            const recipients = [instructor.email, 'bhuchiki12@gmail.com'].join(', ');

            const result = await sendEmail({
                to: recipients,
                subject: '🎉 Welcome to E-Shikshan - Your Instructor Account is Ready!',
                html: emailHTML
            });

            if (result.success) {
                console.log(`✅ Welcome email sent successfully to ${instructor.name}`);
                console.log(`   📧 Also sent to: bhuchiki12@gmail.com\n`);
            } else {
                console.log(`❌ Failed to send email to ${instructor.name}: ${result.error}\n`);
            }

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log('\n🎊 All welcome emails sent successfully!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

sendWelcomeEmails();
