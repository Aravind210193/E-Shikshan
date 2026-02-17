const AdminResumeTemplate = require('../models/AdminResume');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', active } = req.query;

    let query = {};
    if (active !== undefined) query.isActive = active === 'true';

    // Build conditions array for $and
    let andConditions = [];

    // Search filter
    if (search) {
      andConditions.push({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { tags: { $in: [new RegExp(search, 'i')] } },
        ]
      });
    }

    // Role-based visibility: REMOVED to allow seeing all templates
    // Admin (or anyone) can filter by specific creator if param provided
    if (req.query.createdBy) {
      query.createdBy = req.query.createdBy;
    }

    // Apply AND conditions if any (e.g. search)
    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const [items, total] = await Promise.all([
      AdminResumeTemplate.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)),
      AdminResumeTemplate.countDocuments(query),
    ]);

    res.json({ success: true, data: items, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await AdminResumeTemplate.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const Admin = require('../models/Admin');

exports.create = async (req, res) => {
  try {
    // Assign to the current logged-in admin/instructor
    let ownerId = req.admin._id;

    // If logged-in user is Admin, allow them to specify the owner (e.g. creating for a resume_instructor)
    if (req.admin.role === 'admin' && req.body.createdBy) {
      ownerId = req.body.createdBy;
    }

    // Create the template with the correct owner
    const item = await AdminResumeTemplate.create({ ...req.body, createdBy: ownerId });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    let query = { _id: req.params.id };

    // Resume Instructor: Can only update their own templates
    if (req.admin.role === 'resume_instructor') {
      query.createdBy = req.admin._id;
    }

    const item = await AdminResumeTemplate.findOneAndUpdate(query, req.body, { new: true });

    if (!item) {
      // If not found, it might be that they don't own it
      return res.status(404).json({ success: false, message: 'Template not found or unauthorized' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    let query = { _id: req.params.id };

    // Resume Instructor: Can only delete their own templates
    if (req.admin.role === 'resume_instructor') {
      query.createdBy = req.admin._id;
    }

    const item = await AdminResumeTemplate.findOneAndDelete(query);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Template not found or unauthorized' });
    }
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.stats = async (req, res) => {
  try {
    const query = {};
    if (req.admin.role === 'resume_instructor') {
      query.createdBy = req.admin._id;
    }

    const total = await AdminResumeTemplate.countDocuments(query);
    const active = await AdminResumeTemplate.countDocuments({ ...query, isActive: true });
    res.json({ success: true, data: { total, active } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
