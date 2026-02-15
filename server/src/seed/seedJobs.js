require('dotenv').config();
const path = require('path');
const fs = require('fs');
const connectDB = require('../config/db');
const Job = require('../models/Job');

async function run() {
  await connectDB();
  const file = path.join(__dirname, '../../../client/src/data/jobProfile.json');
  const raw = fs.readFileSync(file, 'utf-8');
  const items = JSON.parse(raw);

  // Clear existing job profiles
  await Job.deleteMany({});

  const docs = items.map((j) => ({
    legacyId: j.id,
    logo: j.logo,
    title: j.title,
    category: j.category,
    organization: j.organization,
    skills: j.skills || [],
    tag: j.tag,
    location: j.location,
    salary: j.salary,
    duration: j.duration,
    startDate: j.startDate,
    timePerWeek: j.timePerWeek,
    mode: j.mode,
    credential: j.credential,
    description: j.description,
    about: j.about,
    // Source JSON uses a typo 'responsibilites'; normalize to responsibilities
    responsibilities: j.responsibilites || j.responsibilities || [],
    curriculum: j.curriculum || [],
    experienceLevel: j.experienceLevel,
    openings: j.openings,
    companyWebsite: j.companyWebsite,
    applyUrl: j.applyUrl,
    salaryMin: j.salaryMin,
    salaryMax: j.salaryMax,
    currency: j.currency,
    benefits: j.benefits || [],
    howto: j.howto || [],
  }));

  await Job.insertMany(docs);
  console.log(`✅ Seeded ${docs.length} job profiles`);
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
