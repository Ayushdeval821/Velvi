import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

/**
 * @desc   Toggle product in wishlist
 * @route  POST /api/wishlist/:productId
 * @access Private
 */
export const toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const user = await User.findById(req.user._id);
  const index = user.wishlist.indexOf(productId);

  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();

  const updatedUser = await User.findById(req.user._id).populate(
    'wishlist',
    'name price discountPrice images slug stock isActive'
  );

  res.json({
    success: true,
    data: updatedUser.wishlist,
  });
});

/**
 * @desc   Get user's wishlist
 * @route  GET /api/wishlist
 * @access Private
 */
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    'wishlist',
    'name price discountPrice images slug stock isActive'
  );

  res.json({
    success: true,
    data: user.wishlist,
  });
});
