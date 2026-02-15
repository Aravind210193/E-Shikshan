require('dotenv').config();
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

const SectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
}, { _id: false });

const HackathonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    organizer: { type: String, default: '' },
    location: { type: String, default: 'Online' },
    mode: { type: String, enum: ['online', 'offline', 'hybrid'], default: 'online' },
    startDate: { type: Date },
    endDate: { type: Date },
    registrationCloses: { type: Date },
    submissionDeadline: { type: Date },
    prize: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    bgImage: { type: String, default: '' },
    applyUrl: { type: String, default: '' },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ['upcoming', 'active', 'closed', 'draft'], default: 'upcoming' },
    tagline: { type: String, default: '' },
    teamSize: { type: String, default: '' },
    payment: { type: String, default: '' },
    overview: { type: String, default: '' },
    about: { type: [SectionSchema], default: [] },
    whoCanParticipate: { type: [SectionSchema], default: [] },
    challenges: { type: [SectionSchema], default: [] },
    howit: { type: [String], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  },
  { timestamps: true }
);

const AdminHackathon = mongoose.model('AdminHackathon', HackathonSchema);

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
  try {
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', MONGODB_URI ? 'Set' : 'Not Set');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ Connected to MongoDB');

    const file = path.join(__dirname, '../client/src/data/hackathons.json');
    console.log('Reading file:', file);
    const raw = fs.readFileSync(file, 'utf-8');
    const data = JSON.parse(raw);
    console.log(`✅ Parsed ${data.length} hackathons from JSON`);

    // Clear existing
    const deleted = await AdminHackathon.deleteMany({});
    console.log(`🗑️  Deleted ${deleted.deletedCount} existing hackathons`);

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

    console.log('Inserting hackathons...');
    const inserted = await AdminHackathon.insertMany(docs);
    console.log(`✅ Successfully seeded ${inserted.length} hackathons into database!`);
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
}

run();
