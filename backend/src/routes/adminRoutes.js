import express from 'express';
import {
  getDashboard,
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminGetOrders,
  adminUpdateOrder,
  adminGetCustomers,
  adminGetCustomerDetails,
  adminGetEnquiries,
  adminUpdateEnquiry,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Protect and require admin for all /api/admin routes
router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboard);

// Products
router.get('/products', adminGetProducts);
router.post('/products', adminCreateProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

// Categories
router.get('/categories', adminGetCategories);
router.post('/categories', adminCreateCategory);
router.put('/categories/:id', adminUpdateCategory);
router.delete('/categories/:id', adminDeleteCategory);

// Orders
router.get('/orders', adminGetOrders);
router.put('/orders/:id', adminUpdateOrder);

// Customers
router.get('/customers', adminGetCustomers);
router.get('/customers/:id', adminGetCustomerDetails);

// Enquiries
router.get('/enquiries', adminGetEnquiries);
router.put('/enquiries/:id', adminUpdateEnquiry);

export default router;
