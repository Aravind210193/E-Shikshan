const mongoose = require('mongoose');
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const Enrollment = require('./src/models/Enrollment');
const ProjectSubmission = require('./src/models/ProjectSubmission');
const Doubt = require('./src/models/Doubt');
const Notification = require('./src/models/Notification');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const studentEmail = 'bujjisekhar345@gmail.com';
const instructorEmail = 'o210900@rguktong.ac.in';

const setupData = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb+srv://raja:eshikshansarasa@cluster0.wsbbkpp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
        await mongoose.connect(uri);
        console.log('Connected to DB');

        const student = await User.findOne({ email: studentEmail });
        if (!student) {
            console.log(`Student ${studentEmail} not found`);
            return;
        }
        console.log(`Student found: ${student.name} (${student._id})`);

        // Find courses by instructor
        let courses = await Course.find({ instructorEmail: instructorEmail });

        if (courses.length === 0) {
            const instructor = await User.findOne({ email: instructorEmail });
            if (instructor) {
                courses = await Course.find({ instructor: instructor._id });
            }
        }

        console.log(`Found ${courses.length} courses for instructor ${instructorEmail}`);

        if (courses.length === 0) {
            console.log("No courses found. Cannot enroll.");
            return;
        }

        const coursesToEnroll = courses.slice(0, 2);

        for (const course of coursesToEnroll) {
            // Enroll student
            let enrollment = await Enrollment.findOne({ userId: student._id, courseId: course._id });
            if (!enrollment) {
                enrollment = await Enrollment.create({
                    userId: student._id,
                    courseId: course._id,
                    paymentStatus: 'free',
                    status: 'active',
                    enrolledAt: new Date(),
                    progress: {
                        overallProgress: 0,
                        videosWatched: [],
                        assignmentsCompleted: [],
                        projectsCompleted: []
                    },
                    userDetails: {
                        fullName: student.name,
                        email: student.email,
                        phone: student.phone
                    }
                });
                console.log(`Enrolled student in ${course.title} (Enrollment ID: ${enrollment._id})`);

                // Add to user's enrolledCourses array
                // The schema expects objects with courseId and enrollmentId
                const existingEntry = student.enrolledCourses.find(entry => entry.courseId.toString() === course._id.toString());
                if (!existingEntry) {
                    student.enrolledCourses.push({
                        courseId: course._id,
                        enrollmentId: enrollment._id, // Adding this
                        enrolledAt: new Date(),
                        status: 'active'
                    });
                    await student.save();
                }

                // Simulate sending email (logs only)
                console.log(`[EMAIL SIMULATION] Sent enrollment email to ${student.email} for ${course.title}`);
                if (course.instructorEmail) {
                    console.log(`[EMAIL SIMULATION] Sent new student notification to ${course.instructorEmail}`);
                }

            } else {
                console.log(`Student already enrolled in ${course.title}`);
                // Ensure user model is updated correctly even if enrollment exists
                const existingEntry = student.enrolledCourses.find(entry => entry.courseId.toString() === course._id.toString());
                if (!existingEntry) {
                    student.enrolledCourses.push({
                        courseId: course._id,
                        enrollmentId: enrollment._id,
                        enrolledAt: new Date(),
                        status: 'active'
                    });
                    await student.save();
                    console.log(`Updated user model for existing enrollment in ${course.title}`);
                }
            }
        }

        // Submit Assignment and Project for the first course
        if (coursesToEnroll.length > 0) {
            const firstCourse = coursesToEnroll[0];

            // Check for existing assignment submission to avoid duplicates
            const existingAssignment = await ProjectSubmission.findOne({
                course: firstCourse._id,
                student: student._id,
                workType: 'assignment'
            });

            if (!existingAssignment) {
                const assignmentSubmission = await ProjectSubmission.create({
                    course: firstCourse._id,
                    student: student._id,
                    instructorEmail: instructorEmail,
                    workId: 'assignment_001',
                    workType: 'assignment',
                    title: 'Assignment 1 Submission',
                    submissionUrl: 'https://github.com/example/assignment',
                    comments: 'Completed the assignment tasks.',
                    status: 'pending'
                });
                console.log(`Submitted assignment for ${firstCourse.title}`);

                // Create notification for instructor
                await Notification.create({
                    recipientEmail: instructorEmail.toLowerCase(),
                    sender: student._id,
                    type: 'general',
                    title: 'New Assignment Submission',
                    message: `${student.name} submitted an assignment in ${firstCourse.title}`,
                    relatedId: assignmentSubmission._id
                });
            } else {
                console.log(`Assignment already submitted for ${firstCourse.title}`);
            }


            // Check for existing project submission
            const existingProject = await ProjectSubmission.findOne({
                course: firstCourse._id,
                student: student._id,
                workType: 'project'
            });

            if (!existingProject) {
                const projectSubmission = await ProjectSubmission.create({
                    course: firstCourse._id,
                    student: student._id,
                    instructorEmail: instructorEmail,
                    workId: 'project_001',
                    workType: 'project',
                    title: 'Final Project Submission',
                    submissionUrl: 'https://github.com/example/project',
                    comments: 'Project completed with all requirements.',
                    status: 'pending'
                });
                console.log(`Submitted project for ${firstCourse.title}`);

                await Notification.create({
                    recipientEmail: instructorEmail.toLowerCase(),
                    sender: student._id,
                    type: 'general',
                    title: 'New Project Submission',
                    message: `${student.name} submitted a project in ${firstCourse.title}`,
                    relatedId: projectSubmission._id
                });
            } else {
                console.log(`Project already submitted for ${firstCourse.title}`);
            }
        }


    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
        console.log('Script completed');
    }
};

setupData();
