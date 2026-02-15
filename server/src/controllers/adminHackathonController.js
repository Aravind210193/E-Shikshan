const AdminHackathon = require('../models/AdminHackathon');

// List with pagination and search
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;

    const [items, total] = await Promise.all([
      AdminHackathon.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit)),
      AdminHackathon.countDocuments(query),
    ]);

    res.json({ success: true, data: items, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const item = await AdminHackathon.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const item = await AdminHackathon.create({ ...req.body, createdBy: req.admin?.id });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await AdminHackathon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await AdminHackathon.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.stats = async (req, res) => {
  try {
    const total = await AdminHackathon.countDocuments();
    const upcoming = await AdminHackathon.countDocuments({ status: 'upcoming' });
    const active = await AdminHackathon.countDocuments({ status: 'active' });
    const closed = await AdminHackathon.countDocuments({ status: 'closed' });
    res.json({ success: true, data: { total, upcoming, active, closed } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
