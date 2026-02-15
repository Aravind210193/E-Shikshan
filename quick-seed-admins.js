// Quick Admin Seeder - Run this to create admin users
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

console.log('📦 Loading dependencies...');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://raja:eshikshansarasa@cluster0.wsbbkpp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
console.log('🔗 MongoDB URI loaded:', MONGODB_URI.substring(0, 30) + '...');

const AdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  role: { type: String, enum: ['admin', 'course_manager'], default: 'course_manager' },
  permissions: [String],
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

async function seedAdmins() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB:', mongoose.connection.name);

    // Clear existing admins
    console.log('🗑️  Clearing existing admins...');
    await Admin.deleteMany({});
    console.log('✅ Cleared existing admins');

    // Hash passwords
    console.log('🔐 Hashing passwords...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword1 = await bcrypt.hash('admin123', salt);
    const hashedPassword2 = await bcrypt.hash('course123', salt);

    // Create admins
    console.log('👤 Creating admin accounts...');
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
    
    console.log('\n✅ Admin users seeded successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 LOGIN CREDENTIALS:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔑 Super Admin:');
    console.log('   Email: admin@eshikshan.com');
    console.log('   Password: admin123');
    console.log('\n🔑 Course Manager:');
    console.log('   Email: courses@eshikshan.com');
    console.log('   Password: course123');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await mongoose.connection.close();
    console.log('✅ Database connection closed\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ ERROR SEEDING ADMINS:');
    console.error('Message:', error.message);
    if (error.code) console.error('Code:', error.code);
    if (error.name === 'MongooseServerSelectionError') {
      console.error('\n💡 TIP: MongoDB connection failed. Check:');
      console.error('   1. Is your internet connected?');
      console.error('   2. Is the MongoDB URI correct in server/.env?');
      console.error('   3. Is your IP whitelisted in MongoDB Atlas?');
    }
    console.error('\nFull error:', error);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
}

console.log('🚀 Starting admin seeding process...\n');
seedAdmins();
