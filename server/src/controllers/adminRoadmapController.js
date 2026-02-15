const AdminRoadmap = require('../models/AdminRoadmap');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;

    const [items, total] = await Promise.all([
      AdminRoadmap.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)),
      AdminRoadmap.countDocuments(query),
    ]);

    res.json({ success: true, data: items, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await AdminRoadmap.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const item = await AdminRoadmap.create({ ...req.body, createdBy: req.admin?.id });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await AdminRoadmap.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await AdminRoadmap.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.stats = async (req, res) => {
  try {
    const total = await AdminRoadmap.countDocuments();
    const active = await AdminRoadmap.countDocuments({ status: 'active' });
    const draft = await AdminRoadmap.countDocuments({ status: 'draft' });
    res.json({ success: true, data: { total, active, draft } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
