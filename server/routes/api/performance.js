const express = require('express');
const router = express.Router();
const PerformanceData = require('../../models/PerformanceData');

// @route   GET api/performance
// @desc    Get all performance data
// @access  Public
router.get('/', async (req, res) => {
  try {
    const performanceData = await PerformanceData.find().sort({ timestamp: -1 });
    res.json(performanceData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/performance
// @desc    Add new performance data
// @access  Public
router.post('/', async (req, res) => {
  const { lcp, inp, cls, url } = req.body;

  try {
    const newPerformanceData = new PerformanceData({
      lcp,
      inp,
      cls,
      url,
    });

    const performanceData = await newPerformanceData.save();
    res.json(performanceData);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
