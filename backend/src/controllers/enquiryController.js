import asyncHandler from '../utils/asyncHandler.js';
import Enquiry from '../models/Enquiry.js';

/**
 * @desc   Create a new enquiry
 * @route  POST /api/enquiries
 * @access Public
 */
export const createEnquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email, and message are required');
  }

  const enquiry = await Enquiry.create({
    name,
    email,
    phone: phone || '',
    subject: subject || 'General Enquiry',
    message,
  });

  res.status(201).json({
    success: true,
    message: 'Your enquiry has been submitted successfully. We will get back to you soon!',
    data: enquiry,
  });
});
