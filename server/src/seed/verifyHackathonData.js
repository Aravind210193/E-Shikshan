require('dotenv').config();
const connectDB = require('../config/db');
const AdminHackathon = require('../models/AdminHackathon');

async function verify() {
  await connectDB();
  
  const hackathon = await AdminHackathon.findOne();
  if (!hackathon) {
    console.log('No hackathons found');
    process.exit(1);
  }

  console.log('\n📋 Hackathon:', hackathon.title);
  console.log('├─ Tagline:', hackathon.tagline || 'N/A');
  console.log('├─ Team Size:', hackathon.teamSize || 'N/A');
  console.log('├─ Payment:', hackathon.payment || 'N/A');
  console.log('├─ Overview:', hackathon.overview?.substring(0, 50) || 'N/A');
  console.log('├─ About sections:', hackathon.about?.length || 0);
  console.log('├─ Who Can Participate sections:', hackathon.whoCanParticipate?.length || 0);
  console.log('├─ Challenges:', hackathon.challenges?.length || 0);
  console.log('└─ How it Works steps:', hackathon.howit?.length || 0);

  if (hackathon.about?.length > 0) {
    console.log('\n📄 First About Section:');
    console.log('  Title:', hackathon.about[0].title);
    console.log('  Description:', hackathon.about[0].description?.substring(0, 50) + '...');
  }

  process.exit(0);
}

verify().catch((e) => { console.error(e); process.exit(1); });
