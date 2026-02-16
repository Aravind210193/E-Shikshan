const AdminJob = require('../models/AdminJob');
const Job = require('../models/Job');

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private
exports.getAllJobs = async (req, res) => {
  try {
    const { search, type, status, page = 1, limit = 10 } = req.query;

    // Build filters for AdminJob
    const adminQuery = {};
    if (search) {
      adminQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
      ];
    }
    if (type && type !== 'all') adminQuery.type = type;
    if (status && status !== 'all') adminQuery.status = status;

    // Instructor filtering
    if (req.admin.role === 'job_instructor') {
      adminQuery.postedBy = req.admin.id;
    }

    // Build filters for public Job (map fields accordingly)
    const publicQuery = {};
    if (search) {
      publicQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
      ];
    }
    if (type && type !== 'all') publicQuery.tag = type; // map tag to type
    // status filter: only include public jobs when status is 'all' or 'Active', AND not an instructor
    const isInstructor = req.admin.role === 'job_instructor';
    const includePublic = !isInstructor && (!status || status === 'all' || status === 'Active');

    const [adminJobs, publicJobs] = await Promise.all([
      AdminJob.find(adminQuery).sort({ createdAt: -1 }),
      includePublic ? Job.find(publicQuery).sort({ createdAt: -1 }) : Promise.resolve([]),
    ]);

    // Normalize to a common shape with a source field
    const normalizedAdmin = adminJobs.map((j) => ({
      _id: j._id,
      source: 'admin',
      title: j.title,
      company: j.company,
      location: j.location,
      type: j.type,
      salary: j.salary,
      applicants: j.applicants || 0,
      status: j.status,
      posted: j.posted || j.createdAt,
      description: j.description,
      requirements: j.requirements,
      responsibilities: j.responsibilities,
      createdAt: j.createdAt,
      // New fields mapping
      logo: j.logo,
      category: j.category,
      skills: j.skills,
      duration: j.duration,
      startDate: j.startDate,
      timePerWeek: j.timePerWeek,
      mode: j.mode,
      credential: j.credential,
      about: j.about,
      experienceLevel: j.experienceLevel,
      openings: j.openings,
      companyWebsite: j.companyWebsite,
      applyUrl: j.applyUrl,
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      currency: j.currency,
      benefits: j.benefits,
      howto: j.howto,
    }));

    const normalizedPublic = publicJobs.map((j) => ({
      _id: j._id,
      source: 'public',
      title: j.title,
      company: j.organization,
      location: j.location,
      type: j.tag || 'Full-time',
      salary: j.salary,
      applicants: 0,
      status: 'Active',
      posted: j.createdAt,
      description: j.description,
      requirements: j.curriculum || [],
      responsibilities: j.responsibilities || [],
      createdAt: j.createdAt,
      // New fields mapping
      logo: j.logo,
      category: j.category,
      skills: j.skills,
      duration: j.duration,
      startDate: j.startDate,
      timePerWeek: j.timePerWeek,
      mode: j.mode,
      credential: j.credential,
      about: j.about,
      experienceLevel: j.experienceLevel,
      openings: j.openings,
      companyWebsite: j.companyWebsite,
      applyUrl: j.applyUrl,
      salaryMin: j.salaryMin,
      salaryMax: j.salaryMax,
      currency: j.currency,
      benefits: j.benefits,
      howto: j.howto,
    }));

    // Combine, sort, paginate
    const combined = [...normalizedAdmin, ...normalizedPublic]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const start = (Number(page) - 1) * Number(limit);
    const end = start + Number(limit);
    const pageItems = combined.slice(start, end);

    res.json({
      success: true,
      jobs: pageItems,
      totalPages: Math.ceil(combined.length / Number(limit)),
      currentPage: Number(page),
      total: combined.length,
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single job
// @route   GET /api/admin/jobs/:id
// @access  Private
exports.getJobById = async (req, res) => {
  try {
    let job = await AdminJob.findById(req.params.id);

    if (!job) {
      // Check in public Job table if not found in Admin
      job = await Job.findById(req.params.id);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
    }

    res.json({ success: true, job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new job
// @route   POST /api/admin/jobs
// @access  Private
exports.createJob = async (req, res) => {
  try {
    const job = await AdminJob.create(req.body);
    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update job
// @route   PUT /api/admin/jobs/:id
// @access  Private
exports.updateJob = async (req, res) => {
  try {
    const job = await AdminJob.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ message: 'Job not found or not an admin job' });
    }

    res.json({ success: true, job });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete job
// @route   DELETE /api/admin/jobs/:id
// @access  Private
exports.deleteJob = async (req, res) => {
  try {
    const job = await AdminJob.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await job.deleteOne();

    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get job statistics
// @route   GET /api/admin/jobs/stats
// @access  Private
exports.getJobStats = async (req, res) => {
  try {
    const query = {};
    if (req.admin.role === 'job_instructor') {
      query.postedBy = req.admin.id;
    }

    const total = await AdminJob.countDocuments(query);
    const active = await AdminJob.countDocuments({ ...query, status: 'Active' });
    const pending = await AdminJob.countDocuments({ ...query, status: 'Pending' });
    const closed = await AdminJob.countDocuments({ ...query, status: 'Closed' });

    const totalApplicants = await AdminJob.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$applicants' } } }
    ]);

    res.json({
      success: true,
      stats: {
        total,
        active,
        pending,
        closed,
        totalApplicants: totalApplicants[0]?.total || 0
      },
    });
  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
