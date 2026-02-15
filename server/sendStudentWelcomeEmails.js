require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const connectDB = require('./src/config/db');
const sendEmail = require('./src/utils/sendEmail');

const sendWelcomeEmailsToExisting = async () => {
    try {
        await connectDB();

        console.log('\n🚀 Sending Welcome Emails to Existing Students...\n');

        // Get all students
        const students = await User.find({ role: 'student' });

        if (students.length === 0) {
            console.log('⚠️  No students found!');
            process.exit(0);
        }

        console.log(`Found ${students.length} students to email\n`);

        for (const student of students) {
            if (!student.email) {
                console.log(`❌ Skipping student without email: ${student.name}`);
                continue;
            }

            const emailHTML = `
                <!DOCTYPE html>
                <html>
                <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f4f7;">
                  <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <div style="background: #4f46e5; padding: 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to E-Shikshan! 🚀</h1>
                    </div>
                    <div style="padding: 30px; color: #333333; line-height: 1.6;">
                      <h2 style="color: #111827;">Hello ${student.name},</h2>
                      <p>We are thrilled to have you as part of our learning community!</p>
                      <p>Here at E-Shikshan, we are dedicated to helping you achieve your career goals with top-tier courses, hands-on projects, and expert mentorship.</p>
                      
                      <div style="background: #eef2ff; border-left: 4px solid #4f46e5; padding: 20px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>Your journey is already underway!</strong> Keep exploring new courses and building your future.</p>
                      </div>
                      
                      <p>If you have any questions, simply reply to this email - we're here to help.</p>
                      <p style="margin-top: 20px;">Happy Learning,<br><strong>The E-Shikshan Team</strong></p>
                    </div>
                    <div style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280; font-size: 12px;">
                      <p>© 2026 E-Shikshan Platform. All rights reserved.</p>
                    </div>
                  </div>
                </body>
                </html>
            `;

            console.log(`📤 Sending welcome email to ${student.name} (${student.email})...`);

            try {
                await sendEmail({
                    to: student.email,
                    subject: 'Welcome to E-Shikshan! 🚀',
                    html: emailHTML,
                    text: `Welcome to E-Shikshan, ${student.name}! We're thrilled to have you.`
                });
                console.log(`✅ Email sent successfully to ${student.name}`);
            } catch (err) {
                console.error(`❌ Failed to email ${student.name}:`, err.message);
            }

            // Small delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('\n✨ All emails processed!\n');
        process.exit(0);

    } catch (error) {
        console.error('❌ Script Error:', error);
        process.exit(1);
    }
};

sendWelcomeEmailsToExisting();
