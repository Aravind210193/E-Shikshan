const Job = require('../models/Job');

// GET /api/jobs
exports.getAll = async (req, res) => {
  try {
    const { search, category, tag, location, sort = 'newest', page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organization: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;
    if (tag) query.tag = tag;
    if (location) query.location = { $regex: location, $options: 'i' };

    const sortMap = {
      newest: { createdAt: -1 },
      'salary-desc': { salaryMax: -1 },
      'a-z': { title: 1 },
    };
    const sortBy = sortMap[sort] || sortMap.newest;

    const docs = await Job.find(query)
      .sort(sortBy)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Job.countDocuments(query);

    res.json({ success: true, jobs: docs, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error('Get jobs error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/jobs/:id
exports.getById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json({ success: true, job });
  } catch (err) {
    console.error('Get job by id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
