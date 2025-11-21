const fs = require('fs');
const path = require('path');

// Read the semester data
const dataPath = path.join(__dirname, 'client', 'src', 'data', 'semesterData.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Content templates for different subject types
const contentTemplates = {
  mathematics: {
    videos: [
      { title: "Introduction to {topic}", duration: "32:45", desc: "Fundamentals and basic concepts of {topic}" },
      { title: "{topic} - Solved Examples", duration: "28:30", desc: "Step-by-step solutions to key problems" },
      { title: "Advanced {topic} Techniques", duration: "24:15", desc: "Advanced methods and problem-solving strategies" },
      { title: "{topic} Applications", duration: "35:20", desc: "Real-world applications and engineering examples" },
      { title: "{topic} Practice Problems", duration: "26:40", desc: "Practice session with various difficulty levels" }
    ],
    pdfs: [
      { title: "{topic} - Complete Notes", pages: 65, size: "5.2 MB", desc: "Comprehensive notes covering all concepts" },
      { title: "{topic} Formula Sheet", pages: 12, size: "1.8 MB", desc: "Quick reference for important formulas" },
      { title: "{topic} Practice Problems", pages: 45, size: "3.5 MB", desc: "100+ solved and unsolved problems" },
      { title: "{topic} Previous Year Questions", pages: 38, size: "3.2 MB", desc: "Last 10 years question papers with solutions" }
    ],
    assignments: [
      { title: "Basic {topic} Problems", desc: "Solve 15 fundamental problems", maxScore: 30, difficulty: "Easy" },
      { title: "Intermediate {topic} Assignment", desc: "Mixed difficulty level problems", maxScore: 35, difficulty: "Medium" },
      { title: "{topic} Application Problems", desc: "Engineering application-based problems", maxScore: 40, difficulty: "Hard" }
    ],
    quizzes: [
      { title: "{topic} Fundamentals Quiz", desc: "Test your basic understanding", questions: 20, duration: "25 mins", passingScore: 75 },
      { title: "{topic} Advanced Test", desc: "Comprehensive assessment", questions: 30, duration: "40 mins", passingScore: 80 }
    ]
  },
  physics: {
    videos: [
      { title: "{topic} - Theory and Concepts", duration: "30:20", desc: "Fundamental physics principles and theory" },
      { title: "{topic} Experiments", duration: "25:15", desc: "Laboratory demonstrations and experiments" },
      { title: "{topic} Problem Solving", duration: "32:40", desc: "Numerical problems and solution techniques" },
      { title: "{topic} in Engineering", duration: "28:30", desc: "Engineering applications and real-world uses" },
      { title: "{topic} Advanced Topics", duration: "26:50", desc: "Advanced concepts and modern applications" }
    ],
    pdfs: [
      { title: "{topic} - Lecture Notes", pages: 58, size: "4.8 MB", desc: "Complete theory with derivations" },
      { title: "{topic} Lab Manual", pages: 35, size: "3.2 MB", desc: "Experiment procedures and observations" },
      { title: "{topic} Numerical Problems", pages: 42, size: "3.6 MB", desc: "Solved numerical problems with explanations" },
      { title: "{topic} Reference Material", pages: 70, size: "6.0 MB", desc: "Additional reading and advanced topics" }
    ],
    assignments: [
      { title: "Theory Questions - {topic}", desc: "Conceptual questions and derivations", maxScore: 30, difficulty: "Medium" },
      { title: "Numerical Problems - {topic}", desc: "Solve physics numericals", maxScore: 35, difficulty: "Hard" },
      { title: "Lab Report - {topic}", desc: "Complete lab experiment and report", maxScore: 25, difficulty: "Easy" }
    ],
    quizzes: [
      { title: "{topic} Concept Quiz", desc: "Test on theory and concepts", questions: 25, duration: "30 mins", passingScore: 75 },
      { title: "{topic} Numerical Test", desc: "Problem-solving assessment", questions: 20, duration: "35 mins", passingScore: 80 }
    ]
  },
  programming: {
    videos: [
      { title: "Introduction to {topic}", duration: "35:20", desc: "Getting started with {topic} fundamentals" },
      { title: "{topic} Syntax and Basics", duration: "28:45", desc: "Core syntax, keywords, and basic programs" },
      { title: "{topic} - Practical Examples", duration: "32:15", desc: "Live coding with real-world examples" },
      { title: "Advanced {topic} Concepts", duration: "40:30", desc: "Advanced techniques and best practices" },
      { title: "{topic} Project Tutorial", duration: "45:20", desc: "Building a complete project from scratch" },
      { title: "{topic} Debugging Tips", duration: "22:40", desc: "Common errors and debugging strategies" }
    ],
    pdfs: [
      { title: "{topic} - Complete Guide", pages: 85, size: "7.2 MB", desc: "Comprehensive programming guide" },
      { title: "{topic} Syntax Reference", pages: 25, size: "2.1 MB", desc: "Quick syntax reference and cheat sheet" },
      { title: "{topic} Programs Collection", pages: 120, size: "9.5 MB", desc: "200+ programs with explanations" },
      { title: "{topic} Interview Questions", pages: 45, size: "3.8 MB", desc: "Top interview questions and answers" },
      { title: "{topic} Project Ideas", pages: 32, size: "2.8 MB", desc: "Mini and major project ideas with implementation" }
    ],
    assignments: [
      { title: "Basic {topic} Programs", desc: "Write 10 fundamental programs", maxScore: 30, difficulty: "Easy" },
      { title: "Intermediate {topic} Coding", desc: "Data structure implementation programs", maxScore: 40, difficulty: "Medium" },
      { title: "Advanced {topic} Project", desc: "Complete application development", maxScore: 50, difficulty: "Hard" },
      { title: "{topic} Algorithm Implementation", desc: "Implement key algorithms", maxScore: 35, difficulty: "Hard" }
    ],
    quizzes: [
      { title: "{topic} Syntax Quiz", desc: "Test on syntax and basics", questions: 25, duration: "25 mins", passingScore: 70 },
      { title: "{topic} Coding Challenge", desc: "Output prediction and code analysis", questions: 20, duration: "30 mins", passingScore: 75 },
      { title: "{topic} Comprehensive Test", desc: "Full assessment covering all topics", questions: 40, duration: "50 mins", passingScore: 80 }
    ]
  },
  engineering: {
    videos: [
      { title: "{topic} - Fundamentals", duration: "30:15", desc: "Introduction to {topic} concepts" },
      { title: "{topic} Theory and Design", duration: "35:30", desc: "Theoretical principles and design aspects" },
      { title: "{topic} Practical Applications", duration: "28:45", desc: "Industry applications and case studies" },
      { title: "{topic} Problem Solving", duration: "32:20", desc: "Solving typical engineering problems" },
      { title: "{topic} Advanced Topics", duration: "27:50", desc: "Advanced concepts and modern developments" }
    ],
    pdfs: [
      { title: "{topic} - Lecture Notes", pages: 72, size: "6.0 MB", desc: "Complete lecture notes with diagrams" },
      { title: "{topic} Design Handbook", pages: 95, size: "8.2 MB", desc: "Design procedures and standards" },
      { title: "{topic} Practice Problems", pages: 55, size: "4.5 MB", desc: "Solved problems and exercises" },
      { title: "{topic} Reference Manual", pages: 120, size: "10.0 MB", desc: "Comprehensive reference material" },
      { title: "{topic} Lab Experiments", pages: 40, size: "3.5 MB", desc: "Laboratory procedures and reports" }
    ],
    assignments: [
      { title: "{topic} Theory Assignment", desc: "Conceptual questions and derivations", maxScore: 30, difficulty: "Medium" },
      { title: "{topic} Design Problem", desc: "Complete a design project", maxScore: 40, difficulty: "Hard" },
      { title: "{topic} Analysis Task", desc: "Analyze and solve engineering problems", maxScore: 35, difficulty: "Medium" }
    ],
    quizzes: [
      { title: "{topic} Fundamentals Quiz", desc: "Test on basic concepts", questions: 25, duration: "30 mins", passingScore: 75 },
      { title: "{topic} Comprehensive Test", desc: "Full chapter assessment", questions: 35, duration: "45 mins", passingScore: 80 }
    ]
  },
  communication: {
    videos: [
      { title: "{topic} - Introduction", duration: "25:30", desc: "Overview of {topic} skills" },
      { title: "{topic} Techniques", duration: "28:15", desc: "Effective techniques and strategies" },
      { title: "{topic} Practice Sessions", duration: "32:45", desc: "Interactive practice and exercises" },
      { title: "{topic} Real-world Applications", duration: "24:20", desc: "Professional communication scenarios" }
    ],
    pdfs: [
      { title: "{topic} - Complete Guide", pages: 48, size: "3.8 MB", desc: "Comprehensive guide to {topic}" },
      { title: "{topic} Practice Exercises", pages: 35, size: "2.8 MB", desc: "Practice materials with answers" },
      { title: "{topic} Reference Material", pages: 52, size: "4.2 MB", desc: "Additional resources and examples" }
    ],
    assignments: [
      { title: "{topic} Written Assignment", desc: "Complete written exercises", maxScore: 25, difficulty: "Easy" },
      { title: "{topic} Practical Task", desc: "Real-world communication task", maxScore: 30, difficulty: "Medium" },
      { title: "{topic} Project", desc: "Comprehensive communication project", maxScore: 35, difficulty: "Medium" }
    ],
    quizzes: [
      { title: "{topic} Quiz", desc: "Test your {topic} skills", questions: 20, duration: "25 mins", passingScore: 70 },
      { title: "{topic} Final Assessment", desc: "Comprehensive test", questions: 30, duration: "35 mins", passingScore: 75 }
    ]
  }
};

// Function to determine subject type based on name and code
function getSubjectType(subjectName, subjectCode) {
  const name = subjectName.toLowerCase();
  const code = subjectCode.toLowerCase();
  
  if (name.includes('math') || name.includes('calculus') || name.includes('algebra') || 
      name.includes('statistics') || name.includes('numerical') || code.includes('ma')) {
    return 'mathematics';
  }
  if (name.includes('physics') || code.includes('ph') || code.includes('phy')) {
    return 'physics';
  }
  if (name.includes('programming') || name.includes('python') || name.includes('java') || 
      name.includes('c++') || name.includes(' c ') || name.includes('data structures') || 
      name.includes('algorithm') || name.includes('software') || name.includes('coding')) {
    return 'programming';
  }
  if (name.includes('english') || name.includes('communication') || name.includes('writing') || 
      name.includes('speaking') || code.includes('en') || code.includes('ec')) {
    return 'communication';
  }
  return 'engineering';
}

// Function to generate content for a subject
function generateContentForSubject(subject) {
  const subjectType = getSubjectType(subject.name, subject.code);
  const template = contentTemplates[subjectType];
  
  if (!subject.units || subject.units.length === 0) {
    console.log(`Skipping ${subject.name} - No units defined`);
    return false;
  }
  
  // Check if content already exists
  if (subject.videos && subject.videos.length > 0) {
    console.log(`Skipping ${subject.name} - Content already exists`);
    return false;
  }
  
  console.log(`Adding content to: ${subject.name} (${subject.code}) - Type: ${subjectType}`);
  
  // Gather all topics from all units
  const allTopics = [];
  subject.units.forEach(unit => {
    if (unit.topics && Array.isArray(unit.topics)) {
      allTopics.push(...unit.topics);
    }
  });
  
  // Generate videos based on topics
  subject.videos = [];
  const numVideos = Math.min(allTopics.length, template.videos.length);
  for (let i = 0; i < numVideos; i++) {
    const topic = allTopics[i % allTopics.length];
    const videoTemplate = template.videos[i];
    subject.videos.push({
      title: videoTemplate.title.replace('{topic}', topic),
      description: videoTemplate.desc.replace('{topic}', topic),
      duration: videoTemplate.duration,
      url: `https://www.youtube.com/watch?v=sample_${subject.code}_${i}`
    });
  }
  
  // Generate PDFs
  subject.pdfs = [];
  template.pdfs.forEach((pdfTemplate, i) => {
    const topic = allTopics[i % allTopics.length] || subject.name;
    subject.pdfs.push({
      title: pdfTemplate.title.replace('{topic}', topic),
      description: pdfTemplate.desc.replace('{topic}', topic),
      pages: pdfTemplate.pages,
      size: pdfTemplate.size,
      url: `https://www.nptel.ac.in/courses/${subject.code}/`
    });
  });
  
  // Generate assignments
  subject.assignments = [];
  template.assignments.forEach((assignTemplate, i) => {
    const topic = allTopics[i % allTopics.length] || subject.name;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (i + 1) * 7);
    subject.assignments.push({
      title: assignTemplate.title.replace('{topic}', topic),
      description: assignTemplate.desc.replace('{topic}', topic),
      dueDate: dueDate.toISOString().split('T')[0],
      maxScore: assignTemplate.maxScore,
      difficulty: assignTemplate.difficulty
    });
  });
  
  // Generate quizzes
  subject.quizzes = [];
  template.quizzes.forEach((quizTemplate, i) => {
    const topic = allTopics[i % allTopics.length] || subject.name;
    subject.quizzes.push({
      title: quizTemplate.title.replace('{topic}', topic),
      description: quizTemplate.desc.replace('{topic}', topic),
      questions: quizTemplate.questions,
      duration: quizTemplate.duration,
      passingScore: quizTemplate.passingScore
    });
  });
  
  return true;
}

