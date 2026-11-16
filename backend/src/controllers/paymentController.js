import asyncHandler from '../utils/asyncHandler.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

// Initialize Razorpay
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

/**
 * @desc   Create a Razorpay order
 * @route  POST /api/payments/create-order
 * @access Private
 */
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (order.isPaid) {
    res.status(400);
    throw new Error('Order is already paid');
  }

  const razorpay = getRazorpayInstance();

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(order.totalPrice * 100), // Amount in paise
    currency: 'INR',
    receipt: order._id.toString(),
    notes: {
      orderNote: `VELVI NATURALS Order #${order._id}`,
    },
  });

  // Save Razorpay order ID to our order
  order.paymentResult = {
    ...order.paymentResult,
    razorpay_order_id: razorpayOrder.id,
  };
  await order.save();

  res.json({
    success: true,
    data: {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    },
  });
});

/**
 * @desc   Verify Razorpay payment signature
 * @route  POST /api/payments/verify
 * @access Private
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error('Missing payment verification data');
  }

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed. Invalid signature.');
  }

  // Update order as paid
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Prevent duplicate payment processing
  if (order.isPaid) {
    return res.json({ success: true, message: 'Order already paid', data: order });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = 'Confirmed';
  order.paymentResult = {
    id: razorpay_payment_id,
    status: 'paid',
    update_time: new Date().toISOString(),
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  };

  await order.save();

  res.json({
    success: true,
    message: 'Payment verified successfully',
    data: order,
  });
});

/**
 * @desc   Get Razorpay key (public key only, safe for frontend)
 * @route  GET /api/payments/key
 * @access Public
 */
export const getRazorpayKey = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      key: process.env.RAZORPAY_KEY_ID || '',
    },
  });
});
