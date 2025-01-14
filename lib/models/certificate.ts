import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
  },
  candidateId: {
    type: String,
    required: true,
    ref: 'User',
  },
  issuerId: {
    type: String,
    required: true,
    ref: 'User',
  },
  issueDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  certificateHash: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  metadata: {
    type: Map,
    of: String,
    default: {},
  },
  status: {
    type: String,
    enum: ['active', 'revoked'],
    default: 'active',
  },
}, {
  timestamps: true,
});

export default mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);