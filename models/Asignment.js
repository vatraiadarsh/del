const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  subject: {
    type: String,
  },
  teacher: {
    type: String,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
