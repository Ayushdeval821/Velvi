import express from 'express';
import {
  getProducts,
  getProductByIdOrSlug,
  getFeaturedProducts,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:idOrSlug', getProductByIdOrSlug);

export default router;
