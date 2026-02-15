const AdminContent = require('../models/AdminContent');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, type } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { branch: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;
    if (type) query.type = type;

    // Add category/education level filter
    if (req.query.category) {
      // If specific branch/semester selected, they will be in query params and we might not need this broad logic 
      // OR we use this only if specific branch is NOT set.
    }

    // Filter by Branch if provided
    if (req.query.branch) {
      query.branch = req.query.branch;
    }

    // Filter by Category (Level)
    if (req.query.category) {
      const catMap = {
        'ug': 'UG',
        'pg': 'PG',
        'medical': 'Medical',
        'intermediate': 'Intermediate',
        '10th': 'School'
      };

      // Special handling for 10th if we want to be very specific about branches
      if (req.query.category === '10th') {
        // If no specific branch is selected, we might want all 10th grade stuff
        // But strict category 'School' should work if seeded correctly.
        // Let's keep the branch regex just in case for 10th
        if (!query.branch) {
          query.branch = { $in: [/10th/i, 'ncert', 'state'] };
        }
      } else {
        // For others, use the mapped category
        if (catMap[req.query.category]) {
          query.category = catMap[req.query.category];
        }
      }
    }

    if (req.query.semester) {
      query.semester = req.query.semester;
    }

    if (req.query.subject) {
      query.subject = req.query.subject;
    }

    const [items, total] = await Promise.all([
      AdminContent.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)),
      AdminContent.countDocuments(query),
    ]);

    res.json({ success: true, data: items, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await AdminContent.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const item = await AdminContent.create({ ...req.body, createdBy: req.admin?.id });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await AdminContent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await AdminContent.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.stats = async (req, res) => {
  try {
    const total = await AdminContent.countDocuments();
    const published = await AdminContent.countDocuments({ status: 'published' });
    const draft = await AdminContent.countDocuments({ status: 'draft' });
    res.json({ success: true, data: { total, published, draft } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
