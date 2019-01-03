const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  assignment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assignment',
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Student', StudentSchema);
