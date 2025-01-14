import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  worldId: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['issuer', 'candidate', 'organization'],
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profile: {
    type: Map,
    of: String,
    default: {},
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', userSchema);