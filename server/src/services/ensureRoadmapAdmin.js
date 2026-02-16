const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
require('dotenv').config();

const ensureRoadmapAdmin = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'roadmap@eshikshan.com';
        const password = 'password123'; // Default password
        const hashedPassword = await bcrypt.hash(password, 10);

        let admin = await Admin.findOne({ email });

        if (!admin) {
            console.log('Roadmap Admin not found. Creating new one...');
            admin = new Admin({
                name: 'Roadmap Instructor',
                email,
                password: hashedPassword,
                role: 'roadmap_instructor',
                permissions: ['roadmaps'],
                isActive: true
            });
            await admin.save();
            console.log(`Roadmap Admin created successfully. Email: ${email}, Password: ${password}`);
        } else {
            console.log('Roadmap Admin found. Updating role and permissions...');
            admin.role = 'roadmap_instructor';
            // Ensure 'roadmaps' permission is present
            if (!admin.permissions.includes('roadmaps')) {
                admin.permissions = ['roadmaps'];
            }
            await admin.save();
            console.log('Roadmap Admin updated successfully');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error ensuring roadmap admin:', error);
        process.exit(1);
    }
};

ensureRoadmapAdmin();
