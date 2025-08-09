const mongoose = require('mongoose');

const MemorySnapshotSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  url: { type: String, required: true },
  heapUsed: { type: Number, required: true },
  heapTotal: { type: Number, required: true },
  external: { type: Number },
  arrayBuffers: { type: Number },
  // You might want to store more detailed memory metrics here
  // e.g., breakdown by object type, retained sizes, etc.
  // For simplicity, we'll keep it basic for now.
});

module.exports = mongoose.model('MemorySnapshot', MemorySnapshotSchema);
