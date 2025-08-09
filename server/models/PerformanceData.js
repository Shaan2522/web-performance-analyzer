const mongoose = require('mongoose');

const PerformanceDataSchema = new mongoose.Schema({
  lcp: { type: Number, required: false },
  inp: { type: Number, required: false },
  cls: { type: Number, required: false },
  timestamp: { type: Date, default: Date.now },
  url: { type: String, required: true },
});

module.exports = mongoose.model('PerformanceData', PerformanceDataSchema);