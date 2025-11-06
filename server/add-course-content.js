const mongoose = require('mongoose');
const Course = require('./src/models/Course');
require('dotenv').config();

// Function to get videos based on course category
const getVideosForCourse = (courseName, category) => {
  // Default educational videos
  const defaultVideos = [
    { title: "Introduction to the Course", duration: "12:30", url: "https://www.youtube.com/watch?v=yfoY53QXEnI", free: true, order: 1 },
    { title: "Getting Started with Basics", duration: "18:45", url: "https://www.youtube.com/watch?v=kqtD5dpn9C8", free: true, order: 2 },
    { title: "Core Concepts Explained", duration: "24:15", url: "https://www.youtube.com/watch?v=rfscVS0vtbw", free: false, order: 3 },
    { title: "Practical Implementation", duration: "28:30", url: "https://www.youtube.com/watch?v=8mAITcNt710", free: false, order: 4 },
    { title: "Advanced Techniques", duration: "22:20", url: "https://www.youtube.com/watch?v=PkZNo7MFNFg", free: false, order: 5 },
    { title: "Real World Projects", duration: "35:00", url: "https://www.youtube.com/watch?v=gfkTfcpWqAY", free: false, order: 6 },
    { title: "Best Practices & Tips", duration: "19:10", url: "https://www.youtube.com/watch?v=1PnVor36_40", free: false, order: 7 },
    { title: "Common Mistakes to Avoid", duration: "16:40", url: "https://www.youtube.com/watch?v=i_LwzRVP7bg", free: false, order: 8 },
  ];

  // Category-specific videos
  if (category === 'Computer Science' || courseName.includes('Computer Science')) {
    return [
      { title: "CS Fundamentals Introduction", duration: "15:30", url: "https://www.youtube.com/watch?v=zOjov-2OZ0E", free: true, order: 1 },
      { title: "Programming Basics", duration: "20:45", url: "https://www.youtube.com/watch?v=YoXxevp1WRQ", free: true, order: 2 },
      { title: "Data Structures Overview", duration: "25:15", url: "https://www.youtube.com/watch?v=RBSGKlAvoiM", free: false, order: 3 },
      { title: "Algorithms Deep Dive", duration: "30:30", url: "https://www.youtube.com/watch?v=8hly31xKli0", free: false, order: 4 },
      { title: "Problem Solving Strategies", duration: "22:20", url: "https://www.youtube.com/watch?v=GKgAVjJxh9w", free: false, order: 5 },
      { title: "Interview Preparation", duration: "28:00", url: "https://www.youtube.com/watch?v=Qmt0QwzEmh0", free: false, order: 6 },
    ];
  }

  if (category === 'Data Science' || courseName.includes('Machine Learning') || courseName.includes('Data')) {
    return [
      { title: "Data Science Introduction", duration: "18:30", url: "https://www.youtube.com/watch?v=ua-CiDNNj30", free: true, order: 1 },
      { title: "Python for Data Science", duration: "25:45", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI", free: true, order: 2 },
      { title: "Data Analysis Fundamentals", duration: "28:15", url: "https://www.youtube.com/watch?v=GPVsHOlRBBI", free: false, order: 3 },
      { title: "Machine Learning Basics", duration: "32:30", url: "https://www.youtube.com/watch?v=ukzFI9rgwfU", free: false, order: 4 },
      { title: "Data Visualization", duration: "20:20", url: "https://www.youtube.com/watch?v=_YWwU-gJI5U", free: false, order: 5 },
      { title: "ML Model Deployment", duration: "26:00", url: "https://www.youtube.com/watch?v=mrExsjcvF4o", free: false, order: 6 },
    ];
  }

  if (category === 'Web Development' || courseName.includes('Web') || courseName.includes('JavaScript')) {
    return [
      { title: "Web Development Roadmap", duration: "16:30", url: "https://www.youtube.com/watch?v=ysEN5RaKOlA", free: true, order: 1 },
      { title: "HTML & CSS Essentials", duration: "22:45", url: "https://www.youtube.com/watch?v=G3e-cpL7ofc", free: true, order: 2 },
      { title: "JavaScript Fundamentals", duration: "28:15", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c", free: false, order: 3 },
      { title: "React.js Complete Guide", duration: "35:30", url: "https://www.youtube.com/watch?v=SqcY0GlETPk", free: false, order: 4 },
      { title: "Backend Development", duration: "30:20", url: "https://www.youtube.com/watch?v=fgTGADljAeg", free: false, order: 5 },
      { title: "Deploying Web Apps", duration: "24:00", url: "https://www.youtube.com/watch?v=oykl1Ih9pMg", free: false, order: 6 },
    ];
  }

  if (category === 'Cloud Computing' || courseName.includes('AWS') || courseName.includes('Cloud')) {
    return [
      { title: "Cloud Computing Introduction", duration: "20:30", url: "https://www.youtube.com/watch?v=M988_fsOSWo", free: true, order: 1 },
      { title: "AWS Fundamentals", duration: "25:45", url: "https://www.youtube.com/watch?v=ulprqHHWlng", free: true, order: 2 },
      { title: "Cloud Architecture", duration: "30:15", url: "https://www.youtube.com/watch?v=dH0yz-Osy54", free: false, order: 3 },
      { title: "Deploying on AWS", duration: "28:30", url: "https://www.youtube.com/watch?v=IpxYVcydzHw", free: false, order: 4 },
      { title: "Cloud Security", duration: "22:20", url: "https://www.youtube.com/watch?v=pLhSfpX8yMA", free: false, order: 5 },
      { title: "Cost Optimization", duration: "18:00", url: "https://www.youtube.com/watch?v=1Z4BfRj2FiU", free: false, order: 6 },
    ];
  }

  if (category === 'Design' || courseName.includes('UX') || courseName.includes('UI')) {
    return [
      { title: "UX Design Fundamentals", duration: "18:30", url: "https://www.youtube.com/watch?v=ZaBa3I1hToU", free: true, order: 1 },
      { title: "UI Design Principles", duration: "22:45", url: "https://www.youtube.com/watch?v=_K06Dni-RE4", free: true, order: 2 },
      { title: "Design Thinking Process", duration: "26:15", url: "https://www.youtube.com/watch?v=_r0VX-aU_T8", free: false, order: 3 },
      { title: "Prototyping in Figma", duration: "32:30", url: "https://www.youtube.com/watch?v=FTFaQWZBqQ8", free: false, order: 4 },
      { title: "User Research Methods", duration: "24:20", url: "https://www.youtube.com/watch?v=QwF9a56WFWA", free: false, order: 5 },
      { title: "Portfolio Building", duration: "20:00", url: "https://www.youtube.com/watch?v=oKJRl67w9wI", free: false, order: 6 },
    ];
  }

  return defaultVideos;
};

// Dummy assignments data
const dummyAssignments = [
  {
    title: "Assignment 1: Getting Started",
    description: "Complete the introductory exercises to understand the basics",
    difficulty: "Easy",
    points: 10,
    instructions: "Follow the step-by-step guide in the course materials and submit your work.",
    deadline: "1 week"
  },
  {
    title: "Assignment 2: Core Implementation",
    description: "Build a small project using core concepts learned in the course",
    difficulty: "Medium",
    points: 20,
    instructions: "Create a functional implementation demonstrating your understanding of the core concepts.",
    deadline: "2 weeks"
  },
  {
    title: "Assignment 3: Advanced Challenge",
    description: "Solve complex problems using advanced techniques",
    difficulty: "Hard",
    points: 30,
    instructions: "Apply advanced techniques to solve the given problem set. Include documentation.",
    deadline: "2 weeks"
  },
  {
    title: "Assignment 4: Final Project",
    description: "Create a comprehensive project showcasing all learned skills",
    difficulty: "Hard",
    points: 40,
    instructions: "Build a complete application/solution that demonstrates mastery of all course topics.",
    deadline: "3 weeks"
  }
];

// Dummy resources/PDFs
const dummyResources = [
  { title: "Course Handbook", url: "/pdfs/course-handbook.pdf" },
  { title: "Quick Reference Guide", url: "/pdfs/quick-reference.pdf" },
  { title: "Cheat Sheet", url: "/pdfs/cheat-sheet.pdf" },
  { title: "Additional Reading Materials", url: "/pdfs/reading-materials.pdf" },
  { title: "Practice Problems", url: "/pdfs/practice-problems.pdf" }
];

async function addCourseContent() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Fetch all courses
    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses`);

    let updatedCount = 0;

    for (const course of courses) {
      // Get category-specific videos
      const categoryVideos = getVideosForCourse(course.title, course.category);

      // Always update videos with category-specific ones
      course.videoLectures = categoryVideos;

      if (!course.assignments || course.assignments.length === 0) {
        course.assignments = dummyAssignments;
      }

      // Add resources field if it doesn't exist
      if (!course.resources || course.resources.length === 0) {
        course.resources = dummyResources;
      }

      // Update total counts
      course.totalVideos = course.videoLectures.length;
      course.totalQuizzes = course.assignments.length;

      await course.save();
      updatedCount++;
      console.log(`✅ Updated: ${course.title} (${course.category}) - ${course.videoLectures.length} videos`);
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} courses with category-specific video lectures!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addCourseContent();
