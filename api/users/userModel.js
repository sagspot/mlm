const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    min: 4,
    max: 16,
  },
  email: { type: String, required: true, unique: true, trim: true, min: 4 },
  password: { type: String, required: true, min: 4, max: 1024 },
  inviter: { type: 'objectId', ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['member', 'admin', 'superAdmin'],
    default: 'member',
  },
});

module.exports = mongoose.model('User', userSchema);
