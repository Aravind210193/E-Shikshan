require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./src/models/Admin');
const connectDB = require('./src/config/db');

const seedAdmins = async () => {
  try {
    await connectDB();

    // Clear existing admins
    await Admin.deleteMany({});
    console.log('Cleared existing admins');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword1 = await bcrypt.hash('admin123', salt);
    const hashedPassword2 = await bcrypt.hash('course123', salt);

    // Create admins
    const admins = [
      {
        name: 'System Administrator',
        email: 'admin@eshikshan.com',
        password: hashedPassword1,
        role: 'admin',
        permissions: ['all'],
        isActive: true,
      },
      {
        name: 'Course Manager',
        email: 'courses@eshikshan.com',
        password: hashedPassword2,
        role: 'course_manager',
        permissions: ['courses'],
        isActive: true,
      },
    ];

    await Admin.insertMany(admins);
    console.log('✅ Admin users seeded successfully');
    console.log('\nLogin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Super Admin:');
    console.log('  Email: admin@eshikshan.com');
    console.log('  Password: admin123');
    console.log('\nCourse Manager:');
    console.log('  Email: courses@eshikshan.com');
    console.log('  Password: course123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admins:', error);
    process.exit(1);
  }
};

seedAdmins();
