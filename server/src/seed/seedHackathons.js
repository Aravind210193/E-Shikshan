require('dotenv').config();
const path = require('path');
const fs = require('fs');
const connectDB = require('../config/db');
const AdminHackathon = require('../models/AdminHackathon');

const mapStatus = (s, startDate, endDate) => {
  const now = new Date();
  if (s && typeof s === 'string') {
    const val = s.toLowerCase();
    if (val.includes('live') || val.includes('active')) return 'active';
    if (val.includes('draft')) return 'draft';
  }
  if (startDate && new Date(startDate) > now) return 'upcoming';
  if (endDate && new Date(endDate) < now) return 'closed';
  return 'active';
};

async function run() {
  await connectDB();
  const file = path.join(__dirname, '../../../client/src/data/hackathons.json');
  const raw = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(raw);

  // Clear existing
  await AdminHackathon.deleteMany({});

  const docs = data.map((h) => ({
    title: h.title,
    organizer: h.category || 'Organizer',
    description: h.overview || h.about?.[0]?.description || '',
    overview: h.overview || '',
    location: h.category || 'Online',
    mode: (h.EventType || 'online').toLowerCase(),
    startDate: h.startDate ? new Date(h.startDate) : undefined,
    endDate: h.endDate ? new Date(h.endDate) : undefined,
    registrationCloses: h.registrationCloses ? new Date(h.registrationCloses) : undefined,
    submissionDeadline: h.submissionDeadline ? new Date(h.submissionDeadline) : undefined,
    prize: h.prize || '',
    imageUrl: h.image || '',
    bgImage: h.bgimage || '',
    applyUrl: h.registrationUrl || '',
    tags: [h.category, h.tagline].filter(Boolean),
    status: mapStatus(h.status, h.startDate, h.endDate),
    tagline: h.tagline || '',
    teamSize: h.TeamSize || '',
    payment: h.payment || '',
    about: h.about || [],
    whoCanParticipate: h.whoCanParticipate || [],
    challenges: h.challenges || [],
    howit: h.howit || [],
  }));

  await AdminHackathon.insertMany(docs);
  console.log(`✅ Seeded ${docs.length} hackathons with full details`);
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
