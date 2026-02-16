const Roadmap = require('../models/AdminRoadmap');

// Get all active roadmaps (public route)
exports.getAllRoadmaps = async (req, res) => {
    try {
        const { category, search, sortBy = 'popular' } = req.query;

        // Build query
        const query = { status: 'active' };

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { tagline: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Determine sort order
        let sort = {};
        switch (sortBy) {
            case 'newest':
                sort = { createdAt: -1 };
                break;
            case 'top-rated':
                sort = { rating: -1 };
                break;
            case 'trending':
                sort = { trending: -1 };
                break;
            case 'popular':
            default:
                sort = { enrolled: -1 };
                break;
        }

        const roadmaps = await Roadmap.find(query).sort(sort);

        res.json({
            success: true,
            data: roadmaps,
            total: roadmaps.length
        });
    } catch (error) {
        console.error('Error fetching roadmaps:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch roadmaps',
            error: error.message
        });
    }
};

// Get single roadmap by ID (public route)
exports.getRoadmapById = async (req, res) => {
    try {
        const { id } = req.params;

        const roadmap = await Roadmap.findOne({ id, status: 'active' });

        if (!roadmap) {
            return res.status(404).json({
                success: false,
                message: 'Roadmap not found'
            });
        }

        res.json({
            success: true,
            data: roadmap
        });
    } catch (error) {
        console.error('Error fetching roadmap:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch roadmap',
            error: error.message
        });
    }
};

// Get all categories (public route)
exports.getCategories = async (req, res) => {
    try {
        const categories = await Roadmap.distinct('category', { status: 'active' });

        res.json({
            success: true,
            data: ['All', ...categories]
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: error.message
        });
    }
};

// Get roadmap stats (public route)
exports.getRoadmapStats = async (req, res) => {
    try {
        const total = await Roadmap.countDocuments({ status: 'active' });
        const categories = await Roadmap.distinct('category', { status: 'active' });

        res.json({
            success: true,
            data: {
                total,
                categories: categories.length
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stats',
            error: error.message
        });
    }
};
