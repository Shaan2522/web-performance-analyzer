const express = require('express');
const router = express.Router();

// @route   POST api/network
// @desc    Receive network requests data
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { requests } = req.body;
    if (!requests || !Array.isArray(requests)) {
      return res.status(400).json({ msg: 'Invalid data: requests array is required.' });
    }
    console.log(`Received ${requests.length} network requests.`);
    // In a real application, you would save this data to a database.
    // For now, we'll just send a success response.
    res.json({ msg: 'Network requests received successfully', count: requests.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
