// server.js - Main Entry Point
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Simple root check to verify server is alive
app.get('/', (req, res) => {
  res.json({
    message: 'E-Shikshan API is running',
    environment: process.env.NODE_ENV || 'development',
    time: new Date().toISOString()
  });
});

// Catch-all for 404s to help debug missing routes in production
app.use((req, res) => {
  console.log(`⚠️ 404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.url} not found on this server.`,
    tip: 'Check if the route is defined in app.js and the backend is redeployed.'
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`🔗 Local link: http://localhost:${PORT}`);
  console.log(`📡 Deployment link: ${process.env.BACKEND_URL || 'Check Render dashboard'}\n`);
});

