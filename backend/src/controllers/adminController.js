import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Enquiry from '../models/Enquiry.js';
import slugify from 'slugify';

// ─── DASHBOARD ───────────────────────────────────────────────────
export const getDashboard = asyncHandler(async (req, res) => {
  const [totalProducts, totalOrders, totalCustomers, totalEnquiries] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Enquiry.countDocuments(),
  ]);

  const revenueAgg = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = revenueAgg[0]?.total || 0;

  const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
  const confirmedOrders = await Order.countDocuments({ orderStatus: 'Confirmed' });
  const shippedOrders = await Order.countDocuments({ orderStatus: 'Shipped' });
  const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
  const cancelledOrders = await Order.countDocuments({ orderStatus: 'Cancelled' });

  const lowStockProducts = await Product.find({ stock: { $lte: 5 }, isActive: true })
    .select('name stock SKU')
    .lean();

  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  res.json({
    success: true,
    data: {
      totalProducts,
      totalOrders,
      totalCustomers,
      totalEnquiries,
      totalRevenue,
      pendingOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      lowStockProducts,
      recentOrders,
    },
  });
});

// ─── ADMIN: PRODUCTS ─────────────────────────────────────────────
export const adminGetProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { SKU: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query).populate('category', 'name').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
  ]);

  res.json({ success: true, data: products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const adminCreateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, discountPrice, categoryId, stock, isActive, featured, images, packSize, ingredients, howToUse, benefits } = req.body;

  if (!name || !description || price == null) {
    res.status(400);
    throw new Error('Name, description and price are required');
  }

  const product = await Product.create({
    name,
    description,
    price,
    discountPrice: discountPrice || null,
    category: categoryId || null,
    stock: stock || 0,
    isActive: isActive !== false,
    featured: featured || false,
    images: images || [],
    packSize: packSize || '10 ml',
    ingredients: ingredients || undefined,
    howToUse: howToUse || undefined,
    benefits: benefits || undefined,
  });

  res.status(201).json({ success: true, data: product });
});

export const adminUpdateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const fields = ['name', 'description', 'price', 'discountPrice', 'stock', 'isActive', 'featured', 'images', 'packSize', 'ingredients', 'howToUse', 'benefits'];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });
  if (req.body.categoryId !== undefined) product.category = req.body.categoryId;
  if (req.body.name) product.slug = slugify(req.body.name, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 6);

  await product.save();
  res.json({ success: true, data: product });
});

export const adminDeleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});

// ─── ADMIN: CATEGORIES ──────────────────────────────────────────
export const adminGetCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 }).lean();
  res.json({ success: true, data: categories });
});

export const adminCreateCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }
  const category = await Category.create({ name, description, image });
  res.status(201).json({ success: true, data: category });
});

export const adminUpdateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) { res.status(404); throw new Error('Category not found'); }
  if (req.body.name) category.name = req.body.name;
  if (req.body.description !== undefined) category.description = req.body.description;
  if (req.body.image !== undefined) category.image = req.body.image;
  if (req.body.isActive !== undefined) category.isActive = req.body.isActive;
  await category.save();
  res.json({ success: true, data: category });
});

export const adminDeleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) { res.status(404); throw new Error('Category not found'); }
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});

// ─── ADMIN: ORDERS ───────────────────────────────────────────────
export const adminGetOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.status) query.orderStatus = req.query.status;
  if (req.query.isPaid === 'true') query.isPaid = true;
  if (req.query.isPaid === 'false') query.isPaid = false;

  const [total, orders] = await Promise.all([
    Order.countDocuments(query),
    Order.find(query).populate('user', 'name email phone').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
  ]);

  res.json({ success: true, data: orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const adminUpdateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }

  if (req.body.orderStatus) {
    order.orderStatus = req.body.orderStatus;
    if (req.body.orderStatus === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
  }
  if (req.body.trackingNumber) order.trackingNumber = req.body.trackingNumber;
  if (req.body.courierName) order.courierName = req.body.courierName;

  await order.save();
  res.json({ success: true, data: order });
});

// ─── ADMIN: CUSTOMERS ───────────────────────────────────────────
export const adminGetCustomers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const query = { role: 'user' };
  if (req.query.search) {
    query.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [total, customers] = await Promise.all([
    User.countDocuments(query),
    User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
  ]);

  res.json({ success: true, data: customers, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const adminGetCustomerDetails = asyncHandler(async (req, res) => {
  const customer = await User.findById(req.params.id).select('-password');
  if (!customer) { res.status(404); throw new Error('Customer not found'); }

  const orders = await Order.find({ user: customer._id }).sort({ createdAt: -1 }).lean();
  res.json({ success: true, data: { customer, orders } });
});

// ─── ADMIN: ENQUIRIES ───────────────────────────────────────────
export const adminGetEnquiries = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const query = {};
  if (req.query.status) query.status = req.query.status;

  const [total, enquiries] = await Promise.all([
    Enquiry.countDocuments(query),
    Enquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
  ]);

  res.json({ success: true, data: enquiries, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

export const adminUpdateEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.params.id);
  if (!enquiry) { res.status(404); throw new Error('Enquiry not found'); }

  if (req.body.status) enquiry.status = req.body.status;
  if (req.body.adminReply) {
    enquiry.adminReply = req.body.adminReply;
    enquiry.repliedAt = Date.now();
    if (enquiry.status === 'New') enquiry.status = 'Replied';
  }

  await enquiry.save();
  res.json({ success: true, data: enquiry });
});
