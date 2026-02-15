require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectDB = require('../config/db');
const AdminRoadmap = require('../models/AdminRoadmap');

// Map difficulty levels
function mapDifficulty(difficulty) {
  if (!difficulty) return 'Beginner';
  const lower = difficulty.toLowerCase();
  if (lower.includes('beginner')) return 'Beginner';
  if (lower.includes('intermediate')) return 'Intermediate';
  if (lower.includes('advanced')) return 'Advanced';
  return 'Beginner';
}

async function run() {
  await connectDB();
  const file = path.join(__dirname, '../../../client/src/Roadmap/skills.json');
  const raw = fs.readFileSync(file, 'utf-8');
  const data = JSON.parse(raw);

  // Clear existing
  await AdminRoadmap.deleteMany({});

  const docs = data.map((r, index) => ({
    title: r.title,
    category: r.category || 'Technology',
    level: mapDifficulty(r.difficulty),
    thumbnail: r.image || '',
    status: 'active',
    steps: (r.path || []).map((step, idx) => ({
      title: step.title,
      description: step.description || '',
      resources: step.resources || [],
      order: idx + 1,
    })),
    tags: [
      r.category,
      r.difficulty,
      r.popularity,
      r.duration,
    ].filter(Boolean),
  }));

  await AdminRoadmap.insertMany(docs);
  console.log(`✅ Seeded ${docs.length} roadmaps with full details`);
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
