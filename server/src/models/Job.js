const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
	{
		// Keep legacy numeric id if needed from JSON for reference (not primary key)
		legacyId: { type: Number, index: true },
		logo: String,
		title: { type: String, required: true },
		category: String,
		organization: String,
		skills: [{ type: String }],
		tag: String, // Full-time, Contract, Internship etc
		location: String,
		salary: String, // Display string
		duration: String,
		startDate: String,
		timePerWeek: String,
		mode: String,
		credential: String,
		description: String,
		about: String,
		responsibilities: [{ type: String }],
		curriculum: [{ type: String }],
		experienceLevel: String,
		openings: Number,
		companyWebsite: String,
		applyUrl: String,
		salaryMin: Number,
		salaryMax: Number,
		currency: String,
		benefits: [{ type: String }],
		howto: [{ type: String }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
