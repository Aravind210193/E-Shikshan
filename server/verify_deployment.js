const fs = require('fs');
const path = require('path');

console.log('🔍 Pre-Deployment Environment Check');
console.log('==================================');

const requiredVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_CALLBACK_URL',
    'CLIENT_URL',
    'EMAIL_USER',
    'EMAIL_PASSWORD'
];

const missingVars = [];
const recommendations = [];

requiredVars.forEach(key => {
    if (!process.env[key]) {
        missingVars.push(key);
    }
});

// Check specific values
if (process.env.CLIENT_URL && process.env.CLIENT_URL.includes('localhost')) {
    recommendations.push(`⚠️  CLIENT_URL is set to '${process.env.CLIENT_URL}'. ensure this is updated to your production frontend URL (e.g., https://myapp.vercel.app) in your deployment settings.`);
}

if (process.env.GOOGLE_CALLBACK_URL && !process.env.GOOGLE_CALLBACK_URL.startsWith('http')) {
    recommendations.push(`ℹ️  GOOGLE_CALLBACK_URL is set to a relative path ('${process.env.GOOGLE_CALLBACK_URL}'). Ensure your Google Cloud Console allows this, or use an absolute URL (e.g., https://api.myapp.com/api/auth/google/callback).`);
}

if (missingVars.length > 0) {
    console.error('❌ MISSING CRITICAL ENVIRONMENT VARIABLES:');
    missingVars.forEach(v => console.error(`   - ${v}`));
    console.log('\nThese must be set in your production environment (Render, Vercel, Heroku, etc.) for the app to function correctly.');
} else {
    console.log('✅ All critical environment variables are verified present.');
}

if (recommendations.length > 0) {
    console.log('\n📝 RECOMMENDATIONS:');
    recommendations.forEach(rec => console.log(rec));
}

console.log('\n==================================');
console.log('💡 TIP: Don\'t forget to run "node sync_students.js" and "node calculate_revenue.js" once in your production console to align data!');
