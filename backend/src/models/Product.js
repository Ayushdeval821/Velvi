import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be non-negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price must be non-negative'],
      default: null,
    },
    images: {
      type: [String],
      default: ['/images/stevia-drop.jpg'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    categoryName: {
      type: String,
      default: 'Liquid Sweetener',
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    SKU: {
      type: String,
      unique: true,
      trim: true,
    },
    packSize: {
      type: String,
      default: '10 ml',
    },
    ingredients: {
      type: String,
      default: 'Stevia extract, Purified water, Preservatives as per regulatory norms',
    },
    howToUse: {
      type: String,
      default: 'Add 1-2 drops to tea, coffee, milk, lemonade, or any food. Stir well.',
    },
    benefits: {
      type: [String],
      default: [
        'Natural plant-based sweetness',
        'Convenient 10 ml dropper bottle',
        'Zero added sugar lifestyle companion',
        'Easy to carry and travel-friendly',
      ],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate hook to generate slug and SKU if missing
productSchema.pre('validate', function () {
  if (this.name && (!this.slug || this.isModified('name'))) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 6);
  }
  if (!this.SKU) {
    const prefix = this.name ? this.name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() : 'VEL';
    const rand = Math.floor(10000 + Math.random() * 90000);
    this.SKU = `${prefix}-${rand}`;
  }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
