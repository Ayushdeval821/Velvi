import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    subject: {
      type: String,
      default: 'General Enquiry',
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    status: {
      type: String,
      enum: ['New', 'Read', 'Replied', 'Resolved'],
      default: 'New',
    },
    adminReply: {
      type: String,
      default: '',
    },
    repliedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', enquirySchema);
export default Enquiry;
