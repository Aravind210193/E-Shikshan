const express = require('express');
const router = express.Router();

// Placeholder route until job controller is implemented
router.get('/', (req, res) => {
  res.json({ message: 'Job routes working' });
});

module.exports = router;
