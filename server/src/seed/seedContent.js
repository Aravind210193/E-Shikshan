require('dotenv').config();
const connectDB = require('../config/db');
const AdminContent = require('../models/AdminContent');

async function run() {
  await connectDB();
  await AdminContent.deleteMany({});

  const samples = [
    {
      title: 'CSE Syllabus PDF',
      type: 'pdf',
      branch: 'CSE',
      semester: '1',
      category: 'Syllabus',
      url: 'https://example.com/cse-sem1-syllabus.pdf',
      description: 'Syllabus for CSE Semester 1',
      tags: ['cse','sem1','syllabus'],
      status: 'published',
    },
    {
      title: 'DSA Video Lecture',
      type: 'video',
      branch: 'CSE',
      semester: '3',
      subject: 'DSA',
      category: 'Lecture',
      url: 'https://www.youtube.com/watch?v=8hly31xKli0',
      description: 'Intro to Data Structures and Algorithms',
      tags: ['dsa','video'],
      status: 'published',
    },
    {
      title: 'Operating Systems Article',
      type: 'article',
      branch: 'CSE',
      semester: '5',
      subject: 'OS',
      category: 'Reading',
      url: 'https://developer.mozilla.org/',
      description: 'Article on OS concepts',
      tags: ['os','article'],
      status: 'draft',
    },
  ];

  await AdminContent.insertMany(samples);
  console.log(`Seeded ${samples.length} content items`);
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
