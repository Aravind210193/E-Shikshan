/**
 * Test script to verify production API is accessible
 * This script tests the /api/admin/stats endpoint
 */

const https = require('https');

const PRODUCTION_API = 'https://e-shikshan.onrender.com/api/admin/stats';

console.log('🔍 Testing Production API...\n');
console.log(`📍 URL: ${PRODUCTION_API}\n`);

// Note: You'll need to replace 'YOUR_ADMIN_TOKEN' with an actual admin token
// To get a token, login to admin panel and copy it from sessionStorage
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'YOUR_ADMIN_TOKEN';

if (ADMIN_TOKEN === 'YOUR_ADMIN_TOKEN') {
    console.log('⚠️  WARNING: No admin token provided!');
    console.log('To test with authentication:');
    console.log('1. Login to admin panel at https://eshikshan.vercel.app/admin');
    console.log('2. Open browser console (F12)');
    console.log('3. Type: sessionStorage.getItem("adminToken")');
    console.log('4. Copy the token and run: ADMIN_TOKEN=your_token node test-production-api.js');
    console.log('\nAttempting without authentication (this may fail with 401)...\n');
}

const url = new URL(PRODUCTION_API);

const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
    }
};

const req = https.request(options, (res) => {
    let data = '';

    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    console.log('');

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const parsedData = JSON.parse(data);

            if (res.statusCode === 200) {
                console.log('✅ SUCCESS! API is working correctly.\n');
                console.log('📊 Dashboard Statistics:');
                console.log('='.repeat(60));

                if (parsedData.stats) {
                    const stats = parsedData.stats;
                    console.log(`👥 Total Users: ${stats.totalUsers || 0}`);
                    console.log(`👨‍🎓 Total Students: ${stats.totalStudents || 0}`);
                    console.log(`👨‍🏫 Total Instructors: ${stats.totalInstructors || 0}`);
                    console.log(`📚 Total Courses: ${stats.totalCourses || 0}`);
                    console.log(`📝 Total Enrollments: ${stats.totalEnrollments || 0}`);
                    console.log(`💰 Total Revenue: ₹${stats.totalRevenue || 0}`);
                }

                console.log('='.repeat(60));

                if (parsedData.recentInstructors && parsedData.recentInstructors.length > 0) {
                    console.log(`\n👨‍🏫 Recent Instructors (${parsedData.recentInstructors.length}):`);
                    parsedData.recentInstructors.slice(0, 5).forEach((instructor, i) => {
                        console.log(`   ${i + 1}. ${instructor.name} (${instructor.email}) - ${instructor.courseCount || 0} courses`);
                    });
                } else {
                    console.log('\n⚠️  No instructors data in response');
                }

                if (parsedData.allRegisteredStudents && parsedData.allRegisteredStudents.length > 0) {
                    console.log(`\n👨‍🎓 Registered Students (${parsedData.allRegisteredStudents.length} total, showing first 5):`);
                    parsedData.allRegisteredStudents.slice(0, 5).forEach((student, i) => {
                        console.log(`   ${i + 1}. ${student.name} - ${student.course?.title || 'Unknown Course'}`);
                    });
                } else {
                    console.log('\n⚠️  No registered students data in response');
                }

                console.log('\n✅ All data is being returned from the backend!');
                console.log('🎯 Next step: Set VITE_API_URL in Vercel Dashboard\n');

            } else if (res.statusCode === 401) {
                console.log('🔒 UNAUTHORIZED (401)');
                console.log('This is expected if you did not provide a valid admin token.');
                console.log('The backend is accessible, but requires authentication.\n');
                console.log('To test with authentication, follow the instructions above.');
            } else {
                console.log(`❌ ERROR: Status ${res.statusCode}`);
                console.log('Response:', JSON.stringify(parsedData, null, 2));
            }
        } catch (e) {
            console.log('❌ ERROR: Failed to parse JSON response');
            console.log('Raw response:', data);
        }
    });
});

req.on('error', (error) => {
    console.log('❌ REQUEST FAILED');
    console.log('Error:', error.message);
    console.log('\nPossible causes:');
    console.log('- Backend server is down');
    console.log('- Network connectivity issues');
    console.log('- Invalid URL');
});

req.end();
