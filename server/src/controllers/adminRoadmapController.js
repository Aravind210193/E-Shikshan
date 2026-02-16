const Roadmap = require('../models/AdminRoadmap');

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, category } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tagline: { $regex: search, $options: 'i' } },
        { id: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) query.status = status;
    if (category) query.category = category;

    // Filter by instructor if applicable
    if (req.admin.role === 'roadmap_instructor') {
      query.createdBy = req.admin._id;
    }

    const [items, total] = await Promise.all([
      Roadmap.find(query).populate('createdBy', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit)),
      Roadmap.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: items,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.admin.role === 'roadmap_instructor') {
      query.createdBy = req.admin._id;
    }
    const item = await Roadmap.findOne(query);
    if (!item) return res.status(404).json({ success: false, message: 'Not found or unauthorized' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const item = await Roadmap.create({ ...req.body, createdBy: req.admin?._id });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.admin.role === 'roadmap_instructor') {
      query.createdBy = req.admin._id;
    }
    const item = await Roadmap.findOneAndUpdate(query, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found or unauthorized' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.admin.role === 'roadmap_instructor') {
      query.createdBy = req.admin._id;
    }
    const item = await Roadmap.findOneAndDelete(query);
    if (!item) return res.status(404).json({ success: false, message: 'Not found or unauthorized' });
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.stats = async (req, res) => {
  try {
    const query = {};
    if (req.admin.role === 'roadmap_instructor') {
      query.createdBy = req.admin._id;
    }

    const total = await Roadmap.countDocuments(query);
    const active = await Roadmap.countDocuments({ ...query, status: 'active' });
    const draft = await Roadmap.countDocuments({ ...query, status: 'draft' });
    const categories = await Roadmap.find(query).distinct('category');

    res.json({
      success: true,
      data: {
        total,
        active,
        draft,
        categoryCount: categories.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
