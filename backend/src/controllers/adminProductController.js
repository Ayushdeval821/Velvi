import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import generateToken from '../utils/generateToken.js'; // not used here but keep consistency
import slugify from 'slugify';
import { uploadImage } from '../utils/cloudinary.js';

/**
 * @desc   Admin: Create a new product with optional multiple images
 * @route  POST /api/admin/products
 * @access Private/Admin
 */
export const adminCreateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    discountPrice,
    categoryId,
    stock = 0,
    SKU,
    isActive = true,
  } = req.body;

  // Ensure category exists (optional)
  let category = null;
  if (categoryId) {
    category = await Category.findById(categoryId);
    if (!category) {
      res.status(400);
      throw new Error('Category not found');
    }
  }

  // Generate slug from name
  const slug = slugify(name, { lower: true, strict: true });

  // Create product document first (without images)
  const product = new Product({
    name,
    slug,
    description,
    price,
    discountPrice,
    category: category ? category._id : undefined,
    stock,
    SKU,
    isActive,
    images: [], // will be filled after upload
  });

  await product.save();

  // If client sent image files (multipart/form-data), they will be in req.files
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) => uploadImage(file.path));
    const imageUrls = await Promise.all(uploadPromises);
    product.images = imageUrls;
    await product.save();
  }

  res.status(201).json(product);
});

/**
 * @desc   Admin: Update any product field (including images)
 * @route  PUT /api/admin/products/:id
 * @access Private/Admin
 */
export const adminUpdateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updatableFields = [
    'name',
    'description',
    'price',
    'discountPrice',
    'stock',
    'SKU',
    'isActive',
    'categoryId',
  ];

  updatableFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === 'categoryId') {
        product.category = req.body[field];
      } else {
        product[field] = req.body[field];
      }
    }
  });

  // Regenerate slug if name changed
  if (req.body.name) {
    product.slug = slugify(req.body.name, { lower: true, strict: true });
  }

  // Handle new image files (replace existing images)
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) => uploadImage(file.path));
    const imageUrls = await Promise.all(uploadPromises);
    product.images = imageUrls; // overwrite with new set
  }

  await product.save();
  res.json(product);
});

/**
 * @desc   Admin: Soft‑delete (deactivate) a product
 * @route  DELETE /api/admin/products/:id
 * @access Private/Admin
 */
export const adminDeleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  // Soft delete – keep data for analytics, just set isActive false
  product.isActive = false;
  await product.save();
  res.json({ message: 'Product deactivated' });
});

/**
 * @desc   Admin: Permanently remove product (optional endpoint)
 * @route  DELETE /api/admin/products/:id/permanent
 * @access Private/Admin
 */
export const adminPermanentDelete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ message: 'Product permanently removed' });
});

/**
 * @desc   Admin: List all products (including inactive) with pagination & filters
 * @route  GET /api/admin/products
 * @access Private/Admin
 */
export const adminGetProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { description: { $regex: req.query.search, $options: 'i' } },
    ];
  }
  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name slug')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({ page, limit, total, products });
});
