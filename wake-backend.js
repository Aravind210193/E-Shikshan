#!/usr/bin/env node

// Wake up Render backend and test health
const https = require('https');

console.log('🔄 Waking up backend at https://e-shikshan.onrender.com...');
console.log('⏳ This may take 30-60 seconds if the service was sleeping...\n');

const startTime = Date.now();

const req = https.get('https://e-shikshan.onrender.com/health', (res) => {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log(`✅ Backend responded in ${elapsed}s`);
  console.log(`📊 Status Code: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log('📦 Response:', data);
    if (res.statusCode === 200) {
      console.log('\n🎉 Backend is ALIVE and healthy!');
    } else {
      console.log('\n⚠️  Backend responded but with non-200 status');
    }
  });
});

req.on('error', (error) => {
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.error(`\n❌ Error after ${elapsed}s:`, error.message);
  console.log('\n🔍 Possible issues:');
  console.log('  1. Backend service is down in Render dashboard');
  console.log('  2. MongoDB connection failed');
  console.log('  3. Service is still starting up (wait 60s and retry)');
  console.log('\n📋 Action: Check Render dashboard logs');
});

req.setTimeout(65000, () => {
  console.log('\n⏰ Request timed out after 65 seconds');
  console.log('🔍 This likely means the backend is NOT responding');
  console.log('\n📋 Action: Check Render dashboard - service might be failed');
  req.destroy();
});
