const AdminHackathon = require('../models/AdminHackathon');

// GET /api/hackathons
exports.getAll = async (req, res) => {
  try {
    const { search, status, mode, payment, category, sort = 'newest', page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (status && status !== 'all') query.status = status;
    if (mode && mode !== 'all') query.mode = mode;
    if (payment && payment !== 'all') query.payment = payment;
    if (category && category !== 'all') query.tags = { $in: [category] };

    const sortMap = {
      newest: { startDate: -1, createdAt: -1 },
      'ending-soon': { endDate: 1 },
      prize: { prize: -1 },
      live: { status: -1, startDate: -1 },
    };
    const sortBy = sortMap[sort] || sortMap.newest;

    const docs = await AdminHackathon.find(query)
      .sort(sortBy)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await AdminHackathon.countDocuments(query);

    res.json({ success: true, hackathons: docs, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    console.error('Get hackathons error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/hackathons/:id
exports.getById = async (req, res) => {
  try {
    const doc = await AdminHackathon.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Hackathon not found' });
    res.json({ success: true, hackathon: doc });
  } catch (err) {
    console.error('Get hackathon by id error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
