require('dotenv').config();
const connectDB = require('../config/db');
const AdminHackathon = require('../models/AdminHackathon');
const AdminRoadmap = require('../models/AdminRoadmap');
const AdminContent = require('../models/AdminContent');
const AdminResumeTemplate = require('../models/AdminResume');

async function verify() {
  await connectDB();
  
  console.log('\n🔍 Verifying Seeded Data:\n');
  console.log('═══════════════════════════════════════════════════════════');
  
  // Check Hackathons
  const hackathonCount = await AdminHackathon.countDocuments();
  const hackathon = await AdminHackathon.findOne();
  console.log('\n📅 HACKATHONS');
  console.log(`   Total: ${hackathonCount}`);
  if (hackathon) {
    console.log(`   Sample: "${hackathon.title}"`);
    console.log(`   ├─ About sections: ${hackathon.about?.length || 0}`);
    console.log(`   ├─ Challenges: ${hackathon.challenges?.length || 0}`);
    console.log(`   ├─ How it works: ${hackathon.howit?.length || 0}`);
    console.log(`   └─ Status: ${hackathon.status}`);
  }
  
  // Check Roadmaps
  const roadmapCount = await AdminRoadmap.countDocuments();
  const roadmap = await AdminRoadmap.findOne();
  console.log('\n🗺️  ROADMAPS');
  console.log(`   Total: ${roadmapCount}`);
  if (roadmap) {
    console.log(`   Sample: "${roadmap.title}"`);
    console.log(`   ├─ Category: ${roadmap.category}`);
    console.log(`   ├─ Level: ${roadmap.level}`);
    console.log(`   ├─ Steps: ${roadmap.steps?.length || 0}`);
    console.log(`   └─ Status: ${roadmap.status}`);
  }
  
  // Check Content
  const contentCount = await AdminContent.countDocuments();
  const content = await AdminContent.findOne();
  console.log('\n📚 CONTENT');
  console.log(`   Total: ${contentCount}`);
  if (content) {
    console.log(`   Sample: "${content.title}"`);
    console.log(`   ├─ Type: ${content.type}`);
    console.log(`   ├─ Branch: ${content.branch}`);
    console.log(`   └─ Status: ${content.status}`);
  }
  
  // Check Resume Templates
  const resumeCount = await AdminResumeTemplate.countDocuments();
  const resume = await AdminResumeTemplate.findOne();
  console.log('\n📄 RESUME TEMPLATES');
  console.log(`   Total: ${resumeCount}`);
  if (resume) {
    console.log(`   Sample: "${resume.name}"`);
    console.log(`   ├─ Sections: ${resume.sections?.length || 0}`);
    console.log(`   ├─ Active: ${resume.isActive}`);
    console.log(`   └─ Tags: ${resume.tags?.length || 0}`);
  }
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('\n✅ All data verification complete!\n');
  
  process.exit(0);
}

verify().catch((e) => { console.error(e); process.exit(1); });
