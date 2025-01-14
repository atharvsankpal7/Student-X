import mongoose from 'mongoose';

const certificateRequestSchema = new mongoose.Schema({
  organizationId: {
    type: String,
    required: true,
    ref: 'User',
  },
  candidateId: {
    type: String,
    required: true,
    ref: 'User',
  },
  certificateId: {
    type: String,
    ref: 'Certificate',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  responseDate: {
    type: Date,
  },
  accessExpiryDate: {
    type: Date,
  }
}, {
  timestamps: true,
});

export default mongoose.models.CertificateRequest || 
  mongoose.model('CertificateRequest', certificateRequestSchema);