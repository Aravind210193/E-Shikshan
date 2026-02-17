const AdminResumeTemplate = require('../models/AdminResume');

exports.getAll = async (req, res) => {
    try {
        const templates = await AdminResumeTemplate.find({ isActive: true });

        // Map to frontend structure
        const mapped = templates.map(t => ({
            id: t.category || t._id.toString(), // Use category as the main ID to match frontend expectations (e.g. 'faang')
            _id: t._id,
            name: t.name,
            color: t.color,
            description: t.description,
            preview: t.preview,
            recommended: t.recommended,
            subTemplates: t.subTemplates
        }));

        res.json({ success: true, count: mapped.length, data: mapped });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
