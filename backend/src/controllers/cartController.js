import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

/**
 * @desc   Get user's cart
 * @route  GET /api/cart
 * @access Private
 */
export const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'cart.product',
    select: 'name price discountPrice images stock isActive slug packSize',
  });

  // Filter out inactive or deleted products
  const validCart = user.cart.filter((item) => item.product && item.product.isActive);

  res.json({
    success: true,
    data: validCart,
  });
});

/**
 * @desc   Add item to cart or update quantity
 * @route  POST /api/cart
 * @access Private
 */
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    res.status(400);
    throw new Error('Product ID is required');
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found or unavailable');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error(`Only ${product.stock} items available in stock`);
  }

  const user = await User.findById(req.user._id);
  const existingIndex = user.cart.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingIndex > -1) {
    user.cart[existingIndex].quantity = quantity;
  } else {
    user.cart.push({ product: productId, quantity });
  }

  await user.save();

  // Return populated cart
  const updatedUser = await User.findById(req.user._id).populate({
    path: 'cart.product',
    select: 'name price discountPrice images stock isActive slug packSize',
  });

  res.json({
    success: true,
    data: updatedUser.cart,
  });
});

/**
 * @desc   Update cart item quantity
 * @route  PUT /api/cart/:productId
 * @access Private
 */
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  const product = await Product.findById(productId);
  if (!product || !product.isActive) {
    res.status(404);
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error(`Only ${product.stock} items available in stock`);
  }

  const user = await User.findById(req.user._id);
  const item = user.cart.find((item) => item.product.toString() === productId);

  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  item.quantity = quantity;
  await user.save();

  const updatedUser = await User.findById(req.user._id).populate({
    path: 'cart.product',
    select: 'name price discountPrice images stock isActive slug packSize',
  });

  res.json({
    success: true,
    data: updatedUser.cart,
  });
});

/**
 * @desc   Remove item from cart
 * @route  DELETE /api/cart/:productId
 * @access Private
 */
export const removeFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(
    (item) => item.product.toString() !== req.params.productId
  );
  await user.save();

  const updatedUser = await User.findById(req.user._id).populate({
    path: 'cart.product',
    select: 'name price discountPrice images stock isActive slug packSize',
  });

  res.json({
    success: true,
    data: updatedUser.cart,
  });
});

/**
 * @desc   Clear entire cart
 * @route  DELETE /api/cart
 * @access Private
 */
export const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();

  res.json({
    success: true,
    data: [],
  });
});