// Main processing function
function processAllBranches() {
  let modifiedCount = 0;
  let totalSubjects = 0;
  
  if (!data.branches) {
    console.error('Error: No branches object found in data');
    return;
  }
  
  console.log(`Found ${Object.keys(data.branches).length} branches in data`);
  
  Object.keys(data.branches).forEach(branchKey => {
    const branch = data.branches[branchKey];
    
    console.log(`\n=== Processing: ${branch.name} (${branchKey}) ===`);
    
    Object.keys(branch.semesters).forEach(semKey => {
      const semester = branch.semesters[semKey];
      console.log(`\nSemester ${semKey}:`);
      
      if (semester.subjects && Array.isArray(semester.subjects)) {
        semester.subjects.forEach(subject => {
          totalSubjects++;
          if (generateContentForSubject(subject)) {
            modifiedCount++;
          }
        });
      }
    });
  });
  
  console.log(`\n=== Summary ===`);
  console.log(`Total subjects processed: ${totalSubjects}`);
  console.log(`Subjects with new content: ${modifiedCount}`);
  
  // Write back to file
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  console.log(`\nData written to: ${dataPath}`);
}

// Run the script
console.log('Starting Engineering Content Addition...\n');
processAllBranches();
console.log('\n✅ Engineering content addition complete!');
