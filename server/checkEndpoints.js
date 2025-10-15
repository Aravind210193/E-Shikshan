const fetch = require('node-fetch');

const checkEndpoint = async (url) => {
  try {
    console.log(`Checking endpoint: ${url}`);
    const response = await fetch(url);
    const status = response.status;
    
    if (status === 200) {
      console.log(`✓ Endpoint ${url} is working (Status ${status})`);
      try {
        const data = await response.json();
        console.log(`Response data:`, data);
      } catch (e) {
        console.log(`Response is not JSON`);
      }
    } else {
      console.error(`✗ Endpoint ${url} returned status ${status}`);
    }
  } catch (error) {
    console.error(`✗ Error accessing ${url}:`, error.message);
  }
};

// Check server health
checkEndpoint('http://localhost:5000/health');

// Wait a bit before checking other endpoints
setTimeout(async () => {
  // Check API endpoints
  await checkEndpoint('http://localhost:5000/api/auth/profile');
  await checkEndpoint('http://localhost:5000/api/courses/enrolled');
  await checkEndpoint('http://localhost:5000/api/achievements');
}, 1000);