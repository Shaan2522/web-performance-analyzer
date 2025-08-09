const express = require('express');
const router = express.Router();
const MemorySnapshot = require('../../models/MemorySnapshot');

// @route   GET api/memory
// @desc    Get all memory snapshots
// @access  Public
router.get('/', async (req, res) => {
  try {
    const memorySnapshots = await MemorySnapshot.find().sort({ timestamp: -1 });
    res.json(memorySnapshots);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/memory
// @desc    Add new memory snapshot
// @access  Public
router.post('/', async (req, res) => {
  const { url, heapUsed, heapTotal, external, arrayBuffers } = req.body;

  try {
    const newMemorySnapshot = new MemorySnapshot({
      url,
      heapUsed,
      heapTotal,
      external,
      arrayBuffers,
    });

    const memorySnapshot = await newMemorySnapshot.save();
    res.json(memorySnapshot);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/memory/:id
// @desc    Delete a memory snapshot by ID
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const memorySnapshot = await MemorySnapshot.findById(req.params.id);

    if (!memorySnapshot) {
      return res.status(404).json({ msg: 'Memory snapshot not found' });
    }

    await MemorySnapshot.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Memory snapshot removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Memory snapshot not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
