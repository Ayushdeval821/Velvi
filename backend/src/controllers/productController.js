import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';

/**
 * @desc   Get all active products (public, with search/filter/sort/pagination)
 * @route  GET /api/products
 * @access Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
  const skip = (page - 1) * limit;

  const query = { isActive: true };

  // Search
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  // Category filter
  if (req.query.category) {
    query.category = req.query.category;
  }
  if (req.query.categoryName) {
    query.categoryName = { $regex: req.query.categoryName, $options: 'i' };
  }

  // Price filter
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  // Featured filter
  if (req.query.featured === 'true') {
    query.featured = true;
  }

  // Sort
  const sortOptions = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    name_asc: { name: 1 },
    name_desc: { name: -1 },
  };
  const sortBy = sortOptions[req.query.sort] || { createdAt: -1 };

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc   Get single product by slug or ID
 * @route  GET /api/products/:idOrSlug
 * @access Public
 */
export const getProductByIdOrSlug = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;

  let product;
  // If it looks like a MongoDB ObjectId, search by ID
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(idOrSlug).populate('category', 'name slug');
  } else {
    product = await Product.findOne({ slug: idOrSlug, isActive: true }).populate('category', 'name slug');
  }

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    data: product,
  });
});

/**
 * @desc   Get featured products
 * @route  GET /api/products/featured
 * @access Public
 */
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const limit = Math.min(20, Number(req.query.limit) || 4);
  const products = await Product.find({ isActive: true, featured: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  // If no featured products, return latest active products
  if (products.length === 0) {
    const latest = await Product.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return res.json({ success: true, data: latest });
  }

  res.json({ success: true, data: products });
});
