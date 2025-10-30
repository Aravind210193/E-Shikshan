const AdminResumeTemplate = require('../models/AdminResume');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', active } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }
    if (active !== undefined) query.isActive = active === 'true';

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

exports.create = async (req, res) => {
  try {
    const item = await AdminResumeTemplate.create({ ...req.body, createdBy: req.admin?.id });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await AdminResumeTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await AdminResumeTemplate.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.stats = async (req, res) => {
  try {
    const total = await AdminResumeTemplate.countDocuments();
    const active = await AdminResumeTemplate.countDocuments({ isActive: true });
    res.json({ success: true, data: { total, active } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
