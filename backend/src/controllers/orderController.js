import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

/**
 * @desc   Create a new order (backend recalculates all prices)
 * @route  POST /api/orders
 * @access Private
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'Razorpay', couponCode, notes } = req.body;

  // Get user with populated cart
  const user = await User.findById(req.user._id).populate({
    path: 'cart.product',
    select: 'name price discountPrice images stock isActive SKU',
  });

  if (!user.cart || user.cart.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.postalCode) {
    res.status(400);
    throw new Error('Please provide complete shipping address');
  }

  // Validate stock and build order items (prices from DB, never from frontend)
  const orderItems = [];
  for (const cartItem of user.cart) {
    const product = cartItem.product;
    if (!product || !product.isActive) {
      res.status(400);
      throw new Error(`Product "${cartItem.product?.name || 'unknown'}" is no longer available`);
    }
    if (product.stock < cartItem.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} left.`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      quantity: cartItem.quantity,
      image: product.images[0] || '/images/stevia-drop.jpg',
      price: product.discountPrice && product.discountPrice < product.price
        ? product.discountPrice
        : product.price,
      SKU: product.SKU,
    });
  }

  // Calculate totals on the server
  const itemsPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Shipping logic: Free for orders above ₹299, else ₹49
  const shippingPrice = itemsPrice >= 299 ? 0 : 49;

  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    couponCode: couponCode || null,
    notes: notes || '',
    orderStatus: paymentMethod === 'COD' ? 'Confirmed' : 'Pending',
    isPaid: false,
  });

  // Decrease product stock
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear user's cart
  user.cart = [];
  await user.save();

  res.status(201).json({
    success: true,
    data: order,
  });
});

/**
 * @desc   Get logged-in user's orders
 * @route  GET /api/orders/my
 * @access Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 10);
  const skip = (page - 1) * limit;

  const [total, orders] = await Promise.all([
    Order.countDocuments({ user: req.user._id }),
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

/**
 * @desc   Get order by ID (user can only see own orders)
 * @route  GET /api/orders/:id
 * @access Private
 */
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Only the order owner or admin can see it
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({
    success: true,
    data: order,
  });
});
