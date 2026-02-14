const mongoose = require('mongoose');
const Course = require('./src/models/Course');
const sendEmail = require('./src/utils/sendEmail');
require('dotenv').config();

const addCourseAndSendEmail = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Course data
        const courseData = {
            title: 'AI and ML Fundamentals',
            category: 'Artificial Intelligence',
            level: 'Intermediate',
            duration: '12 weeks',
            status: 'active',
            description: 'Comprehensive course covering Artificial Intelligence and Machine Learning fundamentals, including neural networks, deep learning, and practical applications.',
            instructor: 'Raja',
            instructorEmail: 'o210900@rguktong.ac.in',
            instructorBio: 'Experienced AI/ML instructor with expertise in deep learning and neural networks.',
            thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
            price: 'Paid',
            priceAmount: 4999,
            skills: ['Python', 'TensorFlow', 'Machine Learning', 'Deep Learning', 'Neural Networks'],
            prerequisites: ['Basic Python', 'Mathematics', 'Statistics'],
            whatYoullLearn: [
                'Fundamentals of Artificial Intelligence',
                'Machine Learning algorithms and techniques',
                'Deep Learning and Neural Networks',
                'Practical AI/ML applications',
                'Model training and optimization'
            ],
            syllabus: [
                {
                    title: 'Introduction to AI and ML',
                    topics: ['What is AI?', 'What is ML?', 'Types of ML', 'AI vs ML vs DL'],
                    duration: '2 weeks'
                },
                {
                    title: 'Machine Learning Fundamentals',
                    topics: ['Supervised Learning', 'Unsupervised Learning', 'Regression', 'Classification'],
                    duration: '3 weeks'
                },
                {
                    title: 'Deep Learning',
                    topics: ['Neural Networks', 'CNNs', 'RNNs', 'Transfer Learning'],
                    duration: '4 weeks'
                },
                {
                    title: 'Practical Applications',
                    topics: ['Image Recognition', 'NLP', 'Recommendation Systems', 'Model Deployment'],
                    duration: '3 weeks'
                }
            ],
            certificate: true,
            language: 'English',
            subtitles: ['English', 'Hindi']
        };

        console.log('📝 Creating course:', courseData.title);

        // Create course
        const course = await Course.create(courseData);
        console.log('✅ Course created successfully with ID:', course._id);

        // Send email notification
        console.log('📧 Sending email to:', courseData.instructorEmail);

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
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); padding: 40px 30px; text-align: center;">
            <div style="font-size: 50px; margin-bottom: 10px;">📚</div>
            <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">New Course Assigned!</h1>
            <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 14px;">E-Shikshan Learning Platform</p>
          </div>

          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 700;">
              Hello ${courseData.instructor}! 👋
            </h2>
            
            <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.7;">
              Great news! A new course has been assigned to you on the E-Shikshan platform.
            </p>

            <!-- Course Details Card -->
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-left: 4px solid #3b82f6; padding: 20px; margin: 25px 0; border-radius: 12px;">
              <h3 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px; font-weight: 700;">
                📖 Course Details
              </h3>
              <p style="margin: 0; color: #1f2937; font-size: 14px;"><strong>Title:</strong> ${courseData.title}</p>
              <p style="margin: 8px 0 0 0; color: #1f2937; font-size: 14px;"><strong>Category:</strong> ${courseData.category}</p>
              <p style="margin: 8px 0 0 0; color: #1f2937; font-size: 14px;"><strong>Level:</strong> ${courseData.level}</p>
              <p style="margin: 8px 0 0 0; color: #1f2937; font-size: 14px;"><strong>Duration:</strong> ${courseData.duration}</p>
              <p style="margin: 8px 0 0 0; color: #1f2937; font-size: 14px;"><strong>Status:</strong> <span style="color: #16a34a; font-weight: 600;">Active</span></p>
            </div>

            <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <h4 style="margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 700;">
                📝 Description
              </h4>
              <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.7;">
                ${courseData.description}
              </p>
            </div>

            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; padding: 20px; margin: 30px 0; border-left: 4px solid #22c55e;">
              <h4 style="margin: 0 0 12px 0; color: #166534; font-size: 16px; font-weight: 700;">
                🎯 Next Steps
              </h4>
              <ol style="margin: 0; padding-left: 20px; color: #166534; font-size: 14px; line-height: 1.9;">
                <li>Login to your instructor dashboard</li>
                <li>Review the course details and requirements</li>
                <li>Add course content (videos, assignments, projects)</li>
                <li>Set up the course syllabus and learning objectives</li>
                <li>Engage with students and answer their doubts</li>
              </ol>
            </div>

            <div style="text-align: center; margin: 35px 0;">
              <a href="http://localhost:5173/instructor/dashboard" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 17px; box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);">
                🚀 Access Instructor Dashboard
              </a>
            </div>

            <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.7;">
              If you have any questions about this course or need assistance, please don't hesitate to reach out to the admin team.
            </p>

            <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px;">
              Best regards,<br>
              <strong style="color: #1f2937;">E-Shikshan Admin Team</strong>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
              © 2026 E-Shikshan. All rights reserved.<br>
              This is an automated notification from the E-Shikshan platform.
            </p>
          </div>

        </div>
      </body>
      </html>
    `;

        const emailResult = await sendEmail({
            to: courseData.instructorEmail,
            subject: `🎓 New Course Assigned: ${courseData.title}`,
            html: emailHTML
        });

        if (emailResult.success) {
            console.log('✅ Email sent successfully to:', courseData.instructorEmail);
        } else {
            console.log('❌ Email failed:', emailResult.error);
        }

        console.log('\n🎉 Course added and email sent successfully!');
        console.log('📊 Course ID:', course._id);
        console.log('👨‍🏫 Instructor:', courseData.instructor);
        console.log('📧 Email:', courseData.instructorEmail);

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    }
};

// Run the script
addCourseAndSendEmail();
