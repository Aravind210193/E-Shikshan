const Job = require('../models/Job');
const AdminJob = require('../models/AdminJob');

// GET /api/jobs
exports.getAll = async (req, res) => {
  try {
    const { search, category, tag, location, sort = 'newest', page = 1, limit = 100 } = req.query;

    // Build query for public Job collection
    const publicQuery = {};
    if (search) {
      publicQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) publicQuery.category = category;
    if (tag) publicQuery.tag = tag;
    if (location) publicQuery.location = { $regex: location, $options: 'i' };

    // Build query for AdminJob collection (only Active jobs)
    const adminQuery = { status: 'Active' };
    if (search) {
      adminQuery.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) adminQuery.category = category;
    if (tag) adminQuery.type = tag; // AdminJob uses 'type' field
    if (location) adminQuery.location = { $regex: location, $options: 'i' };

    // Fetch from both collections
    const [publicJobs, adminJobs] = await Promise.all([
      Job.find(publicQuery).sort({ createdAt: -1 }).lean(),
      AdminJob.find(adminQuery).sort({ createdAt: -1 }).lean(),
    ]);

    // Normalize admin jobs to match public job structure
    const normalizedAdminJobs = adminJobs.map(j => ({
      _id: j._id,
      title: j.title || '',
      organization: j.company || '',
      location: j.location || '',
      salary: j.salary || '',
      tag: j.type || 'Full-time',
      category: j.category || 'General',
      description: j.description || '',
      responsibilities: j.responsibilities || [],
      curriculum: j.requirements || [],
      startDate: (j.posted || j.createdAt) ? new Date(j.posted || j.createdAt).toISOString().split('T')[0] : '',
      createdAt: j.createdAt,
    }));

    // Combine both arrays
    const allJobs = [...publicJobs, ...normalizedAdminJobs];

    // Sort combined results
    const sortMap = {
      newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      'salary-desc': (a, b) => {
        const getSalary = (sal) => {
          if (!sal) return 0;
          const nums = String(sal).match(/\d+/g);
          return nums ? parseInt(nums[nums.length - 1]) : 0;
        };
        return getSalary(b.salary) - getSalary(a.salary);
      },
      'a-z': (a, b) => (a.title || '').localeCompare(b.title || ''),
    };

    const sortFn = sortMap[sort] || sortMap.newest;
    allJobs.sort(sortFn);

    // Pagination
    const total = allJobs.length;
    const start = (Number(page) - 1) * Number(limit);
    const paginatedJobs = allJobs.slice(start, start + Number(limit));

    res.json({
      success: true,
      jobs: paginatedJobs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    console.error('Get jobs error:', err);
    res.status(500).json({ success: false, message: err.message || 'Server error' });
  }
};

// GET /api/jobs/:id
exports.getById = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id).lean();

    if (!job) {
      // Check AdminJob if not found in public Job collection
      const adminJob = await AdminJob.findById(req.params.id).lean();

      if (adminJob) {
        // Normalize admin job to match public structure
        job = {
          _id: adminJob._id,
          title: adminJob.title || '',
          organization: adminJob.company || '',
          location: adminJob.location || '',
          salary: adminJob.salary || '',
          tag: adminJob.type || 'Full-time',
          category: adminJob.category || 'General',
          description: adminJob.description || '',
          responsibilities: adminJob.responsibilities || [],
          curriculum: adminJob.requirements || [],
          startDate: (adminJob.posted || adminJob.createdAt) ? new Date(adminJob.posted || adminJob.createdAt).toISOString().split('T')[0] : '',
          createdAt: adminJob.createdAt,
          // Map additional fields
          logo: adminJob.logo,
          duration: adminJob.duration,
          timePerWeek: adminJob.timePerWeek,
          mode: adminJob.mode,
          credential: adminJob.credential,
          about: adminJob.about,
          experienceLevel: adminJob.experienceLevel,
          openings: adminJob.openings,
          companyWebsite: adminJob.companyWebsite,
          applyUrl: adminJob.applyUrl,
          salaryMin: adminJob.salaryMin,
          salaryMax: adminJob.salaryMax,
          currency: adminJob.currency,
          benefits: adminJob.benefits,
          howto: adminJob.howto,
          skills: adminJob.skills,
        };
      }
    }

    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.json({ success: true, job });
  } catch (err) {
    console.error('Get job by id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
